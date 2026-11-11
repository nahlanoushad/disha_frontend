import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  BookOpen,
  Award,
  Filter,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

const ExamCalendar = ({
  exams = [],
  trackedExams = [],
  onSelectExam = () => {}
}) => {
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'list' | 'timeline'
  const [filterTrackedOnly, setFilterTrackedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Month navigation state (anchored to November 2026 by default)
  const [currentDate, setCurrentDate] = useState(() => {
    // Current environment local year is 2026
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const trackedExamIds = useMemo(() => {
    return new Set(trackedExams.map((t) => t.examId?._id || t.examId || t.exam?._id));
  }, [trackedExams]);

  // Flatten all important dates across all matching exams
  const allEvents = useMemo(() => {
    const list = [];
    exams.forEach((exam) => {
      // Filter by tracked
      if (filterTrackedOnly && !trackedExamIds.has(exam._id)) {
        return;
      }
      // Filter by category
      if (
        selectedCategory !== 'all' &&
        exam.streamCategory &&
        exam.streamCategory.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return;
      }

      if (Array.isArray(exam.importantDates) && exam.importantDates.length > 0) {
        exam.importantDates.forEach((item) => {
          if (item.date) {
            list.push({
              ...item,
              dateObj: new Date(item.date),
              exam
            });
          }
        });
      }
    });

    // Sort chronologically
    return list.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [exams, trackedExamIds, filterTrackedOnly, selectedCategory]);

  // Calendar matrix calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const getEventBadgeStyle = (eventType) => {
    switch (eventType) {
      case 'application_closing':
        return { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' };
      case 'application_opening':
        return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
      case 'examination':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#cbd5e1' };
      case 'admit_card_release':
        return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
      case 'result':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };
    }
  };

  const formatDateIndian = (d) => {
    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper for countdown
  const getRelativeDayText = (dateObj) => {
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const targetUTC = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const diff = Math.round((targetUTC - todayUTC) / (1000 * 60 * 60 * 24));

    if (diff < 0) return `${Math.abs(diff)} days ago`;
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    if (diff <= 7) return `In ${diff} days`;
    if (diff <= 30) return `In ${Math.ceil(diff / 7)} weeks`;
    return `In ${Math.round(diff / 30)} months`;
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Top Header & View Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
            Examination Schedule & Event Calendar
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#475569' }}>
            Official admission deadlines, test dates, and release timelines evaluated in <strong>Asia/Kolkata</strong> context.
          </p>
        </div>

        {/* View Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#e2e8f0',
            borderRadius: '10px',
            padding: '0.25rem',
            gap: '0.25rem'
          }}
        >
          {[
            { id: 'month', label: 'Monthly Calendar' },
            { id: 'list', label: 'Upcoming Events' },
            { id: 'timeline', label: 'Admission Timeline' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === mode.id ? '#ffffff' : 'transparent',
                color: viewMode === mode.id ? '#1d4ed8' : '#475569',
                fontWeight: viewMode === mode.id ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: viewMode === mode.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '14px',
          backgroundColor: '#ffffff',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
            <input
              type="checkbox"
              checked={filterTrackedOnly}
              onChange={(e) => setFilterTrackedOnly(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#1d4ed8' }}
            />
            Show Only My Tracked Examinations ({trackedExamIds.size})
          </label>

          <span style={{ color: '#d1d5db' }}>|</span>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Stream:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1.5px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="all">All Streams</option>
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
              <option value="Law">Law</option>
              <option value="Science">Science</option>
              <option value="Management">Management</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', fontSize: '0.74rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#e11d48' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e11d48' }} /> Deadline
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#1d4ed8' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1d4ed8' }} /> Exam Day
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#d97706' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }} /> Admit Card
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#059669' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} /> Registration
          </span>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR VIEW */}
      {viewMode === 'month' && (
        <div
          className="glass-panel"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            overflowX: 'auto'
          }}
        >
          {/* Calendar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {monthName}
              </h3>
              <button
                onClick={handleToday}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Today
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4b5563'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4b5563'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))',
              gap: '1px',
              backgroundColor: '#f1f0f7',
              border: '1px solid #f1f0f7',
              borderRadius: '12px 12px 0 0',
              overflow: 'hidden'
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div
                key={i}
                style={{
                  padding: '0.65rem',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: '#6b7280'
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))',
              gap: '1px',
              backgroundColor: '#f1f0f7',
              border: '1px solid #f1f0f7',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              overflow: 'hidden'
            }}
          >
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  minHeight: '95px',
                  backgroundColor: '#fcfcfc',
                  padding: '0.5rem'
                }}
              />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const cellDate = new Date(year, month, dayNum);
              const cellDateUTC = Date.UTC(year, month, dayNum);

              // Match events occurring on this date
              const dayEvents = allEvents.filter((ev) => {
                const evUTC = Date.UTC(
                  ev.dateObj.getFullYear(),
                  ev.dateObj.getMonth(),
                  ev.dateObj.getDate()
                );
                return evUTC === cellDateUTC;
              });

              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={`day-${dayNum}`}
                  style={{
                    minHeight: '95px',
                    backgroundColor: isToday ? '#f8fafc' : '#ffffff',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: isToday ? 800 : 600,
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: isToday ? '#1d4ed8' : 'transparent',
                        color: isToday ? '#ffffff' : '#374151'
                      }}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1d4ed8' }}>
                        {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Event Chips */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
                    {dayEvents.map((ev, evIdx) => {
                      const style = getEventBadgeStyle(ev.eventType);
                      return (
                        <div
                          key={evIdx}
                          onClick={() => onSelectExam(ev.exam)}
                          title={`${ev.exam.name}: ${ev.title}`}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.35rem',
                            borderRadius: '4px',
                            backgroundColor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <strong>{ev.exam.name}:</strong> {ev.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: UPCOMING EVENTS LIST */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {allEvents.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '16px'
              }}
            >
              <CalendarIcon size={38} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                No events found matching your filter criteria
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Try switching streams or unchecking the "Show Only Tracked" toggle.
              </p>
            </div>
          ) : (
            allEvents.map((ev, idx) => {
              const style = getEventBadgeStyle(ev.eventType);
              const relativeText = getRelativeDayText(ev.dateObj);
              const isPast = relativeText.includes('ago');

              return (
                <div
                  key={idx}
                  onClick={() => onSelectExam(ev.exam)}
                  className="glass-panel"
                  style={{
                    padding: '1.15rem 1.4rem',
                    borderRadius: '14px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-card)',
                    cursor: 'pointer',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    borderLeft: `4px solid ${style.color}`,
                    opacity: isPast ? 0.65 : 1,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '10px',
                        backgroundColor: style.bg,
                        border: `1px solid ${style.border}`,
                        textAlign: 'center',
                        minWidth: '70px'
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: style.color, textTransform: 'uppercase', display: 'block' }}>
                        {ev.dateObj.toLocaleString('en-IN', { month: 'short' })}
                      </span>
                      <strong style={{ fontSize: '1.25rem', color: style.color, display: 'block' }}>
                        {ev.dateObj.getDate()}
                      </strong>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: '#e2e8f0',
                            color: '#1e40af'
                          }}
                        >
                          {ev.exam.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          • {ev.exam.streamCategory || 'General'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                        {ev.title}
                      </h4>
                      {ev.description && (
                        <p style={{ fontSize: '0.82rem', color: '#475569' }}>{ev.description}</p>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: style.color,
                        backgroundColor: style.bg,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {relativeText}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af' }}>
                      {formatDateIndian(ev.dateObj)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 3: ADMISSION TIMELINE */}
      {viewMode === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {exams
            .filter((e) => !filterTrackedOnly || trackedExamIds.has(e._id))
            .filter((e) => selectedCategory === 'all' || e.streamCategory?.toLowerCase() === selectedCategory.toLowerCase())
            .map((exam) => (
              <div
                key={exam._id}
                className="glass-panel"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                      {exam.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {exam.conductingAuthority} • {exam.streamCategory}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectExam(exam)}
                    className="btn-secondary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                  >
                    View Details
                  </button>
                </div>

                {/* Horizontal / Wrapped Milestones */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                    position: 'relative'
                  }}
                >
                  {(exam.importantDates && exam.importantDates.length > 0 ? exam.importantDates : []).map((step, sIdx) => {
                    const stepDate = new Date(step.date);
                    const isPassed = stepDate.getTime() < Date.now();
                    return (
                      <div
                        key={sIdx}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          backgroundColor: isPassed ? '#f9fafb' : '#f8fafc',
                          border: isPassed ? '1px solid #e5e7eb' : '1.5px solid #cbd5e1',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                          {isPassed ? (
                            <CheckCircle2 size={14} color="#9ca3af" />
                          ) : (
                            <Clock size={14} color="#1d4ed8" />
                          )}
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: isPassed ? '#9ca3af' : '#1d4ed8'
                            }}
                          >
                            {isPassed ? 'Completed' : 'Upcoming'}
                          </span>
                        </div>

                        <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                          {step.title}
                        </strong>

                        <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                          {formatDateIndian(stepDate)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExamCalendar;

