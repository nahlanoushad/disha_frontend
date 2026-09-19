import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Mail, Lock } from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';

const StudentLogin = ({ onNavigateToRegister, onNavigateToPublic }) => {
  const { login } = useStudentAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      // Navigation is automatically handled by the App component once isAuthenticated is true
    } catch (err) {
      setError(err.message || 'Invalid email or password');
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
        bottom: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
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
            Student Portal
          </h2>
          <p style={{ color: '#5b5273', fontSize: '0.95rem' }}>
            Sign in to your DISHA account
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Password</label>
              </div>
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
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
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
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#5b5273' }}>
            <p>
              Don't have an account?{' '}
              <button
                onClick={onNavigateToRegister}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7c3aed',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Create one now
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

export default StudentLogin;
