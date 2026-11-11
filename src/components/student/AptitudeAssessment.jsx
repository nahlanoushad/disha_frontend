import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  History,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Check,
  Target
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';
import AssessmentResultsView from './AssessmentResultsView.jsx';
import AssessmentHistoryModal from './AssessmentHistoryModal.jsx';

const AptitudeAssessment = ({
  onNavigateToCourse = () => {},
  onNavigateToCollege = () => {}
}) => {
  // Assessment workflow state:
  // 'loading' | 'intro' | 'interest' | 'ability' | 'review' | 'submitting' | 'results'
  const [step, setStep] = useState('loading');
  const [questions, setQuestions] = useState({
    interest: [],
    ability: []
  });
  const [activeAttempt, setActiveAttempt] = useState(null);
  const [latestAttempt, setLatestAttempt] = useState(null);
  const [attemptsHistory, setAttemptsHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Student answers mapping: { [questionId]: selectedValue }
  const [answers, setAnswers] = useState({});

  // Sub-pagination inside interest and ability sections (e.g. 4 questions per screen)
  const [interestPageIndex, setInterestPageIndex] = useState(0);
  const [abilityPageIndex, setAbilityPageIndex] = useState(0);

  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState(null);

  // 1. Initial Load: Questions, In-Progress Attempt, and Latest Attempt
  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        const [qRes, latestRes, historyRes] = await Promise.allSettled([
          studentApi.getAptitudeQuestions(),
          studentApi.getLatestAptitudeAttempt(),
          studentApi.getAptitudeAttempts()
        ]);

        if (qRes.status === 'fulfilled' && qRes.value?.data) {
          setQuestions({
            interest: qRes.value.data.interestQuestions || [],
            ability: qRes.value.data.abilityQuestions || []
          });
        }

        if (latestRes.status === 'fulfilled' && latestRes.value?.data?.attempt) {
          setLatestAttempt(latestRes.value.data.attempt);
        }

        if (historyRes.status === 'fulfilled' && historyRes.value?.data?.attempts) {
          setAttemptsHistory(historyRes.value.data.attempts);

          // Check if there is an in-progress attempt to resume
          const inProgress = historyRes.value.data.attempts.find(
            (a) => a.completionStatus === 'in_progress'
          );
          if (inProgress) {
            setActiveAttempt(inProgress);
            // Restore draft answers
            const restored = {};
            if (Array.isArray(inProgress.answers)) {
              inProgress.answers.forEach((ans) => {
                restored[ans.questionId] = ans.selectedOption;
              });
            }
            setAnswers(restored);
          }
        }

        setStep('intro');
      } catch (err) {
        console.error('Failed to initialize assessment:', err);
        setError('Could not load assessment catalog. Please check your network connection.');
        setStep('intro');
      }
    };

    initialize();
  }, []);

  // Auto-save draft answers to backend
  const autoSaveDraft = async (updatedAnswers, currentStepNum) => {
    if (!activeAttempt?._id) return;
    setSavingDraft(true);
    try {
      const formattedAnswers = Object.entries(updatedAnswers).map(([qId, val]) => {
        const q =
          questions.interest.find((item) => item._id === qId) ||
          questions.ability.find((item) => item._id === qId);
        return {
          questionId: qId,
          section: q?.section || 'interest',
          category: q?.category || 'General',
          selectedOption: val
        };
      });

      await studentApi.updateAptitudeAttempt(activeAttempt._id, {
        answers: formattedAnswers,
        currentStep: currentStepNum
      });
    } catch (err) {
      console.warn('Draft auto-save warning:', err.message);
    } finally {
      setSavingDraft(false);
    }
  };

  // Start fresh assessment
  const handleStartFresh = async () => {
    setStep('loading');
    try {
      const res = await studentApi.createAptitudeAttempt({ forceNew: true });
      if (res?.data?.attempt) {
        setActiveAttempt(res.data.attempt);
        setAnswers({});
        setInterestPageIndex(0);
        setAbilityPageIndex(0);
        setStep('interest');
      }
    } catch (err) {
      console.error('Failed to create attempt:', err);
      alert('Could not start assessment. Please try again.');
      setStep('intro');
    }
  };

  // Resume active in-progress assessment
  const handleResume = () => {
    if (activeAttempt) {
      setInterestPageIndex(0);
      setAbilityPageIndex(0);
      setStep('interest');
    }
  };

  // Answer selection handler
  const handleSelectAnswer = (questionId, value) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
  };

  // Submit and grade attempt
  const handleSubmitAssessment = async () => {
    setStep('submitting');
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => {
        const q =
          questions.interest.find((item) => item._id === qId) ||
          questions.ability.find((item) => item._id === qId);
        return {
          questionId: qId,
          section: q?.section || 'interest',
          category: q?.category || 'General',
          selectedOption: val
        };
      });

      const res = await studentApi.submitAptitudeAttempt(activeAttempt._id, {
        answers: formattedAnswers
      });

      if (res?.data?.attempt) {
        setActiveAttempt(res.data.attempt);
        setLatestAttempt(res.data.attempt);
        // Refresh history
        const hRes = await studentApi.getAptitudeAttempts();
        if (hRes?.data?.attempts) setAttemptsHistory(hRes.data.attempts);
        setStep('results');
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      alert('Could not submit assessment. Please try again.');
      setStep('review');
    }
  };

  // Question chunking
  const INTEREST_PER_PAGE = 4;
  const ABILITY_PER_PAGE = 3;

  const totalInterestPages = Math.ceil(questions.interest.length / INTEREST_PER_PAGE) || 1;
  const totalAbilityPages = Math.ceil(questions.ability.length / ABILITY_PER_PAGE) || 1;

  const currentInterestQuestions = questions.interest.slice(
    interestPageIndex * INTEREST_PER_PAGE,
    (interestPageIndex + 1) * INTEREST_PER_PAGE
  );

  const currentAbilityQuestions = questions.ability.slice(
    abilityPageIndex * ABILITY_PER_PAGE,
    (abilityPageIndex + 1) * ABILITY_PER_PAGE
  );

  const totalQuestionsCount = questions.interest.length + questions.ability.length;
  const answeredCount = Object.keys(answers).length;
  const overallProgressPercentage = totalQuestionsCount > 0
    ? Math.round((answeredCount / totalQuestionsCount) * 100)
    : 0;

  // Render loading state
  if (step === 'loading') {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #1d4ed8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.25rem'
          }}
        />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
          Preparing DISHA Aptitude Engine...
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
          Loading assessment question bank and personalized guidance models.
        </p>
      </div>
    );
  }

  // Render results state
  if (step === 'results' && (activeAttempt || latestAttempt)) {
    return (
      <>
        <AssessmentResultsView
          attempt={activeAttempt?.completionStatus === 'completed' ? activeAttempt : latestAttempt}
          onRetakeAssessment={handleStartFresh}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onNavigateToCourse={onNavigateToCourse}
          onNavigateToCollege={onNavigateToCollege}
        />
        <AssessmentHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          attempts={attemptsHistory}
          onSelectAttempt={(att) => {
            setActiveAttempt(att);
            setStep('results');
          }}
          onStartNewAttempt={handleStartFresh}
        />
      </>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      
      {/* =========================================================
          STEP 1: INTRODUCTION SCREEN
          ========================================================= */}
      {step === 'intro' && (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {/* Hero Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem 2rem',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-card)',
              border: '1.5px solid #e2e8f0',
              textAlign: 'center',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                backgroundColor: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)'
              }}
            >
              <Sparkles size={32} color="#1d4ed8" />
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#e2e8f0',
                color: '#1e40af',
                display: 'inline-block',
                marginBottom: '0.75rem'
              }}
            >
              Intelligent Career Guidance
            </span>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Discover Your Strengths
            </h1>

            <p style={{ color: '#475569', fontSize: '0.98rem', maxWidth: '580px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Explore your interests and cognitive reasoning abilities to discover suitable undergraduate degrees and higher education pathways.
            </p>

            {/* Assessment Scope Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                textAlign: 'left',
                marginBottom: '2rem'
              }}
            >
              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Target size={18} color="#1d4ed8" />
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                    Section 1: Career Interests
                  </strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  24 RIASEC-inspired preference questions (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
                </p>
                <span style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 700, marginTop: '0.4rem', display: 'block' }}>
                  ⏱ ~8 minutes • Likert Preference Scale
                </span>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Award size={18} color="#059669" />
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                    Section 2: Cognitive Abilities
                  </strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  12 multiple-choice questions evaluating logical, numerical, verbal, and analytical thinking.
                </p>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '0.4rem', display: 'block' }}>
                  ⏱ ~10 minutes • Scored with Explanations
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {activeAttempt && activeAttempt.completionStatus === 'in_progress' ? (
                <>
                  <button
                    onClick={handleResume}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.75rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Resume Current Assessment ({answeredCount}/{totalQuestionsCount}) <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={handleStartFresh}
                    className="btn-secondary"
                    style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}
                  >
                    Start Fresh Instead
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartFresh}
                  className="btn-primary"
                  style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Start Assessment Now <ArrowRight size={17} />
                </button>
              )}

              {latestAttempt && (
                <button
                  onClick={() => setStep('results')}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <CheckCircle2 size={16} color="#059669" /> View Latest Results
                </button>
              )}

              {attemptsHistory.length > 0 && (
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <History size={16} /> History ({attemptsHistory.length})
                </button>
              )}
            </div>
          </div>

          {/* Ethical Advisory Notice */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '14px',
              backgroundColor: '#fbfaff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <ShieldCheck size={20} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
              <strong>Educational Tool Notice:</strong> This assessment is an educational interest-exploration and reasoning exercise designed by DISHA inspired by the RIASEC framework. It is not a clinical psychological test, nor does it guarantee admission to any university. Its purpose is to guide you in discovering suitable undergraduate subjects aligned with your strengths.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 2: SECTION 1 — RIASEC INTEREST QUESTIONS
          ========================================================= */}
      {step === 'interest' && (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          
          {/* Progress Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1d4ed8' }}>
                Section 1 of 2: Career Interests (Page {interestPageIndex + 1} of {totalInterestPages})
              </span>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {savingDraft ? 'Saving draft...' : `Progress: ${overallProgressPercentage}%`}
              </span>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${overallProgressPercentage}%`,
                  height: '100%',
                  backgroundColor: '#1d4ed8',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Current Question Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {currentInterestQuestions.map((q, idx) => {
              const currentVal = answers[q._id];
              return (
                <div
                  key={q._id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-card)',
                    border: currentVal ? '1.5px solid #c4b5fd' : '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        textTransform: 'uppercase'
                      }}
                    >
                      {q.category} Dimension
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                      Question #{interestPageIndex * INTEREST_PER_PAGE + idx + 1} of {questions.interest.length}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    How would you feel about: <span style={{ color: '#1e40af' }}>"{q.questionText}"</span>?
                  </h3>

                  {/* 5 Likert Buttons */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: '0.5rem'
                    }}
                  >
                    {[
                      { val: 1, label: 'Strongly Dislike', color: '#ef4444' },
                      { val: 2, label: 'Dislike', color: '#f97316' },
                      { val: 3, label: 'Neutral', color: '#6b7280' },
                      { val: 4, label: 'Like', color: '#10b981' },
                      { val: 5, label: 'Strongly Like', color: '#1d4ed8' }
                    ].map((btn) => {
                      const isSelected = currentVal === btn.val;
                      return (
                        <button
                          key={btn.val}
                          onClick={() => handleSelectAnswer(q._id, btn.val)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: '10px',
                            border: isSelected ? `2px solid ${btn.color}` : '1px solid #e5e7eb',
                            backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                            color: isSelected ? btn.color : '#4b5563',
                            fontSize: '0.78rem',
                            fontWeight: isSelected ? 800 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '1rem', fontWeight: 800 }}>{btn.val}</span>
                          <span>{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (interestPageIndex > 0) {
                  setInterestPageIndex(interestPageIndex - 1);
                } else {
                  setStep('intro');
                }
              }}
              className="btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ArrowLeft size={15} /> Previous
            </button>

            <button
              onClick={() => {
                autoSaveDraft(answers, 2);
                if (interestPageIndex < totalInterestPages - 1) {
                  setInterestPageIndex(interestPageIndex + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  // Transition to Section 2: Ability Questions
                  setStep('ability');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="btn-primary"
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {interestPageIndex < totalInterestPages - 1 ? (
                <>Next Page <ArrowRight size={15} /></>
              ) : (
                <>Proceed to Section 2 (Ability) <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 3: SECTION 2 — OBJECTIVE ABILITY QUESTIONS
          ========================================================= */}
      {step === 'ability' && (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          
          {/* Progress Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                Section 2 of 2: Cognitive Reasoning (Page {abilityPageIndex + 1} of {totalAbilityPages})
              </span>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {savingDraft ? 'Saving draft...' : `Progress: ${overallProgressPercentage}%`}
              </span>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${overallProgressPercentage}%`,
                  height: '100%',
                  backgroundColor: '#059669',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Current Ability Question Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {currentAbilityQuestions.map((q, idx) => {
              const currentVal = answers[q._id];
              return (
                <div
                  key={q._id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-card)',
                    border: currentVal ? '1.5px solid #a7f3d0' : '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        textTransform: 'uppercase'
                      }}
                    >
                      {q.category}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                      Question #{abilityPageIndex * ABILITY_PER_PAGE + idx + 1} of {questions.ability.length}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {q.questionText}
                  </h3>

                  {/* 4 Multiple Choice Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {q.options?.map((opt, optIdx) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(q._id, opt.value)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #059669' : '1px solid #e5e7eb',
                            backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                            color: isSelected ? '#065f46' : '#374151',
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              border: isSelected ? '6px solid #059669' : '2px solid #d1d5db',
                              backgroundColor: '#ffffff',
                              flexShrink: 0
                            }}
                          />
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (abilityPageIndex > 0) {
                  setAbilityPageIndex(abilityPageIndex - 1);
                } else {
                  setStep('interest');
                  setInterestPageIndex(totalInterestPages - 1);
                }
              }}
              className="btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ArrowLeft size={15} /> Previous
            </button>

            <button
              onClick={() => {
                autoSaveDraft(answers, 3);
                if (abilityPageIndex < totalAbilityPages - 1) {
                  setAbilityPageIndex(abilityPageIndex + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  // Move to Review Step
                  setStep('review');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="btn-primary"
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {abilityPageIndex < totalAbilityPages - 1 ? (
                <>Next Page <ArrowRight size={15} /></>
              ) : (
                <>Review & Submit <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 4: REVIEW & CONFIRMATION SCREEN
          ========================================================= */}
      {step === 'review' && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-card)',
              border: '1.5px solid #e2e8f0',
              textAlign: 'center',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <CheckCircle2 size={28} color="#059669" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              Assessment Completed!
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              You have answered {answeredCount} of {totalQuestionsCount} questions. Review your submission status before calculating your career profile.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                textAlign: 'left',
                marginBottom: '2rem'
              }}
            >
              <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', display: 'block', marginBottom: '0.2rem' }}>
                  SECTION 1: CAREER INTERESTS
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                  {questions.interest.filter((q) => answers[q._id]).length} / {questions.interest.length} Answered
                </strong>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', display: 'block', marginBottom: '0.2rem' }}>
                  SECTION 2: COGNITIVE ABILITY
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                  {questions.ability.filter((q) => answers[q._id]).length} / {questions.ability.length} Answered
                </strong>
              </div>
            </div>

            {answeredCount < totalQuestionsCount && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  fontSize: '0.82rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}
              >
                ⚠️ You have {totalQuestionsCount - answeredCount} unanswered questions. Answering all questions provides the most accurate RIASEC profile and course matches.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStep('ability')}
                className="btn-secondary"
                style={{ padding: '0.7rem 1.4rem', fontSize: '0.88rem' }}
              >
                Review Answers
              </button>

              <button
                onClick={handleSubmitAssessment}
                className="btn-primary"
                style={{ padding: '0.7rem 2rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Submit & Calculate Results <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SUBMITTING LOADING STATE
          ========================================================= */}
      {step === 'submitting' && (
        <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #1d4ed8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.25rem'
            }}
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Calculating Your Career Aptitude Profile...
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '460px', margin: '0 auto' }}>
            Grading reasoning responses, normalizing RIASEC interest dimensions, querying MongoDB educational catalog, and generating Gemini AI guidance.
          </p>
        </div>
      )}

      {/* History Modal */}
      <AssessmentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        attempts={attemptsHistory}
        onSelectAttempt={(att) => {
          setActiveAttempt(att);
          setStep('results');
        }}
        onStartNewAttempt={handleStartFresh}
      />
    </div>
  );
};

export default AptitudeAssessment;

