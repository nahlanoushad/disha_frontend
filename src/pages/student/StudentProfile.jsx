import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Save,
  BookOpen,
  MapPin,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';
import { studentApi } from '../../services/studentApi.js';

const AVAILABLE_STREAMS = [
  'Science (Bio-Maths)',
  'Science (Computer-Maths)',
  'Commerce with Maths',
  'Commerce with Computer / IP',
  'Humanities & Arts',
  'Vocational Higher Secondary'
];

const AVAILABLE_INTERESTS = [
  'Engineering & Technology',
  'Computer Applications & AI',
  'Medicine & Healthcare',
  'Commerce & Finance',
  'Business Administration',
  'Design & Architecture',
  'Law & Governance',
  'Pure Sciences & Research'
];

const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

const StudentProfile = () => {
  const { student, refreshProfile } = useStudentAuth();

  const [activeSection, setActiveSection] = useState('academic'); // 'academic' | 'preferences' | 'personal'
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form state from student data
  const [formData, setFormData] = useState({
    name: student?.name || '',
    phone: student?.phone || '',
    academicProfile: {
      qualification: student?.academicProfile?.qualification || 'Higher Secondary / Plus Two',
      plusTwoStatus: student?.academicProfile?.plusTwoStatus || 'Completed',
      board: student?.academicProfile?.board || 'State Board (DHSE Kerala)',
      stream: student?.academicProfile?.stream || '',
      subjects: student?.academicProfile?.subjects || [],
      passingYear: student?.academicProfile?.passingYear || '2026',
      marksPercentage: student?.academicProfile?.marksPercentage || '',
      schoolName: student?.academicProfile?.schoolName || ''
    },
    location: {
      state: student?.location?.state || 'Kerala',
      district: student?.location?.district || '',
      city: student?.location?.city || ''
    },
    preferences: {
      interestedStreams: student?.preferences?.interestedStreams || [],
      preferredLocations: student?.preferences?.preferredLocations || ['In-State (Kerala)'],
      budgetRange: student?.preferences?.budgetRange || '₹50,000 - ₹1.5 Lakhs / year',
      preferredDuration: student?.preferences?.preferredDuration || '3 - 4 Years'
    },
    interests: student?.interests || []
  });

  // Sync state if student changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        phone: student.phone || '',
        academicProfile: {
          qualification: student.academicProfile?.qualification || 'Higher Secondary / Plus Two',
          plusTwoStatus: student.academicProfile?.plusTwoStatus || 'Completed',
          board: student.academicProfile?.board || 'State Board (DHSE Kerala)',
          stream: student.academicProfile?.stream || '',
          subjects: student.academicProfile?.subjects || [],
          passingYear: student.academicProfile?.passingYear || '2026',
          marksPercentage: student.academicProfile?.marksPercentage || '',
          schoolName: student.academicProfile?.schoolName || ''
        },
        location: {
          state: student.location?.state || 'Kerala',
          district: student.location?.district || '',
          city: student.location?.city || ''
        },
        preferences: {
          interestedStreams: student.preferences?.interestedStreams || [],
          preferredLocations: student.preferences?.preferredLocations || ['In-State (Kerala)'],
          budgetRange: student.preferences?.budgetRange || '₹50,000 - ₹1.5 Lakhs / year',
          preferredDuration: student.preferences?.preferredDuration || '3 - 4 Years'
        },
        interests: student.interests || []
      });
    }
  }, [student]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleInterestToggle = (item) => {
    setFormData((prev) => {
      const current = prev.preferences.interestedStreams || [];
      const updated = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          interestedStreams: updated
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await studentApi.updateProfile({
        name: formData.name,
        phone: formData.phone,
        academicProfile: formData.academicProfile,
        location: formData.location,
        preferences: formData.preferences,
        interests: formData.interests
      });

      await refreshProfile();
      setMessage({ type: 'success', text: 'Academic profile successfully updated & synced!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!student) return null;

  const completionPercentage = student.profileCompletionPercentage || 30;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Academic & Guidance Profile
          </h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>
            Your qualifications, scores, and preferences power personalized course and college matches.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn-primary"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}
        >
          {isLoading ? (
            'Saving Profile...'
          ) : (
            <>
              <Save size={16} />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* Profile Completion Progress Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1.5px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #cbd5e1'
              }}
            >
              <Sparkles size={19} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Profile Completion Status
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                {completionPercentage >= 70
                  ? 'Your profile is ready for verified course and college recommendations.'
                  : 'Complete your Plus Two stream and marks to unlock accurate recommendations.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              className={completionPercentage >= 70 ? 'badge badge-emerald' : 'badge badge-amber'}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              {completionPercentage}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '8px',
            backgroundColor: '#e2e8f0',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${completionPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #1d4ed8 0%, #10b981 100%)',
              borderRadius: '9999px',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>

      {/* Alert Notification */}
      {message.text && (
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#ecfdf5',
            color: message.type === 'error' ? '#b91c1c' : '#047857',
            borderRadius: '12px',
            fontSize: '0.88rem',
            marginBottom: '1.75rem',
            border: `1.5px solid ${message.type === 'error' ? '#fee2e2' : '#d1fae5'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span style={{ fontWeight: 500 }}>{message.text}</span>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1.5px solid #e2e8f0',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}
      >
        {[
          { id: 'academic', label: '1. Academic Information', icon: GraduationCap },
          { id: 'preferences', label: '2. Study & Career Preferences', icon: BookOpen },
          { id: 'personal', label: '3. Personal & Location', icon: User }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px 10px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: activeSection === sec.id ? 700 : 500,
              color: activeSection === sec.id ? '#1d4ed8' : '#475569',
              backgroundColor: activeSection === sec.id ? '#ffffff' : 'transparent',
              borderBottom: activeSection === sec.id ? '2.5px solid #1d4ed8' : '2.5px solid transparent',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap'
            }}
          >
            <sec.icon size={17} color={activeSection === sec.id ? '#1d4ed8' : '#64748b'} />
            {sec.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: ACADEMIC INFORMATION */}
        {activeSection === 'academic' && (
          <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Higher Secondary / Plus Two Records
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                Provide accurate details to verify course minimum eligibility criteria.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              {/* Qualification */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Current Highest Qualification
                </label>
                <select
                  className="form-input"
                  value={formData.academicProfile.qualification}
                  onChange={(e) => handleNestedChange('academicProfile', 'qualification', e.target.value)}
                >
                  <option value="Higher Secondary / Plus Two">Higher Secondary / Plus Two (12th)</option>
                  <option value="Secondary (10th)">Secondary School (10th)</option>
                  <option value="Polytechnic / Diploma">Polytechnic / Diploma</option>
                  <option value="Undergraduate">Currently Undergraduate</option>
                </select>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Plus Two Completion Status
                </label>
                <select
                  className="form-input"
                  value={formData.academicProfile.plusTwoStatus}
                  onChange={(e) => handleNestedChange('academicProfile', 'plusTwoStatus', e.target.value)}
                >
                  <option value="Completed">Completed (Passed)</option>
                  <option value="Pursuing">Appearing / In Final Year</option>
                  <option value="Gap Year">Gap Year / Repeater</option>
                </select>
              </div>

              {/* Education Board */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Education Board
                </label>
                <select
                  className="form-input"
                  value={formData.academicProfile.board}
                  onChange={(e) => handleNestedChange('academicProfile', 'board', e.target.value)}
                >
                  <option value="State Board (DHSE Kerala)">Kerala Higher Secondary (DHSE)</option>
                  <option value="CBSE">Central Board of Secondary Education (CBSE)</option>
                  <option value="ICSE / ISC">Council for the Indian School Certificate (ISC)</option>
                  <option value="Other State Board">Other State Board</option>
                  <option value="NIOS">National Institute of Open Schooling (NIOS)</option>
                </select>
              </div>

              {/* Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Academic Stream
                </label>
                <select
                  className="form-input"
                  value={formData.academicProfile.stream}
                  onChange={(e) => handleNestedChange('academicProfile', 'stream', e.target.value)}
                >
                  <option value="">Select your stream...</option>
                  {AVAILABLE_STREAMS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Marks / Percentage */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Overall Percentage / Grade (% or GPA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 88.5% or 9.2 GPA"
                  className="form-input"
                  value={formData.academicProfile.marksPercentage}
                  onChange={(e) => handleNestedChange('academicProfile', 'marksPercentage', e.target.value)}
                />
              </div>

              {/* Passing Year */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Passing Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026 or 2025"
                  className="form-input"
                  value={formData.academicProfile.passingYear}
                  onChange={(e) => handleNestedChange('academicProfile', 'passingYear', e.target.value)}
                />
              </div>

              {/* School Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  School / Higher Secondary Institution Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. Joseph's HSS, Model Vocational Higher Secondary School"
                  className="form-input"
                  value={formData.academicProfile.schoolName}
                  onChange={(e) => handleNestedChange('academicProfile', 'schoolName', e.target.value)}
                />
              </div>

            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveSection('preferences')}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Next: Study Preferences
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: STUDY & CAREER PREFERENCES */}
        {activeSection === 'preferences' && (
          <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Higher Education & Career Aspirations
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                Select disciplines you are genuinely interested in to filter relevant courses and colleges.
              </p>
            </div>

            {/* Interest Badges Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.75rem' }}>
                Areas of Academic Interest (Choose all that apply)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = (formData.preferences.interestedStreams || []).includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '9999px',
                        border: isSelected ? '1.5px solid #1d4ed8' : '1.5px solid #e2e8f0',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#1d4ed8' : '#475569',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {isSelected ? <CheckCircle2 size={15} color="#1d4ed8" /> : null}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              {/* Budget Range */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Target Annual Fee Budget
                </label>
                <select
                  className="form-input"
                  value={formData.preferences.budgetRange}
                  onChange={(e) => handleNestedChange('preferences', 'budgetRange', e.target.value)}
                >
                  <option value="Govt. Subsidized (Under ₹25,000 / year)">Govt. Subsidized (Under ₹25,000 / year)</option>
                  <option value="₹25,000 - ₹75,000 / year">₹25,000 - ₹75,000 / year (Aided / Self-Financing)</option>
                  <option value="₹75,000 - ₹2,00,000 / year">₹75,000 - ₹2,00,000 / year</option>
                  <option value="Above ₹2,00,000 / year">Above ₹2,00,000 / year (Private / Premier)</option>
                </select>
              </div>

              {/* Preferred Duration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  Course Duration Preference
                </label>
                <select
                  className="form-input"
                  value={formData.preferences.preferredDuration}
                  onChange={(e) => handleNestedChange('preferences', 'preferredDuration', e.target.value)}
                >
                  <option value="3 Years">3 Years (BCA, B.Sc, B.Com, BBA)</option>
                  <option value="4 Years">4 Years (B.Tech, B.Pharm, B.Des)</option>
                  <option value="5 Years Integrated">5 Years Integrated (MBBS, Integrated Law / M.Sc)</option>
                  <option value="Flexible">Open / Any Duration</option>
                </select>
              </div>

            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setActiveSection('academic')}
                className="btn-secondary"
              >
                Back to Academic
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('personal')}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Next: Personal & Location
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: PERSONAL & LOCATION */}
        {activeSection === 'personal' && (
          <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Personal Information & Region
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                Location information powers the regional college locator.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                    required
                  />
                </div>
              </div>

              {/* Email Address (Read-only) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={student.email}
                    disabled
                    className="form-input"
                    style={{ paddingLeft: '2.75rem', backgroundColor: '#f9fafb', cursor: 'not-allowed', color: '#6b7280' }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Verified account email</span>
              </div>

              {/* Phone Number */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              {/* Home State */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>State</label>
                <select
                  className="form-input"
                  value={formData.location.state}
                  onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                >
                  <option value="Kerala">Kerala</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Other">Other State</option>
                </select>
              </div>

              {/* District */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Home District</label>
                <select
                  className="form-input"
                  value={formData.location.district}
                  onChange={(e) => handleNestedChange('location', 'district', e.target.value)}
                >
                  <option value="">Select district...</option>
                  {KERALA_DISTRICTS.map((dst) => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                  <option value="Other District">Other</option>
                </select>
              </div>

              {/* City / Town */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>City / Town</label>
                <input
                  type="text"
                  placeholder="e.g. Kozhikode, Ernakulam, Aluva"
                  className="form-input"
                  value={formData.location.city}
                  onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                />
              </div>

            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setActiveSection('preferences')}
                className="btn-secondary"
              >
                Back to Preferences
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                <Save size={16} />
                Save & Complete Profile
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentProfile;
