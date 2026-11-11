import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { StudentAuthProvider, useStudentAuth } from './context/StudentAuthContext.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentRegister from './pages/StudentRegister.jsx';
import StudentVerifyOtp from './pages/StudentVerifyOtp.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  Award,
  UserPlus,
  LogIn
} from 'lucide-react';

const PublicLanding = ({ onGoToAdmin, onGoToStudentRegister, onGoToStudentLogin }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fbfaff',
        color: '#1e1035',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Violet Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Navbar */}
      <header
        style={{
          height: '74px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 3rem',
          borderBottom: '1.5px solid #ede9fe',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(124, 58, 237, 0.04)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background:
                'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}
          >
            <GraduationCap size={22} color="#ffffff" />
          </div>

          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#1e1035'
            }}
          >
            DISHA
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {onGoToStudentLogin && (
            <button
              onClick={onGoToStudentLogin}
              className="btn-secondary"
              style={{ padding: '0.6rem 1.15rem', fontSize: '0.85rem' }}
            >
              <LogIn size={15} />
              Student Login
            </button>
          )}

          {onGoToStudentRegister && (
            <button
              onClick={onGoToStudentRegister}
              className="btn-primary"
              style={{ padding: '0.6rem 1.15rem', fontSize: '0.85rem' }}
            >
              <UserPlus size={15} />
              Student Register
            </button>
          )}

          <button
            onClick={onGoToAdmin}
            className="btn-secondary"
            style={{ padding: '0.6rem 1.15rem', fontSize: '0.85rem' }}
          >
            <ShieldCheck size={15} />
            Admin Portal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          className="badge badge-violet"
          style={{
            marginBottom: '1.5rem',
            padding: '0.4rem 1rem',
            fontSize: '0.8rem'
          }}
        >
          <Sparkles size={14} />
          AI-Powered Higher Education Guidance
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            maxWidth: '850px',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: '#1e1035'
          }}
        >
          Navigate Your Higher Education Journey with Confidence
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#5b5273',
            maxWidth: '650px',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}
        >
          Digital Intelligent System for Higher Education Assistance (DISHA)
          provides personalized college cutoffs, career streams, and entrance
          exam alerts for students.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {onGoToStudentRegister && (
            <button
              onClick={onGoToStudentRegister}
              className="btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              <UserPlus size={18} />
              Get Started as Student
              <ArrowRight size={18} />
            </button>
          )}

          {onGoToStudentLogin && (
            <button
              onClick={onGoToStudentLogin}
              className="btn-secondary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              <LogIn size={18} />
              Student Login
            </button>
          )}

          <button
            onClick={onGoToAdmin}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
          >
            <ShieldCheck size={18} />
            Enter Admin Portal
          </button>
        </div>

        {/* 3 Value Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1000px',
            width: '100%',
            marginTop: '4.5rem'
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1px solid #ddd6fe'
              }}
            >
              <Compass size={22} />
            </div>

            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#1e1035',
                marginBottom: '0.4rem'
              }}
            >
              Career Pathfinding
            </h3>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#5b5273'
              }}
            >
              Tailored roadmap matching student aptitude and aspirations with
              academic disciplines.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1px solid #a7f3d0'
              }}
            >
              <BookOpen size={22} />
            </div>

            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#1e1035',
                marginBottom: '0.4rem'
              }}
            >
              Institution Catalog
            </h3>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#5b5273'
              }}
            >
              Verified databases of premier colleges, NAAC ratings, seat
              intakes, and fee structures.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1px solid #fde68a'
              }}
            >
              <Award size={22} />
            </div>

            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#1e1035',
                marginBottom: '0.4rem'
              }}
            >
              Entrance Exam Radar
            </h3>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#5b5273'
              }}
            >
              Timely deadline reminders, syllabus trackers, and rank cutoff
              predictions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const getInitialView = () => {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  if (path === '/admin/login' || path === '/admin') {
    return 'admin-login';
  }
  return 'public';
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isStudentAuthenticated, isStudentLoading } = useStudentAuth();
  const [currentView, setCurrentView] = useState(getInitialView); // 'public' | 'login' | 'admin-login' | 'student-register' | 'student-verify-otp' | 'student-login' | 'student-dashboard'
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Sync browser URL / history with current view and listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (path === '/admin/login' || path === '/admin') {
        setCurrentView('admin-login');
      } else {
        setCurrentView('public');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToView = (view, updateUrl = true) => {
    setCurrentView(view);
    if (updateUrl) {
      if (view === 'login' || view === 'admin-login') {
        if (window.location.pathname !== '/admin/login') {
          window.history.pushState({}, '', '/admin/login');
        }
      } else {
        if (window.location.pathname === '/admin/login' || window.location.pathname === '/admin') {
          window.history.pushState({}, '', '/');
        }
      }
    }
  };

  // Wait for both admin AND student session checks to complete
  if (isLoading || isStudentLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fbfaff',
          color: '#1e1035'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background:
              'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
            marginBottom: '1.5rem'
          }}
        >
          <GraduationCap size={30} color="#ffffff" />
        </div>

        <div
          className="spinner"
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #ede9fe',
            borderTopColor: '#7c3aed',
            borderRadius: '50%',
            marginBottom: '1rem'
          }}
        />

        <p
          style={{
            fontSize: '0.9rem',
            color: '#7c6f93'
          }}
        >
          Initializing DISHA Session...
        </p>
      </div>
    );
  }

  // If user is authenticated as Admin, render the full Admin Dashboard
  if (isAuthenticated) {
    return <AdminDashboard onNavigateToPublic={() => navigateToView('public')} />;
  }

  // If student is authenticated (from localStorage session restore OR after login), show dashboard
  if (isStudentAuthenticated || currentView === 'student-dashboard') {
    return <StudentDashboard onNavigateToPublic={() => navigateToView('public')} />;
  }

  // Student Registration view
  if (currentView === 'student-register') {
    return (
      <StudentRegister
        onRegistrationSuccess={(email) => {
          setRegisteredEmail(email);
          navigateToView('student-verify-otp', false);
        }}
        onNavigateToLogin={() => navigateToView('student-login', false)}
        onNavigateToPublic={() => navigateToView('public')}
      />
    );
  }

  // Student OTP Verification view
  if (currentView === 'student-verify-otp') {
    return (
      <StudentVerifyOtp
        email={registeredEmail}
        onVerificationSuccess={(_response) => {
          navigateToView('student-login', false);
        }}
        onNavigateToLogin={() => navigateToView('student-login', false)}
        onNavigateToRegister={() => navigateToView('student-register', false)}
      />
    );
  }

  // Student Login view
  if (currentView === 'student-login') {
    return (
      <StudentLogin
        initialEmail={registeredEmail}
        onLoginSuccess={(_response) => {
          navigateToView('student-dashboard', false);
        }}
        onNavigateToRegister={() => navigateToView('student-register', false)}
        onNavigateToVerify={(emailToVerify) => {
          setRegisteredEmail(emailToVerify);
          navigateToView('student-verify-otp', false);
        }}
        onNavigateToPublic={() => navigateToView('public')}
      />
    );
  }

  // Admin Login view
  if (currentView === 'login' || currentView === 'admin-login') {
    return <AdminLogin onNavigateToPublic={() => navigateToView('public')} />;
  }

  // Default: Public landing page
  return (
    <PublicLanding
      onGoToAdmin={() => navigateToView('admin-login')}
      onGoToStudentRegister={() => navigateToView('student-register', false)}
      onGoToStudentLogin={() => navigateToView('student-login', false)}
    />
  );
};

/* =========================================================
   ROOT APP
   ========================================================= */

function App() {
  return (
    <StudentAuthProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </StudentAuthProvider>
  );
}

export default App;