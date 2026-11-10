import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import {
  GraduationCap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

/**
 * Student OTP Verification Page Component
 * 
 * Props:
 * - email: The student's email address (passed from registration): string
 * - onVerificationSuccess: Callback called with backend response on successful verification: (response) => void
 * - onNavigateToLogin: Callback to navigate to the student login page: () => void
 * - onNavigateToRegister: Callback to navigate back to the registration page: () => void
 */
const StudentVerifyOtp = ({
  email,
  onVerificationSuccess,
  onNavigateToLogin,
  onNavigateToRegister
}) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 60-second cooldown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle OTP input - accept only numbers up to exactly 6 digits
  const handleOtpChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  // Submit OTP Verification
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Missing email address. Please return to registration.');
      return;
    }

    if (!otp || otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.studentVerifyOtp(email, otp);
      setSuccessMessage(response.message || 'Email verified successfully!');

      if (onVerificationSuccess) {
        setTimeout(() => {
          onVerificationSuccess(response);
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'OTP verification failed. Please check the code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Missing email address. Please return to registration.');
      return;
    }

    setIsResending(true);
    try {
      const response = await api.studentResendOtp(email);
      setSuccessMessage(response.message || 'A new verification code has been sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend verification code. Please try again later.');
    } finally {
      setIsResending(false);
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
        right: '-10%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0) 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.10) 0%, rgba(147, 51, 234, 0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Main Card */}
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

          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e1035', marginTop: '0.75rem', marginBottom: '0.35rem' }}>
            Verify Your Email
          </h2>

          {/* Email Notice */}
          {email ? (
            <p style={{ fontSize: '0.875rem', color: '#5b5273', lineHeight: 1.5 }}>
              We sent a 6-digit verification code to
              <br />
              <strong style={{ color: '#1e1035', wordBreak: 'break-all' }}>{email}</strong>
            </p>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#e11d48' }}>
              No email address provided. Please return to registration.
            </p>
          )}
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

        {/* Graceful Fallback if email is missing */}
        {!email ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              <ArrowLeft size={16} />
              Go to Registration
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifySubmit}>
            {/* 6-Digit OTP Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#1e1035'
                }}>
                  Enter 6-Digit Code
                </label>

                {/* Resend OTP Button */}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isResending}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown > 0 ? '#7c6f93' : '#7c3aed',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: 0
                  }}
                >
                  <RefreshCw size={12} className={isResending ? 'spinner' : ''} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="student-otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="form-input"
                  placeholder="••••••"
                  value={otp}
                  onChange={handleOtpChange}
                  style={{
                    textAlign: 'center',
                    letterSpacing: '0.65rem',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    padding: '0.75rem 1rem'
                  }}
                  disabled={isSubmitting}
                />
              </div>

              <p style={{
                fontSize: '0.75rem',
                color: '#7c6f93',
                marginTop: '0.45rem',
                textAlign: 'center'
              }}>
                The verification code will expire in 10 minutes
              </p>
            </div>

            {/* Verify Button */}
            <button
              id="student-verify-otp-submit"
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.975rem' }}
              disabled={isSubmitting || otp.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%'
                  }} />
                  Verifying OTP...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          borderTop: '1px solid #ede9fe',
          paddingTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          {onNavigateToRegister && (
            <p style={{ fontSize: '0.85rem', color: '#5b5273' }}>
              Entered the wrong email?{' '}
              <button
                type="button"
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
                Back to Registration
              </button>
            </p>
          )}

          {onNavigateToLogin && (
            <p style={{ fontSize: '0.85rem', color: '#5b5273' }}>
              Already verified?{' '}
              <button
                type="button"
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
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentVerifyOtp;
