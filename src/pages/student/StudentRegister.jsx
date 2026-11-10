import React, { useState } from 'react';
import { GraduationCap, ArrowRight, User, Mail, Lock, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';

const StudentRegister = ({ onNavigateToLogin, onNavigateToPublic }) => {
  const { register } = useStudentAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        onNavigateToLogin();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: '2rem 1rem',
        position: 'relative'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Back to Home button */}
        <button
          onClick={onNavigateToPublic}
          style={{
            background: 'none',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '1.5rem',
            padding: 0
          }}
          onMouseOver={(e) => (e.target.style.color = '#1d4ed8')}
          onMouseOut={(e) => (e.target.style.color = '#64748b')}
        >
          <ArrowLeft size={16} /> Back to DISHA Home
        </button>

        {/* Card */}
        <div
          className="disha-card"
          style={{
            padding: '2.5rem 2rem',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)'
          }}
        >
          {/* Logo Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)',
                marginBottom: '1rem',
                color: '#ffffff'
              }}
            >
              <GraduationCap size={28} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
              Create Student Account
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', textAlign: 'center' }}>
              Start your higher education journey after Plus Two
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#be123c',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.5rem'
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Registration successful! Redirecting to sign in...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Nahla Noushad"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210 (For exam deadline SMS)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '0.5rem',
                fontSize: '0.95rem'
              }}
            >
              {isLoading ? (
                <>
                  <div
                    className="spinner"
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%'
                    }}
                  />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center'
            }}
          >
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Already registered on DISHA?
            </p>
            <button
              onClick={onNavigateToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#1d4ed8',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: 0
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
            >
              Sign In to Your Account &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
