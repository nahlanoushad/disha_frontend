import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Compass,
  BookOpen,
  Building2,
  Award,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  MapPin,
  ShieldCheck,
  Clock,
  Layers,
  TrendingUp
} from 'lucide-react';
import studentApi from '../services/studentApi.js';
import CourseDetailsModal from '../components/student/CourseDetailsModal.jsx';
import CollegeDetailsModal from '../components/student/CollegeDetailsModal.jsx';

const PublicHomePage = ({ 
  onGoToAdmin, 
  onGoToStudentLogin, 
  onGoToStudentRegister,
  isAdminAuthenticated = false,
  isStudentAuthenticated = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [entranceExams, setEntranceExams] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);
  const [selectedCollegeForModal, setSelectedCollegeForModal] = useState(null);

  // Fetch real data for showcase sections
  useEffect(() => {
    let isMounted = true;

    const fetchPublicShowcase = async () => {
      try {
        setLoadingData(true);
        const [courseRes, collegeRes, examRes] = await Promise.all([
          studentApi.getCourses({ limit: 6 }).catch(() => ({ data: [] })),
          studentApi.getColleges({ limit: 4 }).catch(() => ({ data: [] })),
          studentApi.getEntranceExams({ limit: 4 }).catch(() => ({ data: [] }))
        ]);

        if (isMounted) {
          const courseList = Array.isArray(courseRes?.data?.courses)
            ? courseRes.data.courses
            : Array.isArray(courseRes?.data)
            ? courseRes.data
            : [];

          const collegeList = Array.isArray(collegeRes?.data?.colleges)
            ? collegeRes.data.colleges
            : Array.isArray(collegeRes?.data)
            ? collegeRes.data
            : [];

          const examList = Array.isArray(examRes?.data?.entranceExams)
            ? examRes.data.entranceExams
            : Array.isArray(examRes?.data)
            ? examRes.data
            : [];

          setCourses(courseList);
          setColleges(collegeList);
          setEntranceExams(examList);
        }
      } catch (err) {
        console.error('Error fetching public showcase data:', err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    fetchPublicShowcase();

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'Engineering & Technology', stream: 'Engineering', icon: Layers, desc: 'B.Tech, B.E., Artificial Intelligence, Electronics & Core Disciplines' },
    { name: 'Medical & Health Sciences', stream: 'Medical', icon: Award, desc: 'MBBS, BDS, B.Pharm, Nursing, Allied Health & Clinical Sciences' },
    { name: 'Computer Applications & IT', stream: 'Computer Applications', icon: Sparkles, desc: 'BCA, B.Sc Computer Science, Data Science, AI & Cyber Security' },
    { name: 'Science & Research', stream: 'Science', icon: BookOpen, desc: 'Physics, Chemistry, Mathematics, Statistics & Applied Life Sciences' },
    { name: 'Commerce & Business Management', stream: 'Commerce', icon: TrendingUp, desc: 'B.Com, BBA, Corporate Finance, Business Analytics & Economics' },
    { name: 'Arts, Humanities & Social Sciences', stream: 'Arts & Humanities', icon: Compass, desc: 'Psychology, English Literature, Media, Journalism & Public Policy' },
    { name: 'Law & Professional Studies', stream: 'Law', icon: Building2, desc: 'Integrated 5-Year BA LLB, BBA LLB, Corporate Law & Governance' }
  ];

  return (
    <div className="disha-public" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#0f172a' }}>
      
      {/* =========================================================
          1. NAVIGATION HEADER (Horizontal, Uncramped, No Text Wrapping)
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
            maxWidth: '1360px',
            height: '74px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Brand Logo - Fixed Width, No Wrap */}
          <div
            onClick={() => scrollToSection('hero')}
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
                width: '42px',
                height: '42px',
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
              <GraduationCap size={24} />
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1 }}>
                DISHA
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0d9488', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>
                Higher Education Guidance
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.15rem',
              flexShrink: 0
            }}
            className="hide-on-mobile"
          >
            <button
              onClick={() => scrollToSection('hero')}
              style={{ background: 'none', border: 'none', fontSize: '0.88rem', fontWeight: 600, color: '#1d4ed8', cursor: 'pointer', padding: '0.35rem 0.2rem' }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              style={{ background: 'none', border: 'none', fontSize: '0.88rem', fontWeight: 500, color: '#334155', cursor: 'pointer', transition: 'color 0.2s', padding: '0.35rem 0.2rem' }}
              onMouseOver={(e) => (e.target.style.color = '#1d4ed8')}
              onMouseOut={(e) => (e.target.style.color = '#334155')}
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              style={{ background: 'none', border: 'none', fontSize: '0.88rem', fontWeight: 500, color: '#334155', cursor: 'pointer', transition: 'color 0.2s', padding: '0.35rem 0.2rem' }}
              onMouseOver={(e) => (e.target.style.color = '#1d4ed8')}
              onMouseOut={(e) => (e.target.style.color = '#334155')}
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('colleges')}
              style={{ background: 'none', border: 'none', fontSize: '0.88rem', fontWeight: 500, color: '#334155', cursor: 'pointer', transition: 'color 0.2s', padding: '0.35rem 0.2rem' }}
              onMouseOver={(e) => (e.target.style.color = '#1d4ed8')}
              onMouseOut={(e) => (e.target.style.color = '#334155')}
            >
              Colleges
            </button>
            <button
              onClick={() => scrollToSection('exams')}
              style={{ background: 'none', border: 'none', fontSize: '0.88rem', fontWeight: 500, color: '#334155', cursor: 'pointer', transition: 'color 0.2s', padding: '0.35rem 0.2rem' }}
              onMouseOver={(e) => (e.target.style.color = '#1d4ed8')}
              onMouseOut={(e) => (e.target.style.color = '#334155')}
            >
              Exams
            </button>
            <button
              onClick={() => scrollToSection('aptitude')}
              style={{ background: 'none', border: 'none', fontSize: '0.88rem', fontWeight: 600, color: '#0d9488', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.2rem' }}
            >
              <Sparkles size={14} />
              Career Guidance
            </button>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }} className="hide-on-mobile">
            <button
              onClick={onGoToStudentLogin}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                padding: '0.45rem 0.7rem',
                borderRadius: '8px',
                transition: 'all 0.15s'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#f1f5f9')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              {isStudentAuthenticated ? 'Student Dashboard' : 'Student Sign In'}
            </button>

            <button
              onClick={onGoToStudentRegister}
              className="disha-btn-primary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.86rem' }}
            >
              Get Started
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0f172a',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            className="show-on-mobile"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
            }}
          >
            <button
              onClick={() => scrollToSection('hero')}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 600, color: '#1d4ed8', padding: '0.4rem 0' }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: '#334155', padding: '0.4rem 0' }}
            >
              How DISHA Helps
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: '#334155', padding: '0.4rem 0' }}
            >
              Explore Courses
            </button>
            <button
              onClick={() => scrollToSection('colleges')}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: '#334155', padding: '0.4rem 0' }}
            >
              Find Colleges
            </button>
            <button
              onClick={() => scrollToSection('exams')}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: '#334155', padding: '0.4rem 0' }}
            >
              Entrance Exams
            </button>
            <button
              onClick={() => scrollToSection('aptitude')}
              style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 600, color: '#0d9488', padding: '0.4rem 0' }}
            >
              Career Assessment
            </button>

            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={onGoToStudentLogin}
                className="disha-btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Student Sign In
              </button>
              <button
                onClick={onGoToStudentRegister}
                className="disha-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Started Free
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          2. HERO SECTION (High Impact Education Photography + Clear Value Proposition)
          ========================================================= */}
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '580px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: `
            linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 58, 138, 0.88) 55%, rgba(13, 148, 136, 0.82) 100%),
            url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          padding: '5rem 0'
        }}
      >
        <div className="disha-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#99f6e4',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Sparkles size={16} />
              Higher Secondary Career & College Guidance
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.35rem',
                color: '#ffffff',
                wordBreak: 'break-word'
              }}
            >
              Your Future After Plus Two Starts Here.
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
                lineHeight: 1.6,
                color: '#e2e8f0',
                marginBottom: '2.5rem',
                maxWidth: '720px'
              }}
            >
              Explore verified undergraduate courses, discover premier colleges, track entrance examination deadlines, and find the career path that matches your true interests.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={onGoToStudentRegister}
                className="disha-btn-white"
              >
                Explore Courses
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => scrollToSection('aptitude')}
                className="disha-btn-outline-white"
              >
                <Sparkles size={18} />
                Discover Your Career
              </button>
            </div>

            {/* Trust Proof Points */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.75rem',
                marginTop: '3.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>Verified UG Degree Catalog</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>Premier Colleges Across India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>Holland RIASEC & Gemini AI Guidance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>Admission Deadlines & Reminders</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          3. HOW DISHA HELPS YOU (4 Guidance Pillars)
          ========================================================= */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="disha-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span className="disha-badge disha-badge-teal" style={{ marginBottom: '0.75rem' }}>
              Guidance Blueprint
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
              How DISHA Guides Your Higher Education
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
              Transitioning from higher secondary school into university can feel overwhelming. DISHA simplifies the decision-making process into four guided steps.
            </p>
          </div>

          <div
            className="disha-grid-responsive"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* Pillar 1 */}
            <div className="disha-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid #bfdbfe'
                }}
              >
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                1. Discover Your Interests
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, flex: 1 }}>
                Identify your unique personality strengths and psychometric preferences using our Holland RIASEC aptitude assessment.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="disha-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdfa',
                  color: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid #99f6e4'
                }}
              >
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                2. Explore Educational Pathways
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, flex: 1 }}>
                Review comprehensive course curricula, Plus Two eligibility criteria, degree types, and emerging career opportunities across streams.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="disha-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#fffbeb',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid #fde68a'
                }}
              >
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                3. Compare Colleges
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, flex: 1 }}>
                Evaluate accredited institutions, college types, campus facilities, and compare up to three colleges side-by-side to make the right choice.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="disha-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid #a7f3d0'
                }}
              >
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                4. Plan Your Next Step
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, flex: 1 }}>
                Never miss an admission deadline or admit card release. Track entrance exams and receive automated browser and SMS reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. EXPLORE CAREER & COURSE STREAMS
          ========================================================= */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="disha-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="disha-badge disha-badge-blue" style={{ marginBottom: '0.5rem' }}>
                Academic Disciplines
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Explore Higher Education Streams
              </h2>
              <p style={{ fontSize: '1rem', color: '#475569' }}>
                Browse higher education pathways mapped directly from Plus Two Science, Commerce, and Humanities.
              </p>
            </div>

            <button
              onClick={onGoToStudentRegister}
              className="disha-btn-secondary"
            >
              Browse All Programs
              <ChevronRight size={16} />
            </button>
          </div>

          <div
            className="disha-grid-responsive"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="disha-card disha-card-hover"
                style={{
                  padding: '1.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={onGoToStudentRegister}
              >
                <div>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <cat.icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {cat.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1d4ed8', fontSize: '0.88rem', fontWeight: 600 }}>
                  <span>Explore Stream Courses</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. EXPLORE COURSES SHOWCASE (Real API Data)
          ========================================================= */}
      <section id="courses" style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="disha-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="disha-badge disha-badge-teal" style={{ marginBottom: '0.5rem' }}>
                Central Course Catalog
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Featured Undergraduate Courses
              </h2>
              <p style={{ fontSize: '1rem', color: '#475569' }}>
                Real courses verified in DISHA's database, including eligibility requirements and durations.
              </p>
            </div>

            <button
              onClick={onGoToStudentRegister}
              className="disha-btn-primary"
            >
              Explore All Courses
              <ArrowRight size={16} />
            </button>
          </div>

          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
              <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#1d4ed8', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
              <p>Loading verified programs...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="disha-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <BookOpen size={36} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <p>No course records available currently.</p>
            </div>
          ) : (
            <div
              className="disha-grid-responsive"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {courses.slice(0, 6).map((course) => (
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                      <span className="disha-badge disha-badge-blue">
                        {course.degreeType || 'Undergraduate'}
                      </span>
                      {course.duration && (
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={13} />
                          {course.duration}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                      {course.name}
                    </h3>

                    {course.category?.name && (
                      <p style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {course.category.name}
                      </p>
                    )}

                    <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                      {course.description
                        ? course.description.slice(0, 110) + (course.description.length > 110 ? '...' : '')
                        : 'Explore comprehensive eligibility requirements and career prospects for this program.'}
                    </p>
                  </div>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {course.eligibility ? `Eligibility: ${course.eligibility.slice(0, 24)}...` : 'Plus Two Pass'}
                    </span>
                    <button
                      onClick={() => setSelectedCourseForModal(course)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1d4ed8',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      View Details <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          6. FIND YOUR COLLEGE SHOWCASE (Real API Data)
          ========================================================= */}
      <section id="colleges" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="disha-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="disha-badge disha-badge-emerald" style={{ marginBottom: '0.5rem' }}>
                Institution Directory
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Discover Premier Colleges Across India
              </h2>
              <p style={{ fontSize: '1rem', color: '#475569' }}>
                Filter government, aided, and autonomous institutions by state, district, and courses offered.
              </p>
            </div>

            <button
              onClick={onGoToStudentRegister}
              className="disha-btn-secondary"
            >
              Explore College Finder
              <ArrowRight size={16} />
            </button>
          </div>

          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
              <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#059669', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
              <p>Loading college directory...</p>
            </div>
          ) : colleges.length === 0 ? (
            <div className="disha-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <Building2 size={36} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <p>No college records available currently.</p>
            </div>
          ) : (
            <div
              className="disha-grid-responsive"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {colleges.slice(0, 4).map((col) => (
                <div
                  key={col._id}
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
                      <span className="disha-badge disha-badge-slate">
                        {col.type || 'Institution'}
                      </span>
                      {col.naacGrade && (
                        <span className="disha-badge disha-badge-emerald">
                          NAAC {col.naacGrade}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                      {col.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      <MapPin size={14} color="#0d9488" />
                      <span>{col.district ? `${col.district}, ` : ''}{col.state || 'India'}</span>
                    </div>

                    {col.affiliation && (
                      <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
                        Affiliated to {col.affiliation}
                      </p>
                    )}
                  </div>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {Array.isArray(col.coursesOffered) ? `${col.coursesOffered.length} Programs` : 'UG Courses'}
                    </span>
                    <button
                      onClick={() => setSelectedCollegeForModal(col)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#059669',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      View Campus <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          7. ENTRANCE EXAMINATION SECTION (Real API Data)
          ========================================================= */}
      <section id="exams" style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="disha-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="disha-badge disha-badge-amber" style={{ marginBottom: '0.5rem' }}>
                Admission Radars
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Key Entrance Examinations & Deadlines
              </h2>
              <p style={{ fontSize: '1rem', color: '#475569' }}>
                Track registration dates, admit card announcements, and official exam dates with automated student reminders.
              </p>
            </div>

            <button
              onClick={onGoToStudentRegister}
              className="disha-btn-primary"
            >
              View Examination Hub
              <ArrowRight size={16} />
            </button>
          </div>

          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
              <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#d97706', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
              <p>Loading entrance examinations...</p>
            </div>
          ) : entranceExams.length === 0 ? (
            <div className="disha-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <Award size={36} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <p>No entrance exam deadlines currently posted.</p>
            </div>
          ) : (
            <div
              className="disha-grid-responsive"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {entranceExams.slice(0, 4).map((exam) => (
                <div
                  key={exam._id}
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
                      <span className="disha-badge disha-badge-amber">
                        {exam.examLevel || 'National Level'}
                      </span>
                      {exam.streamCategory && (
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                          {exam.streamCategory}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                      {exam.name}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                      {exam.conductingAuthority}
                    </p>

                    <div style={{ backgroundColor: '#fffbeb', borderRadius: '8px', padding: '0.75rem 0.9rem', marginBottom: '1rem', border: '1px solid #fde68a' }}>
                      <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Application Deadline
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#78350f', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={15} />
                        {exam.registrationEndDate ? new Date(exam.registrationEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'To be announced'}
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {exam.officialWebsite ? 'Official Portal' : 'Details Available'}
                    </span>
                    <button
                      onClick={onGoToStudentRegister}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d97706',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      Track Exam <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          8. CAREER ASSESSMENT BANNER (Holland RIASEC + Gemini AI Guidance)
          ========================================================= */}
      <section
        id="aptitude"
        style={{
          padding: '5rem 0',
          backgroundColor: '#0f172a',
          backgroundImage: `
            linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.9) 100%),
            url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff'
        }}
      >
        <div className="disha-container">
          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(13, 148, 136, 0.2)',
                border: '1px solid rgba(13, 148, 136, 0.4)',
                padding: '0.4rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#5eead4',
                marginBottom: '1.5rem'
              }}
            >
              <Sparkles size={16} />
              AI-Powered Career & Aptitude Engine
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginBottom: '1.25rem',
                lineHeight: 1.2
              }}
            >
              Not Sure Which Career Suits You?
            </h2>

            <p
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.65,
                color: '#cbd5e1',
                marginBottom: '2rem'
              }}
            >
              Explore your natural inclinations and cognitive strengths through our interactive psychometric assessment. Powered by the proven Holland RIASEC model and enhanced by Google Gemini AI, DISHA generates grounded, personalized higher education recommendations tailored for Plus Two students.
            </p>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '1.25rem 1.75rem',
                marginBottom: '2.5rem',
                maxWidth: '680px',
                margin: '0 auto 2.5rem auto',
                fontSize: '0.92rem',
                color: '#cbd5e1',
                lineHeight: 1.5
              }}
            >
              <strong style={{ color: '#ffffff' }}>Note for students:</strong> This assessment provides career-interest guidance based on your psychometric preferences; it is not a deterministic or binding examination.
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={onGoToStudentRegister}
                className="disha-btn-teal"
                style={{
                  padding: '0.85rem 1.8rem',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                <Sparkles size={18} />
                Discover Your Career Interests
              </button>

              <button
                onClick={onGoToStudentLogin}
                className="disha-btn-outline-white"
                style={{
                  padding: '0.85rem 1.6rem',
                  fontSize: '1rem'
                }}
              >
                Already Registered? Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          9. FINAL CALL TO ACTION BANNER
          ========================================================= */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#eff6ff', borderTop: '1px solid #dbeafe', borderBottom: '1px solid #dbeafe' }}>
        <div className="disha-container" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
            Ready to Choose Your Next Academic Step?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#1d4ed8', lineHeight: 1.6, marginBottom: '2rem' }}>
            Join thousands of Plus Two students using DISHA to explore accredited courses, evaluate colleges, and receive personalized guidance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onGoToStudentRegister}
              className="disha-btn-primary"
              style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}
            >
              Create Free Student Account
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onGoToStudentLogin}
              className="disha-btn-secondary"
              style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
            >
              Student Sign In
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          10. PROFESSIONAL FOOTER
          ========================================================= */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '4.5rem 0 2.5rem 0', borderTop: '1px solid #1e293b' }}>
        <div className="disha-container">
          <div
            className="disha-grid-responsive"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2.5rem',
              marginBottom: '3.5rem'
            }}
          >
            {/* Column 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#1d4ed8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  <GraduationCap size={22} />
                </div>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  DISHA
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1rem' }}>
                Digital Intelligent System for Higher Education Assistance. Empowering higher secondary students across India with informed educational pathways.
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Quick Navigation
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                <li>
                  <button onClick={() => scrollToSection('hero')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('courses')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    Explore Courses
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('colleges')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    Find Colleges
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('exams')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    Entrance Exams
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('aptitude')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    Career Assessment
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Portals */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Access Portals
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                <li>
                  <button onClick={onGoToStudentLogin} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    Student Portal Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onGoToStudentRegister} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    New Student Registration
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Purpose Notice */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Educational Guidance
              </h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.55, color: '#64748b' }}>
                DISHA is built to assist students transitioning from Plus Two to higher education. Institutional information and examination schedules are verified against official sources.
              </p>
            </div>
          </div>

          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.85rem',
              color: '#64748b'
            }}
          >
            <div>
              &copy; {new Date().getFullYear()} DISHA — Digital Intelligent System for Higher Education Assistance.
            </div>
            <div>
              Guidance platform for Indian Higher Secondary Students.
            </div>
          </div>
        </div>
      </footer>

      {/* Course Details Modal */}
      {selectedCourseForModal && (
        <CourseDetailsModal
          course={selectedCourseForModal}
          onClose={() => setSelectedCourseForModal(null)}
          onExploreColleges={() => {
            setSelectedCourseForModal(null);
            onGoToStudentRegister();
          }}
        />
      )}

      {/* College Details Modal */}
      {selectedCollegeForModal && (
        <CollegeDetailsModal
          college={selectedCollegeForModal}
          onClose={() => setSelectedCollegeForModal(null)}
          onCompare={() => {
            setSelectedCollegeForModal(null);
            onGoToStudentRegister();
          }}
          isComparing={false}
        />
      )}
    </div>
  );
};

export default PublicHomePage;
