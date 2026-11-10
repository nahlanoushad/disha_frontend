import React from 'react';
import { useStudentAuth } from '../context/StudentAuthContext.jsx';
import {
  GraduationCap,
  LogOut,
  Sparkles,
  BookOpen,
  Compass,
  Award,
  CheckCircle2,
  User,
  Mail,
  ShieldCheck
} from 'lucide-react';

/**
 * Student Dashboard / Portal View
 * 
 * Props:
 * - onNavigateToPublic: Callback to view the public landing page: () => void
 */
const StudentDashboard = ({ onNavigateToPublic }) => {
  const { student, studentLogout } = useStudentAuth();

  const currentStudent = student || {
    name: 'Student',
    email: 'student@example.com',
    role: 'student',
    isVerified: true
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fbfaff',
      color: '#1e1035',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      position: 'relative'
    }}>
      {/* Top Navbar */}
      <header style={{
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        borderBottom: '1.5px solid #ede9fe',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(124, 58, 237, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
          }}>
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1e1035' }}>
            DISHA
          </span>
          <span className="badge badge-violet" style={{ fontSize: '0.72rem', marginLeft: '0.25rem' }}>
            Student Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {onNavigateToPublic && (
            <button
              onClick={onNavigateToPublic}
              className="btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              Public Home
            </button>
          )}

          <button
            onClick={studentLogout}
            className="btn-secondary"
            style={{
              padding: '0.55rem 1rem',
              fontSize: '0.85rem',
              color: '#e11d48',
              borderColor: '#fecdd3'
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        flex: 1
      }}>
        {/* Welcome Hero Card */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          borderRadius: '24px',
          padding: '2.5rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.35)'
        }}>
          {/* Ambient Decorative Circle */}
          <div style={{
            position: 'absolute',
            right: '-50px',
            top: '-50px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={14} /> Verified Student Account
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Welcome back, {currentStudent.name}!
            </h1>
            <p style={{ fontSize: '1rem', color: '#ede9fe', maxWidth: '650px', lineHeight: 1.5 }}>
              Your personalized higher education portal for college cutoffs, aptitude matching, and entrance exam alerts.
            </p>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Account Profile Card */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1035', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#7c3aed" /> Student Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                  <User size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7c6f93', fontWeight: 500 }}>Full Name</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1035' }}>{currentStudent.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7c6f93', fontWeight: 500 }}>Email Address</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1035' }}>{currentStudent.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7c6f93', fontWeight: 500 }}>Account Role</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1035', textTransform: 'capitalize' }}>
                    {currentStudent.role || 'student'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7c6f93', fontWeight: 500 }}>Verification Status</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>
                    {currentStudent.isVerified ? 'Verified Student Account' : 'Pending Verification'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Guidance Modules */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1035', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#7c3aed" /> DISHA Higher Education Modules
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1px solid #ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Compass size={18} color="#7c3aed" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e1035' }}>Career Pathfinding</div>
                    <div style={{ fontSize: '0.75rem', color: '#7c6f93' }}>Aptitude and academic stream roadmap</div>
                  </div>
                </div>
                <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>Active</span>
              </div>

              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1px solid #ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <BookOpen size={18} color="#059669" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e1035' }}>Institutions &amp; Colleges</div>
                    <div style={{ fontSize: '0.75rem', color: '#7c6f93' }}>Cutoff matrices, NAAC grades, seat intakes</div>
                  </div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Catalog</span>
              </div>

              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1px solid #ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Award size={18} color="#d97706" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e1035' }}>Entrance Exam Radar</div>
                    <div style={{ fontSize: '0.75rem', color: '#7c6f93' }}>Reminders, syllabus trackers, rank predictors</div>
                  </div>
                </div>
                <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
