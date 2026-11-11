import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  BookOpen,
  Building2,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  History,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  Check,
  X,
  Target
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';

const RIASEC_INFO = {
  Realistic: {
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    desc: 'Practical, hands-on, mechanical, physical systems, and engineering prototyping.'
  },
  Investigative: {
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#cbd5e1',
    desc: 'Scientific inquiry, analytical problem solving, medical research, and computational theory.'
  },
  Artistic: {
    color: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
    desc: 'Creative design, visual styling, literature, media, and innovative conceptualization.'
  },
  Social: {
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    desc: 'Mentoring, patient care, community health, teaching, and interpersonal collaboration.'
  },
  Enterprising: {
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    desc: 'Leadership, strategic decision-making, entrepreneurship, pitching, and business management.'
  },
  Conventional: {
    color: '#4b5563',
    bg: '#f9fafb',
    border: '#e5e7eb',
    desc: 'Organized data, structured records, financial precision, and systematic compliance.'
  }
};

const AssessmentResultsView = ({
  attempt,
  onRetakeAssessment = () => {},
  onOpenHistory = () => {},
  onNavigateToCourse = () => {},
  onNavigateToCollege = () => {}
}) => {
  const [showAnswerExplanations, setShowAnswerExplanations] = useState(false);
  const [retryingAi, setRetryingAi] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(attempt);

  if (!currentAttempt) return null;

  const {
    interestScores = {},
    topInterests = [],
    riasecCode = '',
    abilityScores = {},
    ruleBasedRecommendations = {},
    aiAnalysis = {},
    completedAt,
    answers = []
  } = currentAttempt;

  const abilityQuestionsWithAnswers = answers.filter((a) => a.section === 'ability');

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
      alert('Could not generate AI analysis at this moment. Please check backend server log.');
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
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      
      {/* Header & Quick Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: '#e2e8f0',
                color: '#1e40af',
                letterSpacing: '0.04em'
              }}
            >
              RIASEC Code: {riasecCode || 'ASSESSED'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Completed on {formatDate(completedAt)}
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Your Career Aptitude Profile
          </h1>
          <p style={{ color: '#475569', fontSize: '0.92rem' }}>
            Personalized synthesis of your career interests, cognitive strengths, and grounded educational pathways.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenHistory}
            className="btn-secondary"
            style={{ padding: '0.6rem 1.15rem', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <History size={15} /> Attempt History
          </button>
          <button
            onClick={onRetakeAssessment}
            className="btn-primary"
            style={{ padding: '0.6rem 1.15rem', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={15} /> Retake Assessment
          </button>
        </div>
      </div>

      {/* TOP INTEREST PROFILE (RIASEC) */}
      <div
        className="glass-panel"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="#1d4ed8" /> Career Interest Dimensions (RIASEC)
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Based on the 6 foundational work-preference themes. Dominant dimensions reflect what activities engage you most.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {topInterests.map((dim, idx) => (
              <span
                key={dim}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: RIASEC_INFO[dim]?.bg || '#eff6ff',
                  color: RIASEC_INFO[dim]?.color || '#1d4ed8',
                  border: `1px solid ${RIASEC_INFO[dim]?.border || '#cbd5e1'}`
                }}
              >
                #{idx + 1} {dim}
              </span>
            ))}
          </div>
        </div>

        {/* 6 RIASEC Dimension Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {Object.entries(interestScores).map(([dimension, data]) => {
            const isTop = topInterests.includes(dimension);
            const info = RIASEC_INFO[dimension] || RIASEC_INFO.Realistic;
            return (
              <div
                key={dimension}
                style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  backgroundColor: isTop ? info.bg : '#fafafa',
                  border: isTop ? `1.5px solid ${info.border}` : '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: isTop ? info.color : '#0f172a' }}>
                      {dimension}
                    </strong>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isTop ? info.color : '#4b5563' }}>
                      {data.percentage}%
                    </span>
                  </div>

                  <p style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                    {info.desc}
                  </p>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '7px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${data.percentage}%`,
                      height: '100%',
                      backgroundColor: info.color,
                      borderRadius: '9999px'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COGNITIVE ABILITY OVERVIEW */}
      <div
        className="glass-panel"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="#059669" /> Cognitive Ability Assessment
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Objective multi-category reasoning scores measured across problem-solving domains.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Overall Score</span>
            <strong style={{ fontSize: '1.4rem', color: '#059669', fontWeight: 800 }}>
              {abilityScores.totalScore} / {abilityScores.totalMaxScore} ({abilityScores.overallPercentage}%)
            </strong>
          </div>
        </div>

        {/* 4 Ability Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {[
            { key: 'logicalReasoning', label: 'Logical Reasoning', icon: '🧩' },
            { key: 'numericalReasoning', label: 'Numerical Reasoning', icon: '🔢' },
            { key: 'verbalReasoning', label: 'Verbal Reasoning', icon: '📖' },
            { key: 'analyticalThinking', label: 'Analytical Thinking', icon: '⚖️' }
          ].map((item) => {
            const data = abilityScores[item.key] || { score: 0, maxScore: 3, percentage: 0 };
            return (
              <div
                key={item.key}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                    {item.icon} {item.label}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
                    {data.score}/{data.maxScore}
                  </span>
                </div>

                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div
                    style={{
                      width: `${data.percentage}%`,
                      height: '100%',
                      backgroundColor: data.percentage >= 65 ? '#059669' : data.percentage >= 40 ? '#d97706' : '#e11d48',
                      borderRadius: '9999px'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Ability Answers Explanation Accordion Button */}
        {abilityQuestionsWithAnswers.length > 0 && (
          <div>
            <button
              onClick={() => setShowAnswerExplanations(!showAnswerExplanations)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1d4ed8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.4rem 0'
              }}
            >
              <HelpCircle size={15} />
              {showAnswerExplanations ? 'Hide Ability Question Solutions' : 'Review Ability Questions & Explanations'}
            </button>

            {showAnswerExplanations && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {abilityQuestionsWithAnswers.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      backgroundColor: item.isCorrect ? '#ecfdf5' : '#fff1f2',
                      border: `1px solid ${item.isCorrect ? '#a7f3d0' : '#fecdd3'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      {item.isCorrect ? (
                        <Check size={16} color="#059669" />
                      ) : (
                        <X size={16} color="#e11d48" />
                      )}
                      <strong style={{ fontSize: '0.85rem', color: item.isCorrect ? '#065f46' : '#9f1239' }}>
                        Question #{idx + 1} ({item.category}) — {item.isCorrect ? 'Correct (+1 mark)' : 'Incorrect'}
                      </strong>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '0.25rem' }}>
                      <strong>Your Answer:</strong> {String(item.selectedOption)}
                    </p>

                    {item.explanation && (
                      <p style={{ fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.5 }}>
                        <strong>Solution Explanation:</strong> {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* GEMINI AI PERSONALIZED GUIDANCE SECTION */}
      <div
        className="glass-panel"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem',
          border: '1.5px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#1d4ed8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                DISHA Intelligent Guidance Engine
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                AI-synthesized educational analysis powered by Google Gemini
              </span>
            </div>
          </div>

          {aiAnalysis?.status === 'available' ? (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: '#ecfdf5',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #a7f3d0'
              }}
            >
              ✓ Active ({aiAnalysis.modelUsed || 'gemini-2.5-flash'})
            </span>
          ) : (
            <button
              onClick={handleRetryAi}
              disabled={retryingAi}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={13} /> {retryingAi ? 'Connecting to Gemini...' : 'Connect Gemini AI'}
            </button>
          )}
        </div>

        {aiAnalysis?.status === 'available' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #f3e8ff' }}>
              <strong style={{ fontSize: '0.88rem', color: '#1e40af', display: 'block', marginBottom: '0.35rem' }}>
                Interest Theme Interpretation
              </strong>
              <p style={{ fontSize: '0.85rem', color: '#4c1d95', lineHeight: 1.6 }}>
                {aiAnalysis.interestInterpretation}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                <strong style={{ fontSize: '0.88rem', color: '#15803d', display: 'block', marginBottom: '0.35rem' }}>
                  Demonstrated Strengths
                </strong>
                <p style={{ fontSize: '0.84rem', color: '#166534', lineHeight: 1.6 }}>
                  {aiAnalysis.strengthsSummary}
                </p>
              </div>

              <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                <strong style={{ fontSize: '0.88rem', color: '#b45309', display: 'block', marginBottom: '0.35rem' }}>
                  Growth & Development Opportunities
                </strong>
                <p style={{ fontSize: '0.84rem', color: '#92400e', lineHeight: 1.6 }}>
                  {aiAnalysis.growthAreas}
                </p>
              </div>
            </div>

            {aiAnalysis.personalizedExplanation && (
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                  Educational Alignment Summary
                </strong>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {aiAnalysis.personalizedExplanation}
                </p>
              </div>
            )}

            {aiAnalysis.learningGuidance && (
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                  Actionable Next Steps
                </strong>
                <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                  {aiAnalysis.learningGuidance}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <Lightbulb size={20} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                Rule-Based Guidance Engine Active
              </strong>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                All course matches, college recommendations, RIASEC dimensions, and cognitive reasoning metrics are fully calculated from your assessment responses and MongoDB database records.
                {aiAnalysis?.errorMessage && ` (${aiAnalysis.errorMessage})`}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Configure <code>GEMINI_API_KEY</code> in backend environment to enable conversational AI synthesis.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RECOMMENDED UNDERGRADUATE COURSES (FROM MONGODB) */}
      <div
        className="glass-panel"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <BookOpen size={20} color="#1d4ed8" /> Recommended Degree Programs
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
            Curated directly from the DISHA database based on your interest profile and Plus Two academic stream.
          </p>
        </div>

        {ruleBasedRecommendations?.recommendedCourses?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {ruleBasedRecommendations.recommendedCourses.map((c) => (
              <div
                key={c.courseId}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8'
                      }}
                    >
                      {c.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>
                      {c.indicativeScore}% Indicative Match
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                    {c.courseName}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
                    Duration: {c.duration}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                    {c.matchReasons?.map((r, rIdx) => (
                      <span key={rIdx} style={{ fontSize: '0.75rem', color: '#4b5563', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                        <span style={{ color: '#1d4ed8', fontWeight: 700 }}>•</span> {r}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToCourse(c)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  Explore Course Details <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            No matching courses found in the current catalog.
          </p>
        )}
      </div>

      {/* RECOMMENDED COLLEGES (FROM MONGODB) */}
      <div
        className="glass-panel"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Building2 size={20} color="#1d4ed8" /> Institutions Offering Recommended Programs
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
            Real colleges in DISHA offering programs matching your aptitude results.
          </p>
        </div>

        {ruleBasedRecommendations?.recommendedColleges?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {ruleBasedRecommendations.recommendedColleges.map((col) => (
              <div
                key={col.collegeId}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px', backgroundColor: '#f3f4f6', color: '#4b5563' }}>
                      {col.type}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                      {col.district}, {col.state}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                    {col.collegeName}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', margin: '0.75rem 0 1rem' }}>
                    {col.matchReasons?.map((r, rIdx) => (
                      <span key={rIdx} style={{ fontSize: '0.75rem', color: '#4b5563', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                        <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> {r}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToCollege(col)}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  View College Profile <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Explore the College Finder to review colleges offering your matched courses.
          </p>
        )}
      </div>

      {/* ETHICAL GUIDANCE & DISCLAIMER FOOTER */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '12px',
          backgroundColor: '#fafafa',
          border: '1px solid #f0f0f0',
          fontSize: '0.78rem',
          color: '#6b7280',
          lineHeight: 1.6
        }}
      >
        <strong>Educational Guidance Advisory:</strong> The DISHA Aptitude & Guidance Engine is an exploratory educational tool designed to help higher-secondary students discover academic opportunities matching their personal interests and self-reported abilities. Match percentages are indicative guidance scores and do not constitute guaranteed admission or professional psychometric certifications. Always review official prospectuses and institutional eligibility criteria before applying.
      </div>
    </div>
  );
};

export default AssessmentResultsView;

