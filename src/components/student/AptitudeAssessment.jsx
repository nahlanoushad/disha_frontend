import React, { useState, useEffect } from 'react';
import {
  Sparkles,
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
  Target,
  Compass,
  GraduationCap,
  Layers,
  RefreshCw
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';
import AssessmentResultsView from './AssessmentResultsView.jsx';
import AssessmentHistoryModal from './AssessmentHistoryModal.jsx';

const AptitudeAssessment = ({
  onNavigateToCourse = () => {},
  onNavigateToCollege = () => {},
  onComplete = () => {},
  initialView = 'assessment'
}) => {
  // Workflow step: 'loading' | 'intro' | 'question' | 'review' | 'submitting' | 'results' | 'empty'
  const [step, setStep] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [activeAttempt, setActiveAttempt] = useState(null);
  const [latestAttempt, setLatestAttempt] = useState(null);
  const [attemptsHistory, setAttemptsHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Student answers mapping: { [questionId]: value (string or array) }
  const [answers, setAnswers] = useState({});
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState(null);

  // 1. Initial Load: Questions, In-Progress Attempt, and Latest Attempt
  const initialize = async () => {
    setStep('loading');
    setError(null);
    try {
      const [qRes, latestRes, historyRes] = await Promise.allSettled([
        studentApi.getAptitudeQuestions(),
        studentApi.getLatestAptitudeAttempt(),
        studentApi.getAptitudeAttempts()
      ]);

      let loadedQuestions = [];
      let isAvailable = true;

      if (qRes.status === 'fulfilled' && qRes.value) {
        if (qRes.value.isAvailable === false || !qRes.value.data?.questions || qRes.value.data.questions.length === 0) {
          isAvailable = false;
        } else {
          loadedQuestions = qRes.value.data.questions;
        }
      }

      setQuestions(loadedQuestions);

      let foundLatest = null;
      if (latestRes.status === 'fulfilled' && latestRes.value?.data?.attempt) {
        foundLatest = latestRes.value.data.attempt;
        setLatestAttempt(foundLatest);
      }

      let inProgressAttempt = null;
      if (historyRes.status === 'fulfilled' && historyRes.value?.data?.attempts) {
        setAttemptsHistory(historyRes.value.data.attempts);
        inProgressAttempt = historyRes.value.data.attempts.find(
          (a) => a.completionStatus === 'in_progress' && (a.assessmentType === 'career_discovery' || a.assessmentVersion === 'v2.0')
        );
      }

      if (!isAvailable || loadedQuestions.length === 0) {
        setStep('empty');
        return;
      }

      if (inProgressAttempt) {
        setActiveAttempt(inProgressAttempt);
        const restored = {};
        if (Array.isArray(inProgressAttempt.answers)) {
          inProgressAttempt.answers.forEach((ans) => {
            if (Array.isArray(ans.selectedOptions) && ans.selectedOptions.length > 0) {
              restored[ans.questionId] = ans.selectedOptions;
            } else if (ans.selectedOption !== undefined && ans.selectedOption !== null) {
              restored[ans.questionId] = ans.selectedOption;
            }
          });
        }
        setAnswers(restored);
      }

      // Check if direct question step requested via query param or prop
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('step') === 'question' || initialView === 'question') {
        setStep('question');
      } else if (initialView === 'results' && foundLatest) {
        setStep('results');
      } else {
        setStep('intro');
      }
    } catch (err) {
      console.error('Failed to initialize career assessment:', err);
      setError('Could not load assessment catalog. Please check your network connection.');
      setStep('intro');
    }
  };

  useEffect(() => {
    initialize();
  }, [initialView]);

  // Auto-save draft answers to backend
  const autoSaveDraft = async (updatedAnswers, currentStepNum) => {
    if (!activeAttempt?._id) return;
    setSavingDraft(true);
    try {
      const formattedAnswers = Object.entries(updatedAnswers).map(([qId, val]) => {
        const q = questions.find((item) => String(item._id) === String(qId));
        return {
          questionId: qId,
          questionText: q?.questionText || '',
          section: q?.section || 'general',
          category: q?.category || 'General',
          selectedOption: Array.isArray(val) ? val[0] : val,
          selectedOptions: Array.isArray(val) ? val : [val]
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
        setCurrentQuestionIndex(0);
        setStep('question');
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
      // Find first unanswered question or resume from step
      const firstUnanswered = questions.findIndex((q) => answers[q._id] === undefined);
      setCurrentQuestionIndex(firstUnanswered !== -1 ? firstUnanswered : 0);
      setStep('question');
    } else {
      handleStartFresh();
    }
  };

  // Handle option select
  const handleSelectOption = (question, optionValue) => {
    const qId = question._id;
    let updated;

    if (question.answerType === 'multiple_choice') {
      const prevSelected = Array.isArray(answers[qId]) ? answers[qId] : [];
      const isAlready = prevSelected.includes(optionValue);
      const nextList = isAlready
        ? prevSelected.filter((v) => v !== optionValue)
        : [...prevSelected, optionValue];
      updated = { ...answers, [qId]: nextList };
    } else {
      updated = { ...answers, [qId]: optionValue };
    }

    setAnswers(updated);
    autoSaveDraft(updated, currentQuestionIndex + 1);
  };

  // Navigation: Next
  const handleNext = () => {
    const currentQ = questions[currentQuestionIndex];
    const currentAns = answers[currentQ._id];

    if (!currentAns || (Array.isArray(currentAns) && currentAns.length === 0)) {
      alert('Please select an option to continue.');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep('review');
    }
  };

  // Navigation: Previous
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep('intro');
    }
  };

  // Final Submission
  const handleSubmitAssessment = async () => {
    if (!activeAttempt?._id) return;

    setStep('submitting');
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => {
        const q = questions.find((item) => String(item._id) === String(qId));
        return {
          questionId: qId,
          questionText: q?.questionText || '',
          section: q?.section || 'general',
          category: q?.category || 'General',
          selectedOption: Array.isArray(val) ? val[0] : val,
          selectedOptions: Array.isArray(val) ? val : [val]
        };
      });

      const res = await studentApi.submitAptitudeAttempt(activeAttempt._id, {
        answers: formattedAnswers
      });

      if (res?.data?.attempt) {
        setLatestAttempt(res.data.attempt);
        setActiveAttempt(null);
        setStep('results');
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      alert(err.message || 'Submission encountered an error. Please try again.');
      setStep('review');
    }
  };

  // VIEW: LOADING
  if (step === 'loading') {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={28} className="spinner" style={{ margin: '0 auto 1rem', color: '#1d4ed8' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Loading Career Discovery Assessment...</h3>
        <p style={{ fontSize: '0.84rem', marginTop: '0.35rem' }}>Preparing question set and matching rules.</p>
      </div>
    );
  }

  // VIEW: EMPTY CATALOG (No published questions)
  if (step === 'empty') {
    return (
      <div className="glass-panel" style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '620px',
        margin: '2rem auto',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          color: '#1d4ed8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Clock size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          Career Assessment Being Prepared
        </h3>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.75rem' }}>
          Career assessment is currently being prepared. Please check back soon.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <button
            onClick={initialize}
            className="btn-outline"
            style={{ fontSize: '0.82rem', padding: '0.55rem 1.15rem' }}
          >
            Check Again
          </button>
          <button
            onClick={() => onNavigateToCourse({})}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.55rem 1.25rem' }}
          >
            Explore Courses Catalog
          </button>
        </div>
      </div>
    );
  }

  // VIEW: RESULTS
  if (step === 'results' && latestAttempt) {
    return (
      <>
        <AssessmentResultsView
          attempt={latestAttempt}
          onRetakeAssessment={handleStartFresh}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onNavigateToCourse={onNavigateToCourse}
          onNavigateToCollege={onNavigateToCollege}
        />
        <AssessmentHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          attempts={attemptsHistory}
          onSelectAttempt={(selected) => setLatestAttempt(selected)}
          onStartNewAttempt={handleStartFresh}
        />
      </>
    );
  }

  // VIEW: SUBMITTING SPINNER
  if (step === 'submitting') {
    return (
      <div className="glass-panel" style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '560px',
        margin: '3rem auto'
      }}>
        <Sparkles size={36} className="spinner" style={{ margin: '0 auto 1.25rem', color: '#1d4ed8' }} />
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          Analyzing Your Higher Education Fit...
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
          Evaluating your Plus Two subjects, preferred degree duration, and career interests against verified undergraduate programs and universities.
        </p>
      </div>
    );
  }

  // VIEW: INTRO SCREEN
  if (step === 'intro') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Hero Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.25rem 0.8rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#38bdf8',
                marginBottom: '1rem'
              }}
            >
              <Compass size={14} /> Higher Education Assessment
            </span>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '0.85rem' }}>
              Find the Right Undergraduate Course for Your Future
            </h1>

            <p style={{ fontSize: '0.96rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Designed specifically for Plus Two students. Answer 10 straightforward questions about what you studied, which subjects you enjoyed, and the kind of work you like to receive personalized undergraduate recommendations.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              {activeAttempt ? (
                <button
                  onClick={handleResume}
                  className="btn-primary"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    padding: '0.75rem 1.65rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 20px -4px rgba(29, 78, 216, 0.4)'
                  }}
                >
                  Resume In-Progress Assessment <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleStartFresh}
                  className="btn-primary"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    padding: '0.75rem 1.65rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 20px -4px rgba(29, 78, 216, 0.4)'
                  }}
                >
                  Start Career Discovery <ArrowRight size={16} />
                </button>
              )}

              {latestAttempt && (
                <button
                  onClick={() => setStep('results')}
                  className="btn-outline"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    padding: '0.75rem 1.35rem',
                    borderRadius: '12px',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }}
                >
                  View Latest Recommendations
                </button>
              )}

              {attemptsHistory.length > 0 && (
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.84rem',
                    color: '#94a3b8',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem'
                  }}
                >
                  <History size={15} /> Previous Attempts ({attemptsHistory.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <GraduationCap size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Plus Two Continuity
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Recommendations respect your higher secondary stream (Science PCM/PCB, Commerce, Humanities) and your favorite subjects.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BookOpen size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Real Degree Catalog
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Matched directly to real programs like BCA, B.Tech CSE, B.Pharm, and BBA with verified eligibility and career paths.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              DISHA AI Insights
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Receive personalized explanations of why each program suits you and clear preparatory steps before university.
            </p>
          </div>
        </div>

        <AssessmentHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          attempts={attemptsHistory}
          onSelectAttempt={(selected) => {
            setLatestAttempt(selected);
            setStep('results');
          }}
          onStartNewAttempt={handleStartFresh}
        />
      </div>
    );
  }

  // VIEW: QUESTION WORKFLOW
  const currentQ = questions[currentQuestionIndex];
  const qId = currentQ?._id;
  const currentSelection = answers[qId];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.74rem' }}>
              {currentQ.category || currentQ.section}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <span style={{ fontSize: '0.76rem', color: savingDraft ? '#d97706' : '#15803d', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {savingDraft ? <RefreshCw size={12} className="spinner" /> : <CheckCircle2 size={13} />}
            {savingDraft ? 'Saving draft...' : 'Progress saved'}
          </span>
        </div>

        {/* Progress Track */}
        <div style={{ width: '100%', height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#1d4ed8',
              borderRadius: '4px',
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2.25rem',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {currentQ.answerType === 'multiple_choice' ? 'Multiple Selection (Choose all that apply)' : 'Single Selection'}
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, marginTop: '0.35rem' }}>
            {currentQ.questionText}
          </h2>
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(currentQ.options || []).map((opt, oidx) => {
            const isSelected = currentQ.answerType === 'multiple_choice'
              ? Array.isArray(currentSelection) && currentSelection.includes(opt.value)
              : currentSelection === opt.value;

            return (
              <button
                key={oidx}
                type="button"
                onClick={() => handleSelectOption(currentQ, opt.value)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1.1rem 1.35rem',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #1d4ed8' : '1.5px solid #e2e8f0',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  color: isSelected ? '#1e3a8a' : '#1e293b',
                  fontSize: '0.92rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.15s'
                }}
              >
                <span>{opt.text}</span>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: currentQ.answerType === 'multiple_choice' ? '5px' : '50%',
                  border: isSelected ? '2px solid #1d4ed8' : '2px solid #cbd5e1',
                  backgroundColor: isSelected ? '#1d4ed8' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.25rem',
          marginTop: '0.5rem'
        }}>
          <button
            onClick={handlePrevious}
            className="btn-outline"
            style={{
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.25rem'
            }}
          >
            <ArrowLeft size={16} /> Previous
          </button>

          <button
            onClick={handleNext}
            className="btn-primary"
            style={{
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.45rem'
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Review & Submit' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* REVIEW STEP MODAL / VIEW */}
      {step === 'review' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setStep('question')}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <CheckCircle2 size={30} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Ready to Discover Your Degrees?
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                You have answered all {questions.length} questions. Submitting will analyze your subject strengths and match real undergraduate degree programs.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setStep('question')}
                className="btn-outline"
                style={{ flex: 1, fontSize: '0.85rem', padding: '0.7rem' }}
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmitAssessment}
                className="btn-primary"
                style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700, padding: '0.7rem' }}
              >
                Generate Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AptitudeAssessment;
