import React, { useState } from 'react';
import { GraduationCap, ArrowRight, User, Mail, Lock, Phone } from 'lucide-react';
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
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fbfaff',
      color: '#1e1035',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
            marginBottom: '1rem'
          }}>
            <GraduationCap size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.25rem' }}>
            Student Registration
          </h2>
          <p style={{ color: '#5b5273', fontSize: '0.95rem' }}>
            Create your account to start your journey
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          {error && (
            <div style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              border: '1px solid #fee2e2',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              border: '1px solid #d1fae5',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || success}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                marginTop: '0.5rem',
                justifyContent: 'center'
              }}
            >
              {isLoading ? (
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#5b5273' }}>
            <p>
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7c3aed',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={onNavigateToPublic}
            style={{
              background: 'none',
              border: 'none',
              color: '#7c6f93',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = '#1e1035'}
            onMouseOut={(e) => e.target.style.color = '#7c6f93'}
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
