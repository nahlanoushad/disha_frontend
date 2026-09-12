import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  KeyRound,
  GraduationCap
} from 'lucide-react';

const AdminLogin = ({ onNavigateToPublic }) => {
  const { login, authError, setAuthError } = useAuth();
  
  const [email, setEmail] = useState('admin@disha.edu');
  const [password, setPassword] = useState('admin@1234#');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email/username and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@disha.edu');
    setPassword('admin@1234#');
    setLocalError('');
  };

  const displayError = localError || authError;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem',
      backgroundColor: '#fbfaff'
    }}>
      {/* Ambient Violet Mesh Accents */}
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
              Admin Portal
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#5b5273' }}>
            Digital Intelligent System for Higher Education Assistance
          </p>
        </div>

        {/* Security Alert Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.65rem 0.9rem',
          borderRadius: '12px',
          backgroundColor: '#f5f3ff',
          border: '1px solid #ddd6fe',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
          color: '#6d28d9'
        }}>
          <ShieldCheck size={18} color="#7c3aed" style={{ flexShrink: 0 }} />
          <span>Restricted access. Authorized administrator credentials required.</span>
        </div>

        {/* Error Alert */}
        {displayError && (
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
            <span>{displayError}</span>
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
              Email or Username
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
                id="admin-email-input"
                type="text"
                className="form-input"
                placeholder="admin@disha.edu"
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.45rem'
            }}>
              <label style={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#1e1035'
              }}>
                Password
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7c3aed',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <KeyRound size={12} /> Auto-fill Demo
              </button>
            </div>
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
                id="admin-password-input"
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
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="admin-login-submit"
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.975rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%' }} />
                Authenticating...
              </>
            ) : (
              <>
                Sign In to Admin Panel
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        {onNavigateToPublic && (
          <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
