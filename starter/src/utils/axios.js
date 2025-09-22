import axios from 'axios';

// Update this URL to match your Django backend
const JWT_HOST_API = 'http://localhost:8000/';

const axiosInstance = axios.create({
  baseURL: JWT_HOST_API,
});

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Attempt to refresh the token
          const response = await axios.post(`${JWT_HOST_API}api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          
          // Update access token in storage and headers
          localStorage.setItem('accessToken', access);
          axios.defaults.headers.common.Authorization = `Bearer ${access}`;
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch {  // Renamed the error parameter to refreshError
        // If refresh token is invalid, clear session
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common.Authorization;
        
        // Redirect to login page - you'll handle this in the AuthContext
        window.dispatchEvent(new CustomEvent('logout'));
      }
    }
    
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;