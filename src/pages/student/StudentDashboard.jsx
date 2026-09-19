import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  Award, 
  Sparkles, 
  Bell, 
  UserCircle,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';
import StudentProfile from './StudentProfile.jsx';

const StudentDashboard = ({ onNavigateToPublic }) => {
  const { student, logout } = useStudentAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    onNavigateToPublic();
  };

  if (!student) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fbfaff', fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1.5px solid #ede9fe',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 40
      }}>
        {/* Brand */}
        <div style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1.5px solid #ede9fe'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(124, 58, 237, 0.2)'
          }}>
            <GraduationCap size={20} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1035', letterSpacing: '-0.02em' }}>
            DISHA
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
              Main Menu
            </h4>
            
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'overview' ? 600 : 500,
                color: activeTab === 'overview' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'overview' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'overview' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Compass size={19} color={activeTab === 'overview' ? '#7c3aed' : '#7c6f93'} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'profile' ? 600 : 500,
                color: activeTab === 'profile' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'profile' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'profile' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <UserCircle size={19} color={activeTab === 'profile' ? '#7c3aed' : '#7c6f93'} />
              My Profile
            </button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
              Discover
            </h4>
            
            {/* Future modules placeholder navigation */}
            {[
              { id: 'courses', icon: BookOpen, label: 'Courses' },
              { id: 'colleges', icon: Compass, label: 'Colleges' },
              { id: 'exams', icon: Award, label: 'Entrance Exams' },
              { id: 'aptitude', icon: Sparkles, label: 'AI Aptitude Test' },
            ].map(item => (
              <button
                key={item.id}
                disabled
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '3px solid transparent',
                  cursor: 'not-allowed',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: '#9ca3af',
                  backgroundColor: 'transparent',
                  marginBottom: '0.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <item.icon size={19} color="#d1d5db" />
                  {item.label}
                </div>
                <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', backgroundColor: '#f3f4f6', borderRadius: '4px', fontWeight: 600 }}>SOON</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Card */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1.5px solid #ede9fe',
          backgroundColor: '#faf5ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1035', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {student.name}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#7c6f93' }}>
                Student
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#4b5563',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          height: '74px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          backgroundColor: '#ffffff',
          borderBottom: '1.5px solid #ede9fe',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div>
            {activeTab === 'overview' && (
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1035' }}>Welcome back, {student.name.split(' ')[0]}! 👋</h2>
            )}
            {activeTab === 'profile' && (
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1035' }}>Profile Settings</h2>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <Bell size={18} color="#4b5563" />
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '10px',
                height: '10px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                borderRadius: '16px',
                padding: '2rem',
                color: '#ffffff',
                marginBottom: '2rem',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ready to find your path?</h3>
                  <p style={{ maxWidth: '500px', opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    DISHA is your AI-powered companion for higher education. Complete your profile to unlock personalized college and course recommendations.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    style={{
                      padding: '0.6rem 1.25rem',
                      backgroundColor: '#ffffff',
                      color: '#7c3aed',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Complete Profile
                  </button>
                </div>
                
                <Sparkles size={120} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: '-10%', top: '-20%' }} />
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1035', marginBottom: '1.25rem' }}>
                Upcoming Features
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {[
                  { title: 'AI Aptitude Test', desc: 'Discover your strengths and ideal career paths.', icon: Sparkles, color: '#7c3aed', bg: '#f5f3ff' },
                  { title: 'College Finder', desc: 'Browse and filter premier institutions.', icon: Compass, color: '#059669', bg: '#ecfdf5' },
                  { title: 'Course Catalog', desc: 'Explore programs matching your interests.', icon: BookOpen, color: '#2563eb', bg: '#eff6ff' },
                  { title: 'Exam Alerts', desc: 'Track important dates and cutoffs.', icon: Award, color: '#d97706', bg: '#fffbeb' },
                ].map((item, index) => (
                  <div key={index} className="glass-panel" style={{ padding: '1.5rem', opacity: 0.8 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: item.bg,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <item.icon size={20} />
                    </div>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.4rem' }}>{item.title}</h5>
                    <p style={{ fontSize: '0.85rem', color: '#5b5273' }}>{item.desc}</p>
                    <div style={{ marginTop: '1rem', display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.6rem', backgroundColor: '#f3f4f6', color: '#6b7280', borderRadius: '4px' }}>
                      COMING SOON
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <StudentProfile />
          )}

        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
