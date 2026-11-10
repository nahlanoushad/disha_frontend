import React, { useState } from 'react';
import { useStudentAuth } from '../context/StudentAuthContext.jsx';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

/**
 * Student Login Page Component
 * 
 * Props:
 * - initialEmail: Optional prefilled email address: string
 * - onLoginSuccess: Callback function called with login response: (response) => void
 * - onNavigateToRegister: Callback function to switch to Student Register view: () => void
 * - onNavigateToVerify: Callback function to switch to OTP Verification view: (email) => void
 * - onNavigateToPublic: Callback function to return to public homepage: () => void
 */
const StudentLogin = ({
  initialEmail = '',
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToVerify,
  onNavigateToPublic
}) => {
  const { studentLogin } = useStudentAuth();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setNeedsVerification(false);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password');
      return;
    }

    setIsSubmitting(true);
    try {
      // Delegate authentication & session persistence to StudentAuthContext
      const response = await studentLogin(email.trim(), password);

      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);

      // Check if user needs OTP verification
      if (msg.toLowerCase().includes('verify') && onNavigateToVerify) {
        setNeedsVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1.5rem',
      backgroundColor: '#fbfaff'
    }}>
      {/* Ambient Violet Mesh Accents matching DISHA brand */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0) 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.10) 0%, rgba(147, 51, 234, 0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Main Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem',
        position: 'relative',
        zIndex: 1,
        borderRadius: '24px',
        border: '1.5px solid #ede9fe',
        background: '#ffffff',
        boxShadow: '0 20px 45px -10px rgba(124, 58, 237, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
            marginBottom: '1rem'
          }}>
            <GraduationCap size={34} color="#ffffff" strokeWidth={2.2} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1e1035' }}>
              DISHA
            </h1>
            <span className="badge badge-violet" style={{ fontSize: '0.72rem' }}>
              Student Portal
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#5b5273' }}>
            Welcome back! Log in to continue your education guidance
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>

            {needsVerification && (
              <button
                type="button"
                onClick={() => onNavigateToVerify(email.trim())}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  color: '#7c3aed',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Click here to verify your OTP now →
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#1e1035',
              marginBottom: '0.45rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#7c6f93',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Mail size={18} />
              </div>
              <input
                id="student-login-email-input"
                type="email"
                className="form-input"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{ paddingLeft: '2.75rem' }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#1e1035',
              marginBottom: '0.45rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#7c6f93',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Lock size={18} />
              </div>
              <input
                id="student-login-password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#7c6f93',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="student-login-submit"
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.975rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%' }} />
                Signing In...
              </>
            ) : (
              <>
                Sign In to Student Portal
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid #ede9fe', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#5b5273', marginBottom: '0.65rem' }}>
            Don't have an account yet?{' '}
            <button
              onClick={onNavigateToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#7c3aed',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Sign Up
            </button>
          </p>

          {onNavigateToPublic && (
            <button
              onClick={onNavigateToPublic}
              style={{
                background: 'none',
                border: 'none',
                color: '#5b5273',
                fontSize: '0.825rem',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.target.style.color = '#7c3aed'}
              onMouseLeave={(e) => e.target.style.color = '#5b5273'}
            >
              ← Return to Public Homepage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
