import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, AlertCircle, Save } from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';
import { studentApi } from '../../services/studentApi.js';

const StudentProfile = () => {
  const { student, refreshProfile } = useStudentAuth();
  
  const [formData, setFormData] = useState({
    name: student?.name || '',
    phone: student?.phone || ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    // We import dynamically above, but to be robust let's just use the direct fetch or context.
    // Actually, we can use studentApi from the import directly.
    try {
      await studentApi.updateProfile({
        name: formData.name,
        phone: formData.phone
      });
      
      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.25rem' }}>
          My Profile
        </h1>
        <p style={{ color: '#5b5273', fontSize: '0.95rem' }}>
          Manage your personal information and account settings
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        
        {message.text && (
          <div style={{
            padding: '1rem',
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#ecfdf5',
            color: message.type === 'error' ? '#b91c1c' : '#047857',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            border: `1px solid ${message.type === 'error' ? '#fee2e2' : '#d1fae5'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.type === 'error' ? <AlertCircle size={18} /> : <ShieldCheck size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            {/* Name Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                  style={{ 
                    paddingLeft: '2.75rem',
                    backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                  required
                />
              </div>
            </div>

            {/* Email Field (Disabled) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={student.email}
                  disabled
                  className="form-input"
                  style={{ 
                    paddingLeft: '2.75rem',
                    backgroundColor: '#f9fafb',
                    cursor: 'not-allowed',
                    color: '#6b7280'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Email cannot be changed</span>
            </div>

            {/* Phone Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+91 0000000000"
                  className="form-input"
                  style={{ 
                    paddingLeft: '2.75rem',
                    backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                />
              </div>
            </div>

            {/* Joined Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035' }}>Member Since</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={new Date(student.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  disabled
                  className="form-input"
                  style={{ 
                    paddingLeft: '2.75rem',
                    backgroundColor: '#f9fafb',
                    cursor: 'not-allowed',
                    color: '#6b7280'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: student.name, phone: student.phone });
                    setMessage({ type: '', text: '' });
                  }}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
