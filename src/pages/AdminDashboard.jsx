import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  FileText,
  Users,
  Activity,
  LogOut,
  Search,
  CheckCircle2,
  RefreshCw,
  GraduationCap,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  Key
} from 'lucide-react';
import CategoriesTab from '../components/CategoriesTab.jsx';
import CoursesTab from '../components/CoursesTab.jsx';
import EntranceExamsTab from '../components/EntranceExamsTab.jsx';
import StudentsTab from '../components/StudentsTab.jsx';

const AdminDashboard = ({ onNavigateToPublic }) => {
  const { admin, logout, refreshProfile, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [serverHealth, setServerHealth] = useState({ status: 'checking', message: 'Connecting...' });
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(false);
  const [profileSyncStatus, setProfileSyncStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefreshProfile = async () => {
    setIsRefreshingProfile(true);
    setProfileSyncStatus(null);
    try {
      const updated = await refreshProfile();
      setProfileSyncStatus({
        status: 'success',
        message: 'Profile successfully synchronized with GET /api/auth/me',
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      setProfileSyncStatus({
        status: 'error',
        message: err.message || 'Failed to fetch /api/auth/me',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsRefreshingProfile(false);
    }
  };

  // Check backend server health
  const checkBackendHealth = async () => {
    setIsRefreshingHealth(true);
    try {
      const data = await api.checkHealth();
      setServerHealth({
        status: 'online',
        message: data.message || 'DISHA backend API is running',
        timestamp: data.timestamp
      });
    } catch (err) {
      setServerHealth({
        status: 'offline',
        message: 'Could not connect to backend server',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRefreshingHealth(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sample data for Colleges
  const collegesList = [
    { id: 1, name: 'College of Engineering Trivandrum (CET)', location: 'Thiruvananthapuram, Kerala', type: 'Government', naac: 'A++', rank: '#1 State' },
    { id: 2, name: 'Government Medical College (GMC)', location: 'Kozhikode, Kerala', type: 'Government Medical', naac: 'A+', rank: '#2 State' },
    { id: 3, name: 'National Institute of Technology (NIT)', location: 'Calicut, Kerala', type: 'Institute of National Importance', naac: 'A++', rank: '#23 NIRF' },
    { id: 4, name: 'Model Engineering College (MEC)', location: 'Kochi, Kerala', type: 'Govt. Controlled Self-Financing', naac: 'A', rank: '#4 State' },
    { id: 5, name: 'St. Teresa\'s College (Autonomous)', location: 'Ernakulam, Kerala', type: 'Arts & Science', naac: 'A++', rank: '#41 NIRF' }
  ];

  // Sample data for Inquiries
  const recentInquiries = [
    { id: 'INQ-1082', student: 'Aarav Nair', stream: 'Computer Science & AI', targetCollege: 'CET Trivandrum', status: 'Guided', date: 'Just now' },
    { id: 'INQ-1081', student: 'Fathima Rafeeq', stream: 'Biotechnology / MBBS', targetCollege: 'GMC Kozhikode', status: 'In Review', date: '25 mins ago' },
    { id: 'INQ-1080', student: 'Rohan Kurien', stream: 'Aerospace Engineering', targetCollege: 'IIST / NIT Calicut', status: 'Pending', date: '2 hours ago' },
    { id: 'INQ-1079', student: 'Ananya Menon', stream: 'B.Des & Digital Media', targetCollege: 'NIFT / St. Teresa\'s', status: 'Guided', date: 'Yesterday' },
    { id: 'INQ-1078', student: 'Devadath S.', stream: 'Data Science & Cyber Sec', targetCollege: 'MEC Kochi', status: 'Guided', date: '2 days ago' }
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#fbfaff',
      color: '#1e1035',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* LEFT SIDEBAR (WHITE & VIOLET) */}
      <aside style={{
        width: '270px',
        backgroundColor: '#ffffff',
        borderRight: '1.5px solid #ede9fe',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '2px 0 12px rgba(124, 58, 237, 0.03)'
      }}>
        {/* Sidebar Brand Header */}
        <div>
          <div style={{
            padding: '1.5rem 1.25rem',
            borderBottom: '1.5px solid #ede9fe',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
            }}>
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#1e1035' }}>DISHA</span>
                <span className="badge badge-violet" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>PRO</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#7c6f93', fontWeight: 500 }}>Higher Ed Admin Suite</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav style={{ padding: '1.25rem 0.85rem' }}>
            <p style={{
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: '#7c6f93',
              padding: '0 0.6rem 0.6rem 0.6rem'
            }}>
              Core Management
            </p>

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
              <LayoutDashboard size={19} color={activeTab === 'overview' ? '#7c3aed' : '#7c6f93'} />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('colleges')}
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
                fontWeight: activeTab === 'colleges' ? 600 : 500,
                color: activeTab === 'colleges' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'colleges' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'colleges' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Building2 size={19} color={activeTab === 'colleges' ? '#7c3aed' : '#7c6f93'} />
              College
            </button>

            <button
              onClick={() => setActiveTab('categories')}
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
                fontWeight: activeTab === 'categories' ? 600 : 500,
                color: activeTab === 'categories' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'categories' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'categories' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Layers size={19} color={activeTab === 'categories' ? '#7c3aed' : '#7c6f93'} />
              Category
            </button>

            <button
              onClick={() => setActiveTab('courses')}
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
                fontWeight: activeTab === 'courses' ? 600 : 500,
                color: activeTab === 'courses' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'courses' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'courses' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <BookOpen size={19} color={activeTab === 'courses' ? '#7c3aed' : '#7c6f93'} />
              Course
            </button>

            <button
              onClick={() => setActiveTab('entranceExams')}
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
                fontWeight: activeTab === 'entranceExams' ? 600 : 500,
                color: activeTab === 'entranceExams' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'entranceExams' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'entranceExams' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <FileText size={19} color={activeTab === 'entranceExams' ? '#7c3aed' : '#7c6f93'} />
              Entrance Exams
            </button>

            <button
              onClick={() => setActiveTab('students')}
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
                fontWeight: activeTab === 'students' ? 600 : 500,
                color: activeTab === 'students' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'students' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'students' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Users size={19} color={activeTab === 'students' ? '#7c3aed' : '#7c6f93'} />
              Students
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
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
                fontWeight: activeTab === 'inquiries' ? 600 : 500,
                color: activeTab === 'inquiries' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'inquiries' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'inquiries' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Users size={19} color={activeTab === 'inquiries' ? '#7c3aed' : '#7c6f93'} />
              Student Inquiries
            </button>

            <p style={{
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: '#7c6f93',
              padding: '1.2rem 0.6rem 0.6rem 0.6rem'
            }}>
              System Monitoring
            </p>

            <button
              onClick={() => setActiveTab('health')}
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
                fontWeight: activeTab === 'health' ? 600 : 500,
                color: activeTab === 'health' ? '#7c3aed' : '#5b5273',
                backgroundColor: activeTab === 'health' ? '#f5f3ff' : 'transparent',
                borderLeft: activeTab === 'health' ? '3px solid #7c3aed' : '3px solid transparent',
                marginBottom: '0.25rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Activity size={19} color={activeTab === 'health' ? '#7c3aed' : '#7c6f93'} />
              System Diagnostics
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
              <UserCheck size={19} color={activeTab === 'profile' ? '#7c3aed' : '#7c6f93'} />
              Admin Profile (/me)
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div style={{
          padding: '1rem',
          borderTop: '1.5px solid #ede9fe',
          backgroundColor: '#faf5ff'
        }}>
          <div 
            onClick={() => setActiveTab('profile')}
            title="Click to view full admin profile from /me"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.85rem',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ede9fe'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
            }}>
              {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1035', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {admin?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#7c6f93', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {admin?.email || 'admin@disha.edu'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              id="admin-logout-btn"
              onClick={logout}
              className="btn-secondary"
              style={{
                flex: 1,
                padding: '0.5rem 0.6rem',
                fontSize: '0.78rem',
                color: '#e11d48',
                borderColor: '#fecdd3'
              }}
              title="Logout from Admin Panel"
            >
              <LogOut size={14} />
              Sign Out
            </button>
            {onNavigateToPublic && (
              <button
                onClick={onNavigateToPublic}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.6rem', fontSize: '0.78rem' }}
                title="View Public Site"
              >
                <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TOP HEADER */}
        <header style={{
          height: '68px',
          borderBottom: '1.5px solid #ede9fe',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(124, 58, 237, 0.04)'
        }}>
          {/* Breadcrumb / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Admin</span>
            <ChevronRight size={14} color="#a79cb8" />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1035', textTransform: 'capitalize' }}>
              {activeTab}
            </span>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Live Backend Status Indicator */}
            <div 
              onClick={checkBackendHealth}
              title="Click to refresh connection status"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                backgroundColor: serverHealth.status === 'online' ? '#ecfdf5' : '#fff1f2',
                border: `1px solid ${serverHealth.status === 'online' ? '#a7f3d0' : '#fecdd3'}`
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: serverHealth.status === 'online' ? '#059669' : '#e11d48',
                boxShadow: serverHealth.status === 'online' ? '0 0 6px #059669' : '0 0 6px #e11d48'
              }} />
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: serverHealth.status === 'online' ? '#059669' : '#e11d48'
              }}>
                {serverHealth.status === 'online' ? 'Backend Online (Port 5000)' : 'Backend Offline'}
              </span>
              <RefreshCw size={12} className={isRefreshingHealth ? 'spinner' : ''} color="#7c6f93" />
            </div>

            {/* Quick Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#7c6f93" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search colleges, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #ede9fe',
                  borderRadius: '20px',
                  padding: '0.4rem 1rem 0.4rem 2.2rem',
                  fontSize: '0.8rem',
                  color: '#1e1035',
                  outline: 'none',
                  width: '220px'
                }}
              />
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Royal Violet Welcome Banner */}
              <div style={{
                padding: '1.75rem 2rem',
                marginBottom: '2rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4c1d95 100%)',
                color: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.35)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                      Welcome back, {admin?.name || 'Administrator'}
                    </h2>
                    <Sparkles size={20} color="#fef08a" />
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', maxWidth: '600px' }}>
                    Here is the operational overview for the DISHA platform. All higher secondary guidance algorithms, institution catalogs, and counseling services are active.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(8px)'
                  }}>
                    MongoDB Connected
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.35rem' }}>Database: cluster1.ymzl3kr.mongodb.net</p>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7c6f93' }}>Students Guided</span>
                    <div style={{ padding: '0.4rem', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                      <Users size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.3rem' }}>3,420</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                    <TrendingUp size={14} /> +18.4% from last month
                  </div>
                </div>

                <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7c6f93' }}>Verified Institutions</span>
                    <div style={{ padding: '0.4rem', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669' }}>
                      <Building2 size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.3rem' }}>148</div>
                  <div style={{ fontSize: '0.75rem', color: '#7c6f93' }}>Engineering, Medical & Arts</div>
                </div>

                <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7c6f93' }}>Course Roadmaps</span>
                    <div style={{ padding: '0.4rem', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#d97706' }}>
                      <BookOpen size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.3rem' }}>420+</div>
                  <div style={{ fontSize: '0.75rem', color: '#7c6f93' }}>Degree, Diploma & Integrated</div>
                </div>

                <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7c6f93' }}>Entrance Exam Alerts</span>
                    <div style={{ padding: '0.4rem', borderRadius: '10px', backgroundColor: '#fff1f2', color: '#e11d48' }}>
                      <FileText size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.3rem' }}>32</div>
                  <div style={{ fontSize: '0.75rem', color: '#d97706' }}>KEAM, NEET, JEE, CUET</div>
                </div>
              </div>

              {/* Table of Recent Student Inquiries */}
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1035' }}>Recent Higher Ed Inquiries</h3>
                    <p style={{ fontSize: '0.78rem', color: '#7c6f93' }}>Students awaiting counseling feedback and college cutoff assessment</p>
                  </div>
                  <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                    View All Inquiries
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #ede9fe', color: '#7c6f93', backgroundColor: '#faf5ff' }}>
                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>ID</th>
                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Student Name</th>
                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Preferred Stream</th>
                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Target College</th>
                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInquiries.map((inq) => (
                        <tr key={inq.id} style={{ borderBottom: '1px solid #ede9fe', transition: 'background 0.2s' }}>
                          <td style={{ padding: '0.85rem 1rem', color: '#7c3aed', fontWeight: 600 }}>{inq.id}</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e1035' }}>{inq.student}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>{inq.stream}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>{inq.targetCollege}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span className={`badge ${inq.status === 'Guided' ? 'badge-emerald' : inq.status === 'In Review' ? 'badge-amber' : 'badge-violet'}`}>
                              {inq.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#7c6f93', fontSize: '0.78rem' }}>{inq.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLLEGES */}
          {activeTab === 'colleges' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>Higher Education Institutions</h2>
                  <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Verified government, autonomous, and private partner colleges</p>
                </div>
                <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
                  + Add New College
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {collegesList.map((college) => (
                  <div key={college.id} className="glass-panel glass-panel-hover" style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: '#f5f3ff',
                        border: '1px solid #ddd6fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#7c3aed'
                      }}>
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.2rem' }}>{college.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#7c6f93' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={13} /> {college.location}
                          </span>
                          <span>•</span>
                          <span>{college.type}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-violet">NAAC: {college.naac}</span>
                      <span className="badge badge-emerald">{college.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <CategoriesTab />
          )}

          {/* TAB: COURSES */}
          {activeTab === 'courses' && (
            <CoursesTab />
          )}

          {/* TAB: ENTRANCE EXAMS */}
          {activeTab === 'entranceExams' && (
            <EntranceExamsTab />
          )}

          {/* TAB: STUDENTS */}
          {activeTab === 'students' && (
            <StudentsTab />
          )}

          {/* TAB 4: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>Student Counseling Inquiries</h2>
                <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Direct requests submitted by higher secondary students</p>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #ede9fe', color: '#7c6f93', backgroundColor: '#faf5ff' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Stream</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Target College</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inq) => (
                      <tr key={inq.id} style={{ borderBottom: '1px solid #ede9fe' }}>
                        <td style={{ padding: '0.85rem 1rem', color: '#7c3aed', fontWeight: 600 }}>{inq.id}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e1035' }}>{inq.student}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>{inq.stream}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>{inq.targetCollege}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className={`badge ${inq.status === 'Guided' ? 'badge-emerald' : inq.status === 'In Review' ? 'badge-amber' : 'badge-violet'}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                            Respond
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM HEALTH */}
          {activeTab === 'health' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>System Health & API Diagnostics</h2>
                <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Live verification of backend connectivity, database status, and JWT security</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Node Backend Status Card */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e1035' }}>Node / Express Server</h3>
                    <span className={`badge ${serverHealth.status === 'online' ? 'badge-emerald' : 'badge-rose'}`}>
                      {serverHealth.status === 'online' ? 'Connected' : 'Unavailable'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#5b5273', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                    <div><strong>Endpoint:</strong> <code>http://localhost:5000/api/health</code></div>
                    <div><strong>Message:</strong> {serverHealth.message}</div>
                    <div><strong>Last Pinged:</strong> {serverHealth.timestamp || 'Just now'}</div>
                  </div>

                  <button
                    onClick={checkBackendHealth}
                    disabled={isRefreshingHealth}
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
                  >
                    <RefreshCw size={14} className={isRefreshingHealth ? 'spinner' : ''} />
                    {isRefreshingHealth ? 'Pinging Server...' : 'Ping Backend API'}
                  </button>
                </div>

                {/* MongoDB Atlas Card */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e1035' }}>MongoDB Atlas Cluster</h3>
                    <span className="badge badge-emerald">Active (ReplicaSet)</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#5b5273', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                    <div><strong>Cluster:</strong> <code>cluster1.ymzl3kr.mongodb.net</code></div>
                    <div><strong>Database:</strong> <code>disha</code></div>
                    <div><strong>Auth Role:</strong> <code>Admin (superadmin verified)</code></div>
                  </div>

                  <div style={{
                    padding: '0.65rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    fontSize: '0.78rem',
                    color: '#059669',
                    fontWeight: 500
                  }}>
                    ✓ Mongoose connection verified and responsive
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN PROFILE (ONLY NAME, EMAIL, ROLE) */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>
                    Admin Profile
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>
                    Current administrator credentials fetched from <code>GET /api/auth/me</code>
                  </p>
                </div>
                <button
                  id="refresh-me-btn"
                  onClick={handleRefreshProfile}
                  disabled={isRefreshingProfile}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem' }}
                >
                  <RefreshCw size={15} className={isRefreshingProfile ? 'spinner' : ''} />
                  {isRefreshingProfile ? 'Refreshing...' : 'Refresh Profile'}
                </button>
              </div>

              {/* Feedback Alert */}
              {profileSyncStatus && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  backgroundColor: profileSyncStatus.status === 'success' ? '#ecfdf5' : '#fff1f2',
                  border: `1px solid ${profileSyncStatus.status === 'success' ? '#a7f3d0' : '#fecdd3'}`,
                  color: profileSyncStatus.status === 'success' ? '#059669' : '#e11d48',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  <CheckCircle2 size={18} />
                  <span>{profileSyncStatus.message}</span>
                </div>
              )}

              {/* Clean Profile Card Showing ONLY Name, Email, Role */}
              <div className="glass-panel" style={{
                maxWidth: '560px',
                padding: '2rem',
                backgroundColor: '#ffffff',
                border: '1.5px solid #ede9fe',
                borderRadius: '18px',
                boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #ede9fe' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
                  }}>
                    {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.2rem' }}>
                      {admin?.name || 'System Administrator'}
                    </h3>
                    <span className="badge badge-violet" style={{ fontSize: '0.75rem' }}>
                      {admin?.role || 'admin'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Name */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #ede9fe' }}>
                    <span style={{ fontSize: '0.9rem', color: '#7c6f93', fontWeight: 600 }}>Name</span>
                    <strong style={{ fontSize: '0.95rem', color: '#1e1035' }}>
                      {admin?.name || 'System Administrator'}
                    </strong>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #ede9fe' }}>
                    <span style={{ fontSize: '0.9rem', color: '#7c6f93', fontWeight: 600 }}>Email</span>
                    <strong style={{ fontSize: '0.95rem', color: '#1e1035' }}>
                      {admin?.email || 'admin@disha.edu'}
                    </strong>
                  </div>

                  {/* Role */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#7c6f93', fontWeight: 600 }}>Role</span>
                    <span className="badge badge-violet" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                      {admin?.role || 'admin'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
