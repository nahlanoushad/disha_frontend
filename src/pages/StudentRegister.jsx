import React, { useState } from 'react';
import api from '../services/api.js';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

/**
 * Student Registration Page Component
 * 
 * Props:
 * - onRegistrationSuccess: Callback function called with registered email on success: (email) => void
 * - onNavigateToLogin: Callback function to switch to Student Login view: () => void
 * - onNavigateToPublic: Callback function to return to public homepage: () => void
 */
const StudentRegister = ({ onRegistrationSuccess, onNavigateToLogin, onNavigateToPublic }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (val) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // 1. Validate required fields
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    // 2. Validate email format
    if (!validateEmail(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // 3. Validate password length (minimum 6 characters)
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    // 4. Validate password confirmation
    if (password !== confirmPassword) {
      setErrorMessage('Confirm password does not match password');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.studentRegister(name.trim(), email.trim(), password);
      
      const successNotice = response.message || 'Registration initiated! Please check your email for the OTP.';
      setSuccessMessage(successNotice);

      // Trigger callback passing the registered email so parent can route to OTP verification
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess(email.trim());
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
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

      {/* Main Registration Card */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.5rem',
        position: 'relative',
        zIndex: 1,
        borderRadius: '24px',
        border: '1.5px solid #ede9fe',
        background: '#ffffff',
        boxShadow: '0 20px 45px -10px rgba(124, 58, 237, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
            Create your account to access higher education assistance
          </p>
        </div>

        {/* Informational Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.65rem 0.9rem',
          borderRadius: '12px',
          backgroundColor: '#f5f3ff',
          border: '1px solid #ddd6fe',
          marginBottom: '1.25rem',
          fontSize: '0.8rem',
          color: '#6d28d9'
        }}>
          <Sparkles size={16} color="#7c3aed" style={{ flexShrink: 0 }} />
          <span>Quick 2-step setup: register details, then verify OTP via email.</span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#059669',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#1e1035',
              marginBottom: '0.45rem'
            }}>
              Full Name
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
                <User size={18} />
              </div>
              <input
                id="student-name-input"
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                style={{ paddingLeft: '2.75rem' }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email Address */}
          <div style={{ marginBottom: '1.2rem' }}>
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
                id="student-email-input"
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

          {/* Password */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#1e1035',
              marginBottom: '0.45rem'
            }}>
              Password <span style={{ color: '#7c6f93', fontWeight: 400 }}>(min. 6 characters)</span>
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
                id="student-password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.6rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#1e1035',
              marginBottom: '0.45rem'
            }}>
              Confirm Password
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
                id="student-confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                style={{ paddingLeft: '2.75rem' }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Register Submit Button */}
          <button
            id="student-register-submit"
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.975rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%' }} />
                Registering Account...
              </>
            ) : (
              <>
                Create Student Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid #ede9fe', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#5b5273', marginBottom: '0.65rem' }}>
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
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
              Login
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

export default StudentRegister;
