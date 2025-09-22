// Import Dependencies
import { Navigate, useLocation, useOutlet } from "react-router";
import { useEffect, useState } from "react";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { GHOST_ENTRY_PATH, REDIRECT_URL_KEY } from "../constants/app.constant";
import { getStoredTokens } from "utils/jwt";

// ----------------------------------------------------------------------

export default function AuthGuard() {
  const outlet = useOutlet();
  const { isAuthenticated, isInitialized } = useAuthContext();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Additional verification for token existence
  const tokens = getStoredTokens();
  const actuallyAuthenticated = isAuthenticated || Boolean(tokens?.access);

  useEffect(() => {
    // Only set ready when auth is initialized
    if (isInitialized) {
      setIsReady(true);
    }
  }, [isInitialized]);

  if (!isReady) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-100vh grid w-full grow place-items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-dark-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (!actuallyAuthenticated) {
    // Redirect to login page with return URL
    return (
      <Navigate
        to={`${GHOST_ENTRY_PATH}?${REDIRECT_URL_KEY}=${location.pathname}`}
        replace
      />
    );
  }

  return <>{outlet}</>;
}