// Import Dependencies
import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";

// Local Imports
import axios from "utils/axios";
import { isTokenValid, setSession, getStoredTokens } from "utils/jwt";
import { AuthContext } from "./context";

// ----------------------------------------------------------------------


const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      isLoading: false,
      user,
    };
  },

  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
      errorMessage: null,
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      errorMessage: null,
      user,
    };
  },

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);


  // Handle token refresh and initialization
  useEffect(() => {
    const init = async () => {
      try {
        // Get tokens from localStorage
        const tokens = getStoredTokens();

        if (tokens && tokens.access && isTokenValid(tokens.access)) {
          // Set session with existing tokens
          setSession(tokens);

          // Fetch user profile from Django backend
          const response = await axios.get("Usuarios/profile/");
          const user = response.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });



        } else if (tokens && tokens.refresh) {
          try {
            // Try to refresh the token
            const response = await axios.post("api/token/refresh/", {
              refresh: tokens.refresh,
            });

            const newTokens = {
              access: response.data.access,
              refresh: tokens.refresh,
            };

            setSession(newTokens);

            // Fetch user profile
            const userResponse = await axios.get("Usuarios/profile/");
            const user = userResponse.data;

            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: true,
                user,
              },
            });



          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            setSession(null);
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        } else {
          // No valid tokens found
          setSession(null);
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    init();

    // Listen for logout events from axios interceptor
    const handleLogout = () => {
      dispatch({ type: "LOGOUT" });
    };

    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({
      type: "LOGIN_REQUEST",
    });

    try {
      // Adapt to Django Simple JWT format
      const response = await axios.post("api/token/", credentials);
      const tokens = response.data; // Should have access and refresh tokens

      setSession(tokens);

      // Fetch user profile after successful login
      const userResponse = await axios.get("Usuarios/profile/");
      const user = userResponse.data;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
        },
      });

      // redirección por tipo de usuario
      console.log(tokens.tipo_usuario);
      switch (tokens.tipo_usuario) {
        case "Administrador":
          window.location.href = "/dashboards/home";
          break;
        case "Atleta":
          window.location.href = "/dashboards/Atleta";
          break;
        case "Profesional Salud":
          window.location.href = "/dashboards/home";
          break;
        case "Entrenador":
          window.location.href = "/modulos/Programas-Entrenamiento";
          break;
        default:
          window.location.href = "/"; // Redirección por defecto
          break;
      }

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Authentication failed";

      if (err.response?.data) {
        // Format Django REST Framework error messages
        if (typeof err.response.data === 'object') {
          errorMessage = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }

      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage,
        },
      });

      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    // No need to call an API endpoint for JWT logout
    // Simply remove the tokens from local storage
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};