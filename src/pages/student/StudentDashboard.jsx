import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  BookOpen,
  Building2,
  Scale,
  Award,
  Sparkles,
  Bell,
  LogOut,
  GraduationCap,
  ArrowRight,
  Calendar,
  RefreshCw,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  User,
  ChevronDown,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';
import StudentProfile from './StudentProfile.jsx';
import CourseExplorer from '../../components/student/CourseExplorer.jsx';
import CollegeFinder from '../../components/student/CollegeFinder.jsx';
import CollegeComparison from '../../components/student/CollegeComparison.jsx';
import EntranceExamHub from '../../components/student/EntranceExamHub.jsx';
import ExamCalendar from '../../components/student/ExamCalendar.jsx';
import AptitudeAssessment from '../../components/student/AptitudeAssessment.jsx';
import CourseDetailsModal from '../../components/student/CourseDetailsModal.jsx';
import CollegeDetailsModal from '../../components/student/CollegeDetailsModal.jsx';
import studentApi from '../../services/studentApi.js';

const StudentDashboard = ({ onNavigateToPublic }) => {
  const { student, logout } = useStudentAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') || 'overview';
    } catch {
      return 'overview';
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const moreDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // College comparison persistent state
  const [comparisonList, setComparisonList] = useState(() => {
    try {
      const saved = localStorage.getItem('disha_college_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected modals passed between views
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);
  const [selectedCollegeForModal, setSelectedCollegeForModal] = useState(null);
  const [selectedExamForHub, setSelectedExamForHub] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleCompare = (college) => {
    setComparisonList((prev) => {
      const exists = prev.some((c) => c._id === college._id);
      let updated;
      if (exists) {
        updated = prev.filter((c) => c._id !== college._id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 colleges simultaneously. Please remove a college to add another.');
          return prev;
        }
        updated = [...prev, college];
      }
      try {
        localStorage.setItem('disha_college_compare', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save comparison list:', err);
      }
      return updated;
    });
  };

  const handleRemoveFromCompare = (collegeId) => {
    setComparisonList((prev) => {
      const updated = prev.filter((c) => c._id !== collegeId);
      try {
        localStorage.setItem('disha_college_compare', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save comparison list:', err);
      }
      return updated;
    });
  };

  // Live dashboard summary data
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    colleges: [],
    exams: [],
    trackedExams: [],
    latestAttempt: null,
    loading: true,
    error: null
  });

  const fetchDashboardData = async () => {
    setDashboardData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [coursesRes, collegesRes, examsRes, trackedRes, latestAttemptRes] = await Promise.allSettled([
        studentApi.getCourses({ limit: 4 }),
        studentApi.getColleges({ limit: 3, format: 'envelope' }),
        studentApi.getEntranceExams({ limit: 4 }),
        studentApi.getTrackedExams(),
        studentApi.getLatestAptitudeAttempt()
      ]);

      const courses =
        coursesRes.status === 'fulfilled' && coursesRes.value?.data?.courses
          ? coursesRes.value.data.courses
          : [];

      let colleges = [];
      if (collegesRes.status === 'fulfilled') {
        const val = collegesRes.value;
        if (val?.data?.colleges) colleges = val.data.colleges;
        else if (Array.isArray(val?.data)) colleges = val.data.slice(0, 3);
        else if (Array.isArray(val)) colleges = val.slice(0, 3);
      }

      const exams =
        examsRes.status === 'fulfilled' && examsRes.value?.data?.entranceExams
          ? examsRes.value.data.entranceExams
          : [];

      const trackedExams =
        trackedRes.status === 'fulfilled' && Array.isArray(trackedRes.value?.data?.trackedExams)
          ? trackedRes.value.data.trackedExams
          : [];

      const latestAttempt =
        latestAttemptRes.status === 'fulfilled' && latestAttemptRes.value?.data?.attempt
          ? latestAttemptRes.value.data.attempt
          : null;

      setDashboardData({
        courses,
        colleges,
        exams,
        trackedExams,
        latestAttempt,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: 'Could not load all live guidance data.'
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    onNavigateToPublic();
  };

  const completionPercentage = student?.profileCompletionPercentage || (student?.profileCompleted ? 85 : 30);

  // Primary navigation items (always visible on desktop)
  const primaryNavItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'courses', label: 'Explore Courses', icon: BookOpen },
    { id: 'colleges', label: 'Colleges', icon: Building2 },
    { id: 'exams', label: 'Examinations', icon: Award },
    { id: 'aptitude', label: 'Career Guidance', icon: Sparkles }
  ];

  // Secondary items in the "More" dropdown
  const secondaryNavItems = [
    {
      id: 'compare',
      label: 'Compare Colleges',
      icon: Scale,
      badge: comparisonList.length > 0 ? comparisonList.length : null
    },
    { id: 'exam-calendar', label: 'Exam Calendar', icon: Calendar },
    { id: 'recommendations', label: 'My Recommendations', icon: TrendingUp },
    { id: 'profile', label: 'Academic Profile', icon: User }
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <div className="student-portal" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      
      {/* =========================================================
          1. PREMIUM HORIZONTAL HEADER (No Cramping, No Text Wrap)
          ========================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div
          className="disha-container"
          style={{
            height: '74px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          {/* Logo & Wordmark - strictly un-wrapped */}
          <div
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)',
                flexShrink: 0
              }}
            >
              <GraduationCap size={22} />
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
                DISHA
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#0d9488', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>
                Student Guidance
              </div>
            </div>
          </div>

          {/* Primary Navigation Links (5 Items + "More" Menu) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              flexShrink: 0
            }}
            className="hide-on-mobile"
          >
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1d4ed8' : '#334155',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <item.icon size={16} color={isActive ? '#1d4ed8' : '#64748b'} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div ref={moreDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isSecondaryActive ? 700 : 500,
                  color: isSecondaryActive ? '#1d4ed8' : '#334155',
                  backgroundColor: isSecondaryActive ? '#eff6ff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  if (!isSecondaryActive) e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseOut={(e) => {
                  if (!isSecondaryActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>More</span>
                {comparisonList.length > 0 && (
                  <span
                    style={{
                      backgroundColor: '#1d4ed8',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.05rem 0.4rem',
                      borderRadius: '9999px'
                    }}
                  >
                    {comparisonList.length}
                  </span>
                )}
                <ChevronDown size={14} color={isSecondaryActive ? '#1d4ed8' : '#64748b'} />
              </button>

              {moreDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: '220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.12)',
                    padding: '0.5rem',
                    zIndex: 150
                  }}
                >
                  {secondaryNavItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMoreDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: isActive ? '#eff6ff' : 'none',
                          color: isActive ? '#1d4ed8' : '#334155',
                          fontSize: '0.88rem',
                          fontWeight: isActive ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s'
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <item.icon size={15} color={isActive ? '#1d4ed8' : '#64748b'} />
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="disha-badge disha-badge-blue" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Refresh, Reminders Bell & User Profile Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={fetchDashboardData}
              title="Refresh Data"
              className="hide-on-compact-mobile"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#1d4ed8')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <RefreshCw size={16} className={dashboardData.loading ? 'spinner' : ''} />
            </button>

            <button
              onClick={() => setActiveTab('exam-calendar')}
              title="Tracked Exams & Deadlines"
              className="hide-on-compact-mobile"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: dashboardData.trackedExams.length > 0 ? '#1d4ed8' : '#64748b',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={16} />
              {dashboardData.trackedExams.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#059669',
                    borderRadius: '50%',
                    border: '1.5px solid #ffffff'
                  }}
                />
              )}
            </button>

            {/* Profile Menu Trigger */}
            <div ref={userDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.35rem 0.65rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}
                >
                  {student?.name ? student.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="hide-on-mobile" style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {student?.name?.split(' ')[0] || 'Student'}
                  </div>
                </div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '240px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.12)',
                    padding: '0.65rem',
                    zIndex: 150
                  }}
                >
                  <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {student?.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {student?.email}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'none',
                      fontSize: '0.85rem',
                      color: '#334155',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={14} /> My Academic Profile
                    </span>
                    <span className="disha-badge disha-badge-teal" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                      {completionPercentage}%
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('exam-calendar');
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'none',
                      fontSize: '0.85rem',
                      color: '#334155',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Calendar size={14} /> Exam Deadlines & Alerts
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigateToPublic();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'none',
                      fontSize: '0.85rem',
                      color: '#334155',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <ExternalLink size={14} /> Public Website
                  </button>

                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.35rem 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'none',
                      fontSize: '0.85rem',
                      color: '#e11d48',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fff1f2')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                padding: '0.4rem'
              }}
              className="show-on-mobile"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
            }}
          >
            {[...primaryNavItems, ...secondaryNavItems].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === item.id ? '#eff6ff' : 'none',
                  color: activeTab === item.id ? '#1d4ed8' : '#334155',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === item.id ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <item.icon size={17} color={activeTab === item.id ? '#1d4ed8' : '#64748b'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="disha-badge disha-badge-blue" style={{ marginLeft: 'auto' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.5rem 0' }} />

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.75rem',
                border: 'none',
                background: 'none',
                color: '#e11d48',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={17} /> Sign Out
            </button>
          </div>
        )}
      </header>

      {/* =========================================================
          2. MAIN CONTENT VIEWPORT
          ========================================================= */}
      <main style={{ flex: 1, padding: '2.5rem 0' }}>
        <div className="disha-container">

          {/* TAB 1: OVERVIEW (Sophisticated, Balanced Guidance Hub) */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>

              {/* A. Sophisticated Welcome Section (Split Layout, No Giant Gradient Box) */}
              <div
                className="disha-card disha-hero-split"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
                }}
              >
                {/* Left Column: Personalized Greeting, Heading, Buttons & Integrated Profile Strip */}
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '0.3rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#1d4ed8',
                      marginBottom: '1rem'
                    }}
                  >
                    <Sparkles size={14} />
                    Welcome back, {student?.name || 'Student'}
                  </div>

                  <h1
                    style={{
                      fontSize: 'clamp(1.35rem, 4vw, 2.3rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.025em',
                      lineHeight: 1.25,
                      color: '#0f172a',
                      marginBottom: '0.85rem',
                      wordBreak: 'break-word'
                    }}
                  >
                    Shape Your Undergraduate Future After Plus Two.
                  </h1>

                  <p
                    style={{
                      fontSize: '0.98rem',
                      lineHeight: 1.6,
                      color: '#475569',
                      marginBottom: '1.75rem'
                    }}
                  >
                    Discover verified degree programs, compare accredited colleges across India, and track critical admission dates tailored to your academic stream.
                  </p>

                  {/* Two Prominent Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="disha-btn-primary"
                    >
                      <BookOpen size={16} />
                      Explore Degree Programs
                    </button>

                    <button
                      onClick={() => setActiveTab('aptitude')}
                      className="disha-btn-teal"
                    >
                      <Sparkles size={16} />
                      {dashboardData.latestAttempt ? 'Review Career Guidance' : 'Take Career Aptitude Test'}
                    </button>
                  </div>

                  {/* Subtle Integrated Profile Readiness Strip */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                        <span style={{ color: '#0f172a' }}>Academic Profile Readiness</span>
                        <span style={{ color: completionPercentage >= 70 ? '#059669' : '#d97706' }}>
                          {completionPercentage}% Complete
                        </span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${completionPercentage}%`,
                            height: '100%',
                            backgroundColor: completionPercentage >= 70 ? '#0d9488' : '#2563eb',
                            borderRadius: '9999px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('profile')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1d4ed8',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Update Details &rarr;
                    </button>
                  </div>
                </div>

                {/* Right Column: Visual Photographic Presentation */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <div className="disha-hero-img-box">
                    <img
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80"
                      alt="Higher Education Campus"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.1) 60%)'
                      }}
                    />

                    {/* Floating Info Badges on Photo */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1.25rem',
                        left: '1.25rem',
                        right: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#0f172a',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        <CheckCircle2 size={16} color="#0d9488" />
                        <span>Verified UG Degree Catalog & Premier Colleges</span>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#99f6e4',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        <Calendar size={16} color="#2dd4bf" />
                        <span>Real-Time Exam Deadlines & Reminders</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* B. Continue Your Journey (3 Visually Distinctive Action Modules) */}
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
                    Continue Your Journey
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    Key guidance milestones designed to help you make informed higher-education decisions.
                  </p>
                </div>

                <div className="disha-grid-3col">
                  {/* Module 1: Academic Profile */}
                  <div
                    className="disha-card disha-card-hover"
                    style={{
                      padding: '1.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #1d4ed8'
                    }}
                    onClick={() => setActiveTab('profile')}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={20} />
                        </div>
                        <span className={completionPercentage >= 70 ? 'disha-badge disha-badge-emerald' : 'disha-badge disha-badge-amber'}>
                          {completionPercentage}% Complete
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                        Academic Profile
                      </h3>

                      <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {student?.academicProfile?.stream
                          ? `Registered under ${student.academicProfile.stream}. Update marks or location preferences.`
                          : 'Add your Plus Two stream, board, and marks percentage to receive accurate eligibility matches.'}
                      </p>
                    </div>

                    <div style={{ color: '#1d4ed8', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>Update Academic Profile</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>

                  {/* Module 2: Explore Courses */}
                  <div
                    className="disha-card disha-card-hover"
                    style={{
                      padding: '1.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #0d9488'
                    }}
                    onClick={() => setActiveTab('courses')}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={20} />
                        </div>
                        <span className="disha-badge disha-badge-teal">
                          Degree Catalog
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                        Explore Undergraduate Courses
                      </h3>

                      <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        Browse verified 3-year and 4-year degree programs across Technology, Medicine, Commerce, Science, and Humanities.
                      </p>
                    </div>

                    <div style={{ color: '#0d9488', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>Browse Course Catalog</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>

                  {/* Module 3: Career Assessment */}
                  <div
                    className="disha-card disha-card-hover"
                    style={{
                      padding: '1.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #d97706'
                    }}
                    onClick={() => setActiveTab('aptitude')}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sparkles size={20} />
                        </div>
                        <span className={dashboardData.latestAttempt ? 'disha-badge disha-badge-emerald' : 'disha-badge disha-badge-amber'}>
                          {dashboardData.latestAttempt ? 'Assessed' : '15 Mins'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                        Discover Career Interests
                      </h3>

                      <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {dashboardData.latestAttempt
                          ? `Identified Holland code ${dashboardData.latestAttempt.riasecProfile?.hollandCode || 'RIA'}. Review personalized Gemini AI suggestions.`
                          : 'Complete our 36-question Holland RIASEC psychometric assessment to identify your natural strengths.'}
                      </p>
                    </div>

                    <div style={{ color: '#d97706', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>{dashboardData.latestAttempt ? 'View Recommendations' : 'Begin Assessment'}</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* C. Explore Educational Opportunities (Real Courses Showcase) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
                      Explore Educational Opportunities
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      Verified undergraduate degree programs with curricular overviews and eligibility.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="disha-btn-secondary"
                  >
                    View All Programs &rarr;
                  </button>
                </div>

                {dashboardData.loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                    <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#1d4ed8', borderRadius: '50%', margin: '0 auto 0.75rem auto' }} />
                    <p style={{ fontSize: '0.9rem' }}>Loading verified programs...</p>
                  </div>
                ) : (
                  <div className="disha-grid-3col">
                    {dashboardData.courses.map((course) => (
                      <div
                        key={course._id}
                        className="disha-card disha-card-hover"
                        style={{
                          padding: '1.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                            <span className="disha-badge disha-badge-blue">
                              {course.degreeType || 'UG Degree'}
                            </span>
                            {course.duration && (
                              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={13} />
                                {course.duration}
                              </span>
                            )}
                          </div>

                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                            {course.name}
                          </h3>

                          {course.category?.name && (
                            <div style={{ fontSize: '0.82rem', color: '#0d9488', fontWeight: 600, marginBottom: '0.75rem' }}>
                              {course.category.name}
                            </div>
                          )}

                          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                            {course.description
                              ? course.description.slice(0, 110) + (course.description.length > 110 ? '...' : '')
                              : 'Curriculum requirements, passing marks, and career possibilities.'}
                          </p>
                        </div>

                        <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {course.eligibility ? course.eligibility.slice(0, 22) + '...' : 'Plus Two Pass'}
                          </span>
                          <button
                            onClick={() => setSelectedCourseForModal(course)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#1d4ed8',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            Details <ChevronRight size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* D. Discover Colleges & Important Examination Dates (Two Columns) */}
              <div className="disha-grid-2col">
                {/* Discover Colleges */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={18} color="#059669" />
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        Discover Colleges
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('colleges')}
                      style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      College Finder &rarr;
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dashboardData.colleges.map((col) => (
                      <div
                        key={col._id}
                        className="disha-card disha-card-hover"
                        style={{ padding: '1.25rem' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                            {col.name}
                          </h3>
                          {col.naacGrade && (
                            <span className="disha-badge disha-badge-emerald" style={{ fontSize: '0.72rem' }}>
                              NAAC {col.naacGrade}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                          <MapPin size={13} color="#0d9488" />
                          <span>{col.district ? `${col.district}, ` : ''}{col.state}</span>
                          <span style={{ margin: '0 0.25rem' }}>&bull;</span>
                          <span>{col.type || 'College'}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {Array.isArray(col.coursesOffered) ? `${col.coursesOffered.length} Programs` : 'UG Courses'}
                          </span>
                          <div style={{ display: 'flex', gap: '0.65rem' }}>
                            <button
                              onClick={() => handleToggleCompare(col)}
                              style={{
                                background: comparisonList.some((c) => c._id === col._id) ? '#eff6ff' : '#f8fafc',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: comparisonList.some((c) => c._id === col._id) ? '#1d4ed8' : '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              {comparisonList.some((c) => c._id === col._id) ? '✓ Compared' : '+ Compare'}
                            </button>
                            <button
                              onClick={() => setSelectedCollegeForModal(col)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#059669',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              View &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Examination Dates */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} color="#d97706" />
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        Important Examination Dates
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('exams')}
                      style={{ background: 'none', border: 'none', color: '#d97706', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      All Examinations &rarr;
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dashboardData.exams.map((ex) => (
                      <div
                        key={ex._id}
                        className="disha-card disha-card-hover"
                        style={{ padding: '1.25rem' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                            {ex.name}
                          </h3>
                          <span className="disha-badge disha-badge-amber" style={{ fontSize: '0.72rem' }}>
                            {ex.examLevel || 'National'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.85rem' }}>
                          {ex.conductingAuthority || 'National Testing Body'}
                        </div>

                        <div
                          style={{
                            backgroundColor: '#fffbeb',
                            borderRadius: '6px',
                            padding: '0.6rem 0.8rem',
                            border: '1px solid #fde68a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <span style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>
                            Application Deadline
                          </span>
                          <span style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={13} />
                            {ex.registrationEndDate ? new Date(ex.registrationEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Announced soon'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setSelectedExamForHub(ex);
                              setActiveTab('exams');
                            }}
                            className="disha-btn-secondary"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                          >
                            Track & Set Reminders &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COURSE EXPLORER */}
          {activeTab === 'courses' && (
            <CourseExplorer
              onExploreColleges={() => setActiveTab('colleges')}
            />
          )}

          {/* TAB 3: COLLEGE FINDER */}
          {activeTab === 'colleges' && (
            <CollegeFinder
              onCompareCollege={handleToggleCompare}
              comparisonList={comparisonList}
            />
          )}

          {/* TAB 4: COLLEGE COMPARISON */}
          {activeTab === 'compare' && (
            <CollegeComparison
              comparisonList={comparisonList}
              onRemoveFromCompare={handleRemoveFromCompare}
              onAddMoreColleges={() => setActiveTab('colleges')}
            />
          )}

          {/* TAB 5: ENTRANCE EXAM HUB */}
          {activeTab === 'exams' && (
            <EntranceExamHub
              onTrackSuccess={fetchDashboardData}
              initialSelectedExam={selectedExamForHub}
            />
          )}

          {/* TAB 6: EXAM CALENDAR */}
          {activeTab === 'exam-calendar' && (
            <ExamCalendar
              onNavigateToHub={() => setActiveTab('exams')}
            />
          )}

          {/* TAB 7: APTITUDE ASSESSMENT */}
          {activeTab === 'aptitude' && (
            <AptitudeAssessment
              onComplete={fetchDashboardData}
              initialView="assessment"
            />
          )}

          {/* TAB 8: MY RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <AptitudeAssessment
              onComplete={fetchDashboardData}
              initialView="results"
            />
          )}

          {/* TAB 9: STUDENT ACADEMIC PROFILE */}
          {activeTab === 'profile' && (
            <StudentProfile />
          )}

        </div>
      </main>

      {/* Course Details Modal */}
      {selectedCourseForModal && (
        <CourseDetailsModal
          course={selectedCourseForModal}
          onClose={() => setSelectedCourseForModal(null)}
          onExploreColleges={() => {
            setSelectedCourseForModal(null);
            setActiveTab('colleges');
          }}
        />
      )}

      {/* College Details Modal */}
      {selectedCollegeForModal && (
        <CollegeDetailsModal
          college={selectedCollegeForModal}
          onClose={() => setSelectedCollegeForModal(null)}
          onCompare={(col) => {
            handleToggleCompare(col);
          }}
          isComparing={comparisonList.some((c) => c._id === selectedCollegeForModal._id)}
        />
      )}

    </div>
  );
};

export default StudentDashboard;
