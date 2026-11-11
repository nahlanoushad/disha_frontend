import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const StudentAuthContext = createContext(null);

/**
 * Helper to check whether a JWT token has expired on the client side.
 * Decodes the JWT payload safely without external dependencies.
 */
const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode base64 URL
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    // If exp exists, check if current time passed expiry (exp is in seconds)
    if (decoded && decoded.exp) {
      return decoded.exp * 1000 < Date.now();
    }
    return false;
  } catch {
    return true;
  }
};

export const StudentAuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [studentToken, setStudentToken] = useState(null);
  const [isStudentLoading, setIsStudentLoading] = useState(true);
  const [studentAuthError, setStudentAuthError] = useState(null);

  /**
   * Log out student session.
   * Clears only student-related localStorage keys without touching admin data.
   */
  const studentLogout = () => {
    localStorage.removeItem('disha_student_token');
    localStorage.removeItem('disha_student_user');
    setStudent(null);
    setStudentToken(null);
    setStudentAuthError(null);
  };

  /**
   * On application mount, inspect localStorage for stored student credentials.
   * Performs client-side expiry check on the token.
   * 
   * NOTE ON BACKEND VALIDATION:
   * The backend does not currently have a dedicated student session verification endpoint
   * (e.g. GET /api/auth/user/me). Therefore, session validity on startup is determined by:
   * 1. Existence and parsing of 'disha_student_user'
   * 2. Structural & expiration check of 'disha_student_token'
   * If the token has expired, the student session is purged.
   */
  useEffect(() => {
    const initializeStudentSession = () => {
      try {
        const storedToken = localStorage.getItem('disha_student_token');
        const storedUserJson = localStorage.getItem('disha_student_user');

        if (!storedToken || !storedUserJson) {
          setIsStudentLoading(false);
          return;
        }

        // Check if the JWT has expired
        if (isTokenExpired(storedToken)) {
          console.warn('Student session token has expired. Clearing session.');
          studentLogout();
          setIsStudentLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUserJson);
        if (parsedUser && typeof parsedUser === 'object') {
          setStudentToken(storedToken);
          setStudent(parsedUser);
        } else {
          studentLogout();
        }
      } catch (err) {
        console.error('Failed to restore student session from localStorage:', err);
        studentLogout();
      } finally {
        setIsStudentLoading(false);
      }
    };

    initializeStudentSession();
  }, []);

  /**
   * Authenticate student with email and password using existing api.studentLogin.
   * Updates state and persists token & profile to localStorage.
   */
  const studentLogin = async (email, password) => {
    setStudentAuthError(null);
    try {
      const response = await api.studentLogin(email, password);
      const authToken = response.token;
      const userData = response.data?.user;

      if (!authToken || !userData) {
        throw new Error('Invalid response structure received from authentication server.');
      }

      // Persist credentials
      localStorage.setItem('disha_student_token', authToken);
      localStorage.setItem('disha_student_user', JSON.stringify(userData));

      setStudentToken(authToken);
      setStudent(userData);

      return response;
    } catch (err) {
      const errorMsg = err.message || 'Student login failed. Please check your credentials.';
      setStudentAuthError(errorMsg);
      throw err;
    }
  };

  const value = {
    student,
    studentToken,
    isStudentAuthenticated: !!student && !!studentToken,
    isStudentLoading,
    studentAuthError,
    setStudentAuthError,
    studentLogin,
    studentLogout
  };

  return (
    <StudentAuthContext.Provider value={value}>
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
};

export default StudentAuthContext;
