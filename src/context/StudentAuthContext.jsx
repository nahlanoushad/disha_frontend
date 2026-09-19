import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentApi } from '../services/studentApi.js';

const StudentAuthContext = createContext(null);

export const StudentAuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('disha_student_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify token on app startup
  useEffect(() => {
    const verifyExistingSession = async () => {
      const storedToken = localStorage.getItem('disha_student_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await studentApi.getProfile(storedToken);
        if (response.data && response.data.student) {
          setStudent(response.data.student);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Student session verification failed, logging out:', err.message);
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
      const response = await studentApi.login(email, password);
      const authToken = response.token;
      const studentData = response.data.student;

      localStorage.setItem('disha_student_token', authToken);
      setToken(authToken);
      setStudent(studentData);
      return studentData;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const register = async (data) => {
    setAuthError(null);
    try {
      const response = await studentApi.register(data);
      return response.data.student;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('disha_student_token');
    setToken(null);
    setStudent(null);
    setAuthError(null);
  };

  const refreshProfile = async () => {
    const currentToken = token || localStorage.getItem('disha_student_token');
    if (!currentToken) return null;
    try {
      const response = await studentApi.getProfile(currentToken);
      if (response.data && response.data.student) {
        setStudent(response.data.student);
        return response.data.student;
      }
    } catch (err) {
      console.error('Failed to refresh student profile:', err.message);
      throw err;
    }
  };

  const value = {
    student,
    token,
    isAuthenticated: !!student && !!token,
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    refreshProfile
  };

  return <StudentAuthContext.Provider value={value}>{children}</StudentAuthContext.Provider>;
};

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
};

export default StudentAuthContext;
