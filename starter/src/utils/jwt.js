import { jwtDecode } from "jwt-decode";
import axios from "./axios";

/**
 * Checks if the provided JWT token is valid (not expired).
 *
 * @param {string} accessToken - The JWT access token to validate.
 * @returns {boolean} - Returns `true` if the token is valid, otherwise `false`.
 */
const isTokenValid = (accessToken) => {
  if (typeof accessToken !== "string") {
    console.error("Invalid token format.");
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // Current time in seconds since epoch

    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return false;
  }
};

/**
 * Sets or removes the authentication tokens in local storage and axios headers.
 *
 * @param {Object} tokens - The JWT tokens with access and refresh properties. If `null`, the session will be cleared.
 */
const setSession = (tokens) => {
  if (tokens && tokens.access) {
    // Store tokens in local storage
    localStorage.setItem("accessToken", tokens.access);
    if (tokens.refresh) {
      localStorage.setItem("refreshToken", tokens.refresh);
    }
    if (tokens.tipo_usuario) {
      localStorage.setItem("tipo_usuario", tokens.tipo_usuario);
    }
    
    // Set authorization header for axios
    axios.defaults.headers.common.Authorization = `Bearer ${tokens.access}`;
  } else {
    // Remove tokens from local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tipo_usuario");
    
    // Delete authorization header from axios
    delete axios.defaults.headers.common.Authorization;
  }
};

/**
 * Get stored tokens from localStorage
 * 
 * @returns {Object|null} - Object with access and refresh tokens or null if not present
 */
const getStoredTokens = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const tipo_usuario = localStorage.getItem("tipo_usuario");
  
  if (accessToken) {
    return {
      access: accessToken,
      refresh: refreshToken,
      tipo_usuario: tipo_usuario
    };
  }
  
  return null;
};

export { isTokenValid, setSession, getStoredTokens };