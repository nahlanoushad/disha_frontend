import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';

const CourseDetailsModal = ({ course, onClose, onSelectCollege }) => {
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(false);

  useEffect(() => {
    if (course?.name) {
      fetchOfferingColleges(course.name);
    }
  }, [course]);

  const fetchOfferingColleges = async (courseName) => {
    setLoadingColleges(true);
    try {
      const res = await studentApi.getColleges({ course: courseName });
      if (Array.isArray(res)) {
        setColleges(res);
      } else if (res?.data?.colleges) {
        setColleges(res.data.colleges);
      } else {
        setColleges([]);
      }
    } catch (err) {
      console.warn('Could not load offering colleges for course:', err);
      setColleges([]);
    } finally {
      setLoadingColleges(false);
    }
  };

  if (!course) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(30, 16, 53, 0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px -10px rgba(124, 58, 237, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1.5px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #cbd5e1'
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                  {course.category?.name || 'Undergraduate'}
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  {course.status === 'active' ? 'Verified Degree' : course.status}
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {course.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Key Quick Facts Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              backgroundColor: '#fbfaff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Course Duration
              </span>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {course.duration || 'Information not available'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Minimum Eligibility
              </span>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {course.eligibility || '10+2 from recognized board'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Approximate Fee Structure
              </span>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {course.feeStructure || 'Information not available'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Expected Starting Salary
              </span>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>
                {course.expectedSalaryRange || '₹3.5 - 7.5 LPA (Industry standard)'}
              </p>
            </div>
          </div>

          {/* Section 1: Description & Overview */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} color="#1d4ed8" /> Program Overview
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              {course.description || 'This undergraduate curriculum provides comprehensive foundational and practical competencies in the chosen specialization.'}
            </p>
          </div>

          {/* Section 2: Admission Procedure & Entrance Exams */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} color="#1d4ed8" /> Admission Procedure & Entrance Exams
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              {course.admissionProcedure || 'Admission is based on merit in the qualifying higher-secondary examination or scores in centralized national/state entrance examinations.'}
            </p>

            {course.entranceExams && course.entranceExams.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                  Recognized Entrance Exams:
                </span>
                {course.entranceExams.map((exam, idx) => (
                  <span key={idx} className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                    {exam}
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>No specific entrance test required (Merit-based admission).</span>
            )}
          </div>

          {/* Section 3: Career Opportunities & Higher Study */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Briefcase size={16} color="#1d4ed8" /> Career Pathways & Industry Roles
            </h3>

            {course.careerOpportunities && course.careerOpportunities.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {course.careerOpportunities.map((opp, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    ✓ {opp}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Information not available.</p>
            )}

            {course.higherStudyOptions && course.higherStudyOptions.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                  Advanced Higher Study Options:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                  {course.higherStudyOptions.join(' • ')}
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Colleges Offering this Course (Live Database Relationships) */}
          <div style={{ paddingTop: '1.25rem', borderTop: '1.5px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={16} color="#1d4ed8" /> Colleges Offering {course.name}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                {colleges.length} Institutes Found
              </span>
            </h3>

            {loadingColleges ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                Checking database for offering colleges...
              </div>
            ) : colleges.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {colleges.map((col) => {
                  const locStr =
                    typeof col.location === 'object' && col.location !== null
                      ? col.location.address || `${col.district || ''}, ${col.state || ''}`
                      : col.location || `${col.district || ''}, ${col.state || ''}`;

                  return (
                    <div
                      key={col._id}
                      style={{
                        padding: '0.9rem 1.15rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                            {col.name}
                          </h4>
                          {col.naacGrade && (
                            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                              NAAC {col.naacGrade}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={12} color="#1d4ed8" /> {locStr}
                        </p>
                      </div>

                      {onSelectCollege && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectCollege(col);
                          }}
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', flexShrink: 0 }}
                        >
                          View College <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#fbfaff',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: '#64748b'
                }}
              >
                No specific college in the current directory is tagged with this course yet.
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 2rem',
            borderTop: '1.5px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            backgroundColor: '#ffffff'
          }}
        >
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;

