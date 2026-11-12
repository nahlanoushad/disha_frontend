import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  RotateCcw,
  History,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  Briefcase,
  GraduationCap,
  Target,
  Compass,
  Lightbulb,
  AlertCircle,
  RefreshCw,
  Layers,
  MapPin
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';

const MATCH_BADGE_STYLES = {
  'Top Recommendation': {
    bg: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8',
    pillBg: '#1d4ed8',
    pillText: '#ffffff'
  },
  'Strong Match': {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    text: '#059669',
    pillBg: '#059669',
    pillText: '#ffffff'
  },
  'Good Match': {
    bg: '#f8fafc',
    border: '#e2e8f0',
    text: '#475569',
    pillBg: '#64748b',
    pillText: '#ffffff'
  },
  'Worth Exploring': {
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#b45309',
    pillBg: '#d97706',
    pillText: '#ffffff'
  }
};

const AssessmentResultsView = ({
  attempt,
  onRetakeAssessment = () => {},
  onOpenHistory = () => {},
  onNavigateToCourse = () => {},
  onNavigateToCollege = () => {}
}) => {
  const [currentAttempt, setCurrentAttempt] = useState(attempt);
  const [retryingAi, setRetryingAi] = useState(false);
  const [showLegacyDetails, setShowLegacyDetails] = useState(false);

  if (!currentAttempt) return null;

  const isV2 = currentAttempt.assessmentVersion === 'v2.0' || currentAttempt.assessmentType === 'career_discovery';
  const recommendations = currentAttempt.courseRecommendations || [];
  const collegeRecs = currentAttempt.collegeRecommendations || currentAttempt.ruleBasedRecommendations?.recommendedColleges || [];
  const profileSummary = currentAttempt.profileSummary || {};
  const aiAnalysis = currentAttempt.aiAnalysis || {};

  const handleRetryAi = async () => {
    setRetryingAi(true);
    try {
      const res = await studentApi.retryAptitudeAi(currentAttempt._id);
      if (res?.data?.aiAnalysis) {
        setCurrentAttempt((prev) => ({
          ...prev,
          aiAnalysis: res.data.aiAnalysis
        }));
      }
    } catch (err) {
      console.error('Failed to retry AI analysis:', err);
      alert('Could not refresh AI analysis. Please check network connection.');
    } finally {
      setRetryingAi(false);
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    return new Date(dateInput).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Summary Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1e1035 0%, #2e1065 50%, #1e1b4b 100%)',
          color: '#ffffff',
          boxShadow: '0 20px 40px -15px rgba(30, 16, 53, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#fef08a'
                }}
              >
                <Compass size={13} />
                Undergraduate Course Recommendations
              </span>
              {currentAttempt.completedAt && (
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Completed on {formatDate(currentAttempt.completedAt)}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '0.6rem' }}>
              Your Tailored Higher Education Pathway
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.55 }}>
              Matched directly against real undergraduate degree programs in DISHA's verified database based on your Plus Two background, enjoyable subjects, and future aspirations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenHistory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '0.65rem 1.15rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <History size={15} /> Attempt History
            </button>

            <button
              onClick={onRetakeAssessment}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#ffffff',
                color: '#1e1035',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
              }}
            >
              <RotateCcw size={15} /> Retake Assessment
            </button>
          </div>
        </div>

        {/* Profile Snapshot Pills in Banner */}
        {(profileSummary.enjoyedSubjects?.length > 0 || profileSummary.strengths?.length > 0) && (
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)' }}>
              Identified Profile Strengths:
            </span>
            {profileSummary.enjoyedSubjects?.map((sub, sidx) => (
              <span
                key={sidx}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                ★ {sub}
              </span>
            ))}
            {profileSummary.strengths?.map((str, strIdx) => (
              <span
                key={strIdx}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#bae6fd',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                ✓ {str}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 1: PRIMARY COURSE RECOMMENDATIONS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Top Recommended Courses for You
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Real programs available in DISHA's central catalog ranked by compatibility with your academic strengths.
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
            {recommendations.length} Programs Matched
          </span>
        </div>

        {recommendations.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px' }}>
            <BookOpen size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>No matching courses generated</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem' }}>
              Try retaking the assessment to provide updated subject affinities and preferences.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recommendations.map((rec, idx) => {
              const badgeStyle = MATCH_BADGE_STYLES[rec.matchLevel] || MATCH_BADGE_STYLES['Good Match'];
              const isTop = idx === 0 || rec.matchLevel === 'Top Recommendation';

              return (
                <div
                  key={rec.courseId || idx}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    border: isTop ? '2px solid #1d4ed8' : '1.5px solid #e2e8f0',
                    boxShadow: isTop ? '0 10px 30px -5px rgba(29, 78, 216, 0.12)' : '0 4px 12px rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  {/* Top Bar: Match Level & Indicative Score */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          backgroundColor: badgeStyle.pillBg,
                          color: badgeStyle.pillText
                        }}
                      >
                        {isTop ? '★ ' : ''}{rec.matchLevel}
                      </span>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569'
                        }}
                      >
                        {rec.category || 'Undergraduate Degree'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          backgroundColor: '#f8fafc',
                          color: '#64748b'
                        }}
                      >
                        Duration: {rec.duration || '3-4 Years'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#64748b' }}>Compatibility:</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>
                        {rec.indicativeScore || 90}%
                      </span>
                    </div>
                  </div>

                  {/* Course Title & High-Level Summary */}
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.45rem' }}>
                      {rec.courseName}
                    </h3>
                    {rec.eligibility && (
                      <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        <strong style={{ color: '#334155' }}>Eligibility:</strong> {rec.eligibility}
                      </p>
                    )}
                  </div>

                  {/* Why this course suits the student */}
                  {Array.isArray(rec.matchReasons) && rec.matchReasons.length > 0 && (
                    <div style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Lightbulb size={15} color="#d97706" />
                        Why this program suits your profile:
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {rec.matchReasons.map((reason, ridx) => (
                          <li key={ridx} style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Career Opportunities Tags */}
                  {Array.isArray(rec.careerOpportunities) && rec.careerOpportunities.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Briefcase size={13} /> Target Careers:
                      </span>
                      {rec.careerOpportunities.map((career, cidx) => (
                        <span
                          key={cidx}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '6px',
                            border: '1px solid #dbeafe'
                          }}
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '1rem',
                    gap: '0.75rem'
                  }}>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      Explore course syllabus, admission criteria, fee estimates, and verified colleges.
                    </span>

                    <button
                      onClick={() => onNavigateToCourse(rec)}
                      className="btn-primary"
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.35rem',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      <BookOpen size={16} />
                      View Complete Course Details
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: DISHA AI GUIDANCE COUNSELOR (GEMINI) */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1.5px solid #ede9fe',
          boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.08)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#f5f3ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ddd6fe'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035', letterSpacing: '-0.01em' }}>
                DISHA AI Counselor Guidance & Synthesis
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#7c6f93' }}>
                AI-driven contextual synthesis grounded exclusively in your verified assessment choices.
              </p>
            </div>
          </div>

          <button
            onClick={handleRetryAi}
            disabled={retryingAi}
            className="btn-outline"
            style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem' }}
          >
            <RefreshCw size={13} className={retryingAi ? 'spinner' : ''} />
            {retryingAi ? 'Generating...' : 'Refresh AI Analysis'}
          </button>
        </div>

        {/* AI Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* Student Profile Summary */}
          <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#fdfcfe', border: '1px solid #ede9fe' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6d28d9', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={15} /> Your Academic Orientation
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.55 }}>
              {aiAnalysis.studentSummary ||
                'Your profile demonstrates clear focus and strong readiness for structured undergraduate study in your chosen disciplines.'}
            </p>
          </div>

          {/* Why These Courses Fit */}
          <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0369a1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={15} /> Why These Degrees Fit
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.55 }}>
              {aiAnalysis.whyTheseCourses ||
                aiAnalysis.personalizedExplanation ||
                'The recommended courses provide practical continuity with your Plus Two strengths, giving you strong professional footing.'}
            </p>
          </div>

          {/* Actionable Next Steps */}
          <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#15803d', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GraduationCap size={15} /> Recommended Next Steps
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.55 }}>
              {aiAnalysis.learningGuidance ||
                'Begin reviewing introductory coursework online, explore relevant university entrance syllabi, and note important admission dates.'}
            </p>
          </div>

          {/* Growth Areas */}
          <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#b45309', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lightbulb size={15} color="#d97706" /> Areas to Build Confidence
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.55 }}>
              {aiAnalysis.growthAreas ||
                'Strengthen foundational problem-solving and engage in group project discussions to build communication confidence for college.'}
            </p>
          </div>
        </div>

        {/* AI Disclaimer & Model Info */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Guidance generated using grounded AI synthesis. Does not guarantee university admission.
          </span>
          {aiAnalysis.modelUsed && (
            <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>
              Engine: {aiAnalysis.modelUsed}
            </span>
          )}
        </div>
      </div>

      {/* SECTION 3: ACCREDITED COLLEGES OFFERING RECOMMENDED COURSES */}
      {collegeRecs.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: '1.5px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Colleges Offering Recommended Programs
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Premier verified institutions from DISHA's database matching your recommended degrees.
              </p>
            </div>
            <button
              onClick={() => onNavigateToCollege()}
              className="btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              Explore All Colleges →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {collegeRecs.slice(0, 4).map((col, idx) => (
              <div
                key={col.collegeId || idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                      {col.type || 'Government / Aided'}
                    </span>
                    {col.matchedCourse && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                        {col.matchedCourse}
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {col.collegeName || col.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}>
                    <MapPin size={13} /> {col.district || 'Kerala'}, {col.state || 'India'}
                  </div>
                </div>

                {Array.isArray(col.matchReasons) && col.matchReasons.length > 0 && (
                  <p style={{ fontSize: '0.76rem', color: '#475569', margin: 0, fontStyle: 'italic' }}>
                    ✓ {col.matchReasons[0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEGACY RIASEC VIEW (for v1.0 attempts only) */}
      {!isV2 && currentAttempt.riasecCode && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setShowLegacyDetails(!showLegacyDetails)}
            className="btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            {showLegacyDetails ? 'Hide Psychological Assessment Scores' : 'View Legacy RIASEC Personality Scores'}
          </button>

          {showLegacyDetails && (
            <div className="glass-panel" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                Holland RIASEC Code: {currentAttempt.riasecCode}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Dominant themes: {(currentAttempt.topInterests || []).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentResultsView;
