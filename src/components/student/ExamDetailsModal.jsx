import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  ExternalLink,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
  Bell,
  Check,
  ShieldCheck,
  Info
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';

const ExamDetailsModal = ({
  exam,
  isOpen,
  onClose,
  trackedInfo = null,
  onTrackingUpdated = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pattern' | 'application' | 'dates' | 'reminders'
  const [isTracked, setIsTracked] = useState(false);
  const [reminderOffsets, setReminderOffsets] = useState([7, 3, 1, 0]);
  const [selectedEventTypes, setSelectedEventTypes] = useState([
    'application_closing',
    'admit_card_release',
    'examination',
    'result'
  ]);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);
  const [trackingSuccess, setTrackingSuccess] = useState(null);

  useEffect(() => {
    if (trackedInfo) {
      setIsTracked(true);
      if (trackedInfo.reminderOffsets) setReminderOffsets(trackedInfo.reminderOffsets);
      if (trackedInfo.selectedEventTypes) setSelectedEventTypes(trackedInfo.selectedEventTypes);
      if (trackedInfo.notificationChannels) {
        setPushEnabled(trackedInfo.notificationChannels.push ?? true);
        setSmsEnabled(trackedInfo.notificationChannels.sms ?? false);
      }
    } else {
      setIsTracked(false);
      setReminderOffsets([7, 3, 1, 0]);
      setSelectedEventTypes(['application_closing', 'admit_card_release', 'examination', 'result']);
      setPushEnabled(true);
      setSmsEnabled(false);
    }
    setTrackingSuccess(null);
  }, [trackedInfo, exam]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !exam) return null;

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
    const s = (status || exam.computedStatus || '').toLowerCase();
    if (s.includes('closing soon')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#fff1f2',
            color: '#e11d48',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: '1px solid #fecdd3'
          }}
        >
          <Clock size={13} /> Closing Soon
        </span>
      );
    }
    if (s.includes('applications open') || s.includes('open')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: '1px solid #a7f3d0'
          }}
        >
          <CheckCircle2 size={13} /> Applications Open
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
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#fffbeb',
            color: '#d97706',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: '1px solid #fde68a'
          }}
        >
          <FileText size={13} /> Admit Card Released
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
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: '1px solid #cbd5e1'
          }}
        >
          <Calendar size={13} /> Upcoming
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
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: '1px solid #e5e7eb'
          }}
        >
          <Check size={13} /> Examination Completed
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.3rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: '#f9fafb',
          color: '#6b7280',
          fontSize: '0.78rem',
          fontWeight: 600,
          border: '1px solid #e5e7eb'
        }}
      >
        {exam.computedStatus || 'Date Not Announced'}
      </span>
    );
  };

  const handleToggleOffset = (offset) => {
    setReminderOffsets((prev) =>
      prev.includes(offset) ? prev.filter((o) => o !== offset) : [...prev, offset].sort((a, b) => b - a)
    );
  };

  const handleToggleEventType = (type) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSaveTracking = async () => {
    setSavingTracking(true);
    setTrackingSuccess(null);
    try {
      if (isTracked) {
        await studentApi.trackExam({
          examId: exam._id,
          reminderOffsets,
          selectedEventTypes,
          notificationChannels: { push: pushEnabled, sms: smsEnabled }
        });
        setTrackingSuccess('Exam tracked & reminder preferences updated!');
      } else {
        await studentApi.untrackExam(exam._id);
        setTrackingSuccess('Exam removed from tracking list.');
      }
      onTrackingUpdated();
      setTimeout(() => setTrackingSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to update tracking:', err);
      alert('Could not update examination tracking. Please try again.');
    } finally {
      setSavingTracking(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 10, 30, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1.5px solid #f1f0f7',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  backgroundColor: '#e2e8f0',
                  color: '#1e40af'
                }}
              >
                {exam.streamCategory || 'General Stream'}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563'
                }}
              >
                {exam.examLevel || 'National'} Level
              </span>
              {exam.verificationStatus === 'verified' ? (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <ShieldCheck size={12} /> Official Verified
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: '#fffbeb',
                    color: '#b45309'
                  }}
                >
                  Pending Verification
                </span>
              )}
              {getStatusBadge(exam.computedStatus)}
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
              {exam.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Conducted by: <strong>{exam.conductingAuthority}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1.5px solid #f1f0f7',
            padding: '0 1.75rem',
            backgroundColor: '#ffffff',
            overflowX: 'auto',
            gap: '0.5rem'
          }}
        >
          {[
            { id: 'overview', label: 'Overview & Eligibility', icon: Award },
            { id: 'pattern', label: 'Pattern & Syllabus', icon: BookOpen },
            { id: 'application', label: 'Application & Fees', icon: FileText },
            { id: 'dates', label: 'Important Dates', icon: Calendar },
            { id: 'reminders', label: 'Reminders & Tracking', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.85rem 0.75rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.84rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#1d4ed8' : '#6b7280',
                  borderBottom: active ? '3px solid #1d4ed8' : '3px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={active ? '#1d4ed8' : '#9ca3af'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          
          {/* TAB 1: OVERVIEW & ELIGIBILITY */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Target Academic Programs & Degrees
                </h4>
                {exam.relatedCourses && exam.relatedCourses.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {exam.relatedCourses.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        🎓 {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Information not available.</p>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Eligibility Criteria
                </h4>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #f3e8ff',
                    fontSize: '0.85rem',
                    color: '#4c1d95',
                    lineHeight: 1.6
                  }}
                >
                  {exam.eligibilityCriteria || 'Information Not Available.'}
                </div>
              </div>

              {exam.importantInstructions && (
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Important Guidelines & Candidate Instructions
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                    {exam.importantInstructions}
                  </p>
                </div>
              )}

              {exam.counsellingSchedule && (
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Counselling & Allotment Schedule
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                    {exam.counsellingSchedule}
                  </p>
                </div>
              )}

              {exam.verificationSource && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  <Info size={14} /> Official Source: {exam.verificationSource}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PATTERN & SYLLABUS */}
          {activeTab === 'pattern' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Examination Structure & Pattern
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>TEST MODE</span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                      {exam.examPattern?.mode || 'Information Not Available'}
                    </strong>
                  </div>
                  <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>TEST DURATION</span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                      {exam.examPattern?.duration || 'Information Not Available'}
                    </strong>
                  </div>
                  <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>TOTAL QUESTIONS</span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                      {exam.examPattern?.numberOfQuestions ?? 'Information Not Available'}
                    </strong>
                  </div>
                  <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>MAX MARKS</span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                      {exam.examPattern?.totalMarks ?? 'Information Not Available'}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Marking Scheme
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {exam.examPattern?.markingScheme || 'Information Not Available'}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Syllabus Overview
                </h4>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #f3e8ff',
                    fontSize: '0.85rem',
                    color: '#4c1d95',
                    lineHeight: 1.6
                  }}
                >
                  {exam.syllabusSummary || 'Information Not Available. Refer to the official conducting authority syllabus document.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATION & FEES */}
          {activeTab === 'application' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Application Procedure
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {exam.applicationProcess || 'Online application submission via the official examination portal.'}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Verified Application Fee Structure
                </h4>
                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0',
                    fontSize: '0.88rem',
                    color: '#065f46',
                    fontWeight: 600
                  }}
                >
                  {exam.applicationFee || 'Information Not Available (Refer to official prospectus)'}
                </div>
              </div>

              {exam.officialWebsite && (
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Official Web Portal
                  </h4>
                  <a
                    href={exam.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.86rem',
                      textDecoration: 'none'
                    }}
                  >
                    Open Official Portal <ExternalLink size={15} />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: IMPORTANT DATES */}
          {activeTab === 'dates' && (
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Official Examination Timeline & Events
              </h4>

              {exam.importantDates && exam.importantDates.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {exam.importantDates.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: '#fafafa',
                        border: '1px solid #f0f0f0',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                          {item.title}
                        </strong>
                        {item.description && (
                          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{item.description}</span>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#1d4ed8',
                            backgroundColor: '#eff6ff',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1'
                          }}
                        >
                          {formatDate(item.date)}
                        </span>
                        {item.isTentative && (
                          <span style={{ display: 'block', fontSize: '0.68rem', color: '#9ca3af' }}>Tentative</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Date Not Announced.</p>
              )}
            </div>
          )}

          {/* TAB 5: REMINDERS & TRACKING */}
          {activeTab === 'reminders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: isTracked ? '#eff6ff' : '#f9fafb',
                  border: isTracked ? '1.5px solid #c4b5fd' : '1px solid #e5e7eb'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                    Track {exam.name}
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                    Add this examination to your active tracking schedule and receive notification alerts.
                  </span>
                </div>
                <button
                  onClick={() => setIsTracked(!isTracked)}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isTracked ? '#1d4ed8' : '#e5e7eb',
                    color: isTracked ? '#ffffff' : '#374151',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isTracked ? '✓ Tracking Active' : '+ Track Exam'}
                </button>
              </div>

              {isTracked && (
                <>
                  {/* Reminder Timing Offsets */}
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Notification Lead Times
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      Select when DISHA should send you automated alerts before crucial deadlines:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {[
                        { offset: 7, label: '7 days before' },
                        { offset: 3, label: '3 days before' },
                        { offset: 1, label: '1 day before' },
                        { offset: 0, label: 'On the event day' }
                      ].map((item) => {
                        const checked = reminderOffsets.includes(item.offset);
                        return (
                          <button
                            key={item.offset}
                            onClick={() => handleToggleOffset(item.offset)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              borderRadius: '8px',
                              border: checked ? '1.5px solid #1d4ed8' : '1px solid #e5e7eb',
                              backgroundColor: checked ? '#eff6ff' : '#ffffff',
                              color: checked ? '#1d4ed8' : '#4b5563',
                              fontSize: '0.82rem',
                              fontWeight: checked ? 700 : 500,
                              cursor: 'pointer'
                            }}
                          >
                            {checked ? '✓ ' : ''}{item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Channels */}
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Notification Channels
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.85rem', color: '#0f172a' }}>
                        <input
                          type="checkbox"
                          checked={pushEnabled}
                          onChange={(e) => setPushEnabled(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#1d4ed8' }}
                        />
                        <span><strong>Browser Push Notifications (Firebase FCM)</strong> — Enabled on verified device</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.85rem', color: '#0f172a' }}>
                        <input
                          type="checkbox"
                          checked={smsEnabled}
                          onChange={(e) => setSmsEnabled(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#1d4ed8' }}
                        />
                        <span>
                          <strong>SMS Text Reminders</strong> — Sent to registered mobile number
                          <span style={{ fontSize: '0.74rem', color: '#9ca3af', marginLeft: '0.4rem' }}>
                            (Requires SMS provider configuration)
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {trackingSuccess && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    border: '1px solid #a7f3d0'
                  }}
                >
                  {trackingSuccess}
                </div>
              )}

              <button
                onClick={handleSaveTracking}
                disabled={savingTracking}
                className="btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.86rem',
                  opacity: savingTracking ? 0.7 : 1
                }}
              >
                {savingTracking ? 'Saving Changes...' : 'Save Tracking Preferences'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1.5px solid #f1f0f7',
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {exam.officialWebsite ? (
            <a
              href={exam.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#1d4ed8',
                fontWeight: 700,
                fontSize: '0.84rem',
                textDecoration: 'none'
              }}
            >
              Visit Official Examination Portal <ExternalLink size={14} />
            </a>
          ) : (
            <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Official portal not available</span>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.84rem' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsModal;

