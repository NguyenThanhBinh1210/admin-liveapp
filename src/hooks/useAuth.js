import { useState, useEffect } from 'react';
import { isAuthenticated, getToken } from 'api';

// ==============================|| AUTH HOOK ||============================== //

/**
 * Custom hook để kiểm tra authentication status
 * @returns {Object} { isAuth, token, checkAuth }
 */
export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [token, setToken] = useState(getToken());

  // Function để re-check authentication
  const checkAuth = () => {
    const authStatus = isAuthenticated();
    const currentToken = getToken();
    setIsAuth(authStatus);
    setToken(currentToken);
    return authStatus;
  };

  // Check auth status khi component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuth,
    token,
    checkAuth
  };
};

export default useAuth; 