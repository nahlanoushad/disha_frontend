import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Award,
  Clock,
  ExternalLink,
  Bell,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';
import ExamDetailsModal from './ExamDetailsModal.jsx';
import ExamCalendar from './ExamCalendar.jsx';

const CATEGORIES = [
  { id: 'all', label: 'All Streams' },
  { id: 'Engineering', label: 'Engineering' },
  { id: 'Medical', label: 'Medical' },
  { id: 'Law', label: 'Law' },
  { id: 'Science', label: 'Science' },
  { id: 'Management', label: 'Management' }
];

const EntranceExamHub = ({ initialView = 'exams', initialSelectedExamId = null }) => {
  const [exams, setExams] = useState([]);
  const [trackedExams, setTrackedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Summary counts from DB
  const [summaryCounts, setSummaryCounts] = useState({
    total: 0,
    open: 0,
    closingSoon: 0,
    upcoming: 0
  });

  // Active view inside Exam Hub
  const [hubView, setHubView] = useState(initialView); // 'exams' | 'tracked' | 'calendar'

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal inspection state
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load tracked exams
  const fetchTrackedExams = async () => {
    try {
      const res = await studentApi.getTrackedExams();
      if (res?.data?.trackedExams) {
        setTrackedExams(res.data.trackedExams);
      }
    } catch (err) {
      console.warn('Could not load tracked exams:', err);
    }
  };

  // Load all exams
  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedLevel !== 'all') params.examLevel = selectedLevel;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const res = await studentApi.getEntranceExams(params);
      if (res?.data?.entranceExams) {
        setExams(res.data.entranceExams);
      } else if (Array.isArray(res)) {
        setExams(res);
      } else {
        setExams([]);
      }

      if (res?.summaryCounts) {
        setSummaryCounts(res.summaryCounts);
      }
    } catch (err) {
      console.error('Failed to fetch entrance exams:', err);
      setError('Could not retrieve entrance examinations catalog. Please check connection.');
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackedExams();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExams();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedLevel, selectedStatus]);

  // Initial deep link handling
  useEffect(() => {
    if (initialSelectedExamId && exams.length > 0) {
      const matched = exams.find((e) => e._id === initialSelectedExamId);
      if (matched) {
        setSelectedExam(matched);
        setIsModalOpen(true);
      }
    }
  }, [initialSelectedExamId, exams]);

  // Set of tracked exam IDs for O(1) lookup
  const trackedExamMap = useMemo(() => {
    const map = new Map();
    trackedExams.forEach((t) => {
      const id = t.examId?._id || t.examId || t.exam?._id;
      if (id) map.set(id, t);
    });
    return map;
  }, [trackedExams]);

  const handleOpenExamModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleToggleQuickTrack = async (e, exam) => {
    e.stopPropagation();
    const existing = trackedExamMap.get(exam._id);
    try {
      if (existing) {
        await studentApi.untrackExam(exam._id);
      } else {
        await studentApi.trackExam({
          examId: exam._id,
          reminderOffsets: [7, 3, 1, 0],
          selectedEventTypes: ['application_closing', 'admit_card_release', 'examination', 'result']
        });
      }
      fetchTrackedExams();
    } catch (err) {
      console.error('Failed to toggle tracking:', err);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedStatus('all');
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'Date Not Announced';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Date Not Announced';
    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('closing soon')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: '#fff1f2',
            color: '#e11d48',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: '1px solid #fecdd3'
          }}
        >
          <Clock size={12} /> Closing Soon
        </span>
      );
    }
    if (s.includes('open')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: '1px solid #a7f3d0'
          }}
        >
          <CheckCircle2 size={12} /> Applications Open
        </span>
      );
    }
    if (s.includes('admit card')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: '#fffbeb',
            color: '#d97706',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: '1px solid #fde68a'
          }}
        >
          <FileText size={12} /> Admit Card Released
        </span>
      );
    }
    if (s.includes('upcoming')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: '1px solid #cbd5e1'
          }}
        >
          <Calendar size={12} /> Upcoming
        </span>
      );
    }
    if (s.includes('completed')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: '1px solid #e5e7eb'
          }}
        >
          <Check size={12} /> Completed
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          backgroundColor: '#f9fafb',
          color: '#6b7280',
          fontSize: '0.74rem',
          fontWeight: 600,
          border: '1px solid #e5e7eb'
        }}
      >
        {status || 'Date Not Announced'}
      </span>
    );
  };

  // Filtered exams according to current tab
  const displayedExams = useMemo(() => {
    if (hubView === 'tracked') {
      return exams.filter((e) => trackedExamMap.has(e._id));
    }
    return exams;
  }, [exams, hubView, trackedExamMap]);

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      
      {/* A. Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Entrance Examinations
        </h1>
        <p style={{ color: '#475569', fontSize: '0.92rem' }}>
          Explore examinations and stay ahead of important admission deadlines.
        </p>
      </div>

      {/* B. Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-card)',
            borderLeft: '4px solid #1d4ed8'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Examinations
            </span>
            <Award size={18} color="#1d4ed8" />
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            {summaryCounts.total}
          </strong>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.2rem' }}>
            Active entrance programs in DB
          </span>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-card)',
            borderLeft: '4px solid #059669'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Applications Open
            </span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669' }}>
            {summaryCounts.open}
          </strong>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.2rem' }}>
            Currently accepting submissions
          </span>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-card)',
            borderLeft: '4px solid #e11d48'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Closing Soon
            </span>
            <Clock size={18} color="#e11d48" />
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 800, color: '#e11d48' }}>
            {summaryCounts.closingSoon}
          </strong>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.2rem' }}>
            Deadlines within 7 days
          </span>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-card)',
            borderLeft: '4px solid #8b5cf6'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Upcoming Exams
            </span>
            <Calendar size={18} color="#8b5cf6" />
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1d4ed8' }}>
            {summaryCounts.upcoming}
          </strong>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.2rem' }}>
            Future test schedule
          </span>
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '1.5rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'exams', label: 'All Examinations', count: exams.length },
          { id: 'tracked', label: 'My Tracked Exams', count: trackedExams.length },
          { id: 'calendar', label: 'Schedule & Calendar View', icon: Calendar }
        ].map((tab) => {
          const active = hubView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setHubView(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 0.5rem',
                border: 'none',
                background: 'none',
                fontSize: '0.92rem',
                fontWeight: active ? 800 : 600,
                color: active ? '#1d4ed8' : '#475569',
                borderBottom: active ? '3px solid #1d4ed8' : '3px solid transparent',
                marginBottom: '-2px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: active ? '#eff6ff' : '#f3f4f6',
                    color: active ? '#1d4ed8' : '#6b7280'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONDITIONAL RENDER: CALENDAR VIEW VS EXAMS LIST */}
      {hubView === 'calendar' ? (
        <ExamCalendar
          exams={exams}
          trackedExams={trackedExams}
          onSelectExam={handleOpenExamModal}
        />
      ) : (
        <>
          {/* C & D: Search and Filter Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by examination name, conducting authority (e.g. NTA, CEE), course or stream..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.85rem',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '0.88rem',
                  backgroundColor: '#fafafa',
                  color: '#0f172a'
                }}
              />
            </div>

            {/* Filter Controls Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              
              {/* Category Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        border: active ? '1.5px solid #1d4ed8' : '1px solid #e5e7eb',
                        backgroundColor: active ? '#eff6ff' : '#ffffff',
                        color: active ? '#1d4ed8' : '#4b5563',
                        fontSize: '0.8rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Dropdowns */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="all">All Levels</option>
                  <option value="National">National Level</option>
                  <option value="State">State Level</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="Applications Open">Applications Open</option>
                  <option value="Closing Soon">Closing Soon</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Admit Card Released">Admit Card Released</option>
                  <option value="Examination Completed">Examination Completed</option>
                </select>

                {(search || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all') && (
                  <button
                    onClick={handleClearFilters}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #fecdd3',
                      backgroundColor: '#fff1f2',
                      color: '#e11d48',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* E. Cards Grid */}
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #1d4ed8',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}
              />
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>Loading entrance examination schedule...</p>
            </div>
          ) : displayedExams.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <Award size={40} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                {hubView === 'tracked'
                  ? 'No tracked examinations yet'
                  : 'No examinations found matching criteria'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                {hubView === 'tracked'
                  ? 'Track your target examinations to receive automated reminder notifications and timeline alerts.'
                  : 'Try clearing your search query or adjusting your stream and status filters.'}
              </p>
              {hubView === 'tracked' ? (
                <button
                  onClick={() => setHubView('exams')}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Browse All Examinations
                </button>
              ) : (
                <button
                  onClick={handleClearFilters}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {displayedExams.map((exam) => {
                const isTracked = trackedExamMap.has(exam._id);
                return (
                  <div
                    key={exam._id}
                    className="glass-panel"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '1.4rem',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: isTracked ? '1.5px solid #c4b5fd' : '1px solid #e2e8f0',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div>
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '6px',
                              backgroundColor: '#e2e8f0',
                              color: '#1e40af'
                            }}
                          >
                            {exam.streamCategory || 'General'}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '6px',
                              backgroundColor: '#f3f4f6',
                              color: '#4b5563'
                            }}
                          >
                            {exam.examLevel || 'National'}
                          </span>
                        </div>

                        {/* Track / Untrack Button */}
                        <button
                          onClick={(e) => handleToggleQuickTrack(e, exam)}
                          title={isTracked ? 'Tracking Active (Click to untrack)' : 'Click to track exam & set reminders'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '8px',
                            border: isTracked ? '1px solid #1d4ed8' : '1px solid #e5e7eb',
                            backgroundColor: isTracked ? '#eff6ff' : '#ffffff',
                            color: isTracked ? '#1d4ed8' : '#6b7280',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          <Bell size={13} fill={isTracked ? '#1d4ed8' : 'none'} color="#1d4ed8" />
                          {isTracked ? 'Tracked' : 'Track'}
                        </button>
                      </div>

                      {/* Exam Title & Authority */}
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', marginBottom: '0.2rem' }}>
                        {exam.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                        {exam.conductingAuthority}
                      </p>

                      {/* Dynamic Status Badge */}
                      <div style={{ marginBottom: '1rem' }}>
                        {getStatusBadge(exam.computedStatus)}
                      </div>

                      {/* Related Courses Chips */}
                      {exam.relatedCourses && exam.relatedCourses.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.15rem' }}>
                          {exam.relatedCourses.slice(0, 3).map((c, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                backgroundColor: '#f9fafb',
                                color: '#4b5563',
                                border: '1px solid #f0f0f0'
                              }}
                            >
                              {c}
                            </span>
                          ))}
                          {exam.relatedCourses.length > 3 && (
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', alignSelf: 'center' }}>
                              +{exam.relatedCourses.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Important Dates Highlights */}
                      <div
                        style={{
                          backgroundColor: '#fafafa',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem',
                          marginBottom: '1.25rem',
                          border: '1px solid #f1f0f7'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                          <span style={{ color: '#6b7280' }}>Application Deadline:</span>
                          <strong style={{ color: '#0f172a' }}>
                            {formatDate(exam.registrationEndDate)}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                          <span style={{ color: '#6b7280' }}>Examination Date:</span>
                          <strong style={{ color: '#1d4ed8' }}>
                            {formatDate(exam.examDate)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleOpenExamModal(exam)}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        View Full Details <ChevronRight size={14} />
                      </button>

                      {exam.officialWebsite && (
                        <a
                          href={exam.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open official examination portal"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1d4ed8'
                          }}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Exam Details Modal */}
      <ExamDetailsModal
        isOpen={isModalOpen}
        exam={selectedExam}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExam(null);
        }}
        trackedInfo={selectedExam ? trackedExamMap.get(selectedExam._id) : null}
        onTrackingUpdated={() => {
          fetchTrackedExams();
          fetchExams();
        }}
      />
    </div>
  );
};

export default EntranceExamHub;

