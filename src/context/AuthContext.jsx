import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('disha_admin_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify token on app startup
  useEffect(() => {
    const verifyExistingSession = async () => {
      const storedToken = localStorage.getItem('disha_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe(storedToken);
        if (response.data && response.data.admin) {
          setAdmin(response.data.admin);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingSession();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await api.login(email, password);
      const authToken = response.token;
      const adminData = response.data.admin;

      localStorage.setItem('disha_admin_token', authToken);
      setToken(authToken);
      setAdmin(adminData);
      return adminData;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('disha_admin_token');
    setToken(null);
    setAdmin(null);
    setAuthError(null);
  };

  const refreshProfile = async () => {
    const currentToken = token || localStorage.getItem('disha_admin_token');
    if (!currentToken) return null;
    try {
      const response = await api.getMe(currentToken);
      if (response.data && response.data.admin) {
        setAdmin(response.data.admin);
        return response.data.admin;
      }
    } catch (err) {
      console.error('Failed to refresh admin profile:', err.message);
      throw err;
    }
  };

  const value = {
    admin,
    token,
    isAuthenticated: !!admin && !!token,
    isLoading,
    authError,
    setAuthError,
    login,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
