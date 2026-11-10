import React from 'react';
import { X, Calendar, Award, CheckCircle2, RotateCcw, Clock, ArrowRight } from 'lucide-react';

const AssessmentHistoryModal = ({
  isOpen,
  onClose,
  attempts = [],
  onSelectAttempt = () => {},
  onStartNewAttempt = () => {}
}) => {
  if (!isOpen) return null;

  const formatDate = (dateInput) => {
    if (!dateInput) return 'Incomplete';
    return new Date(dateInput).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          maxWidth: '680px',
          maxHeight: '85vh',
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
            padding: '1.25rem 1.75rem',
            borderBottom: '1.5px solid #f1f0f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
              Assessment History
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#475569' }}>
              Review previous attempts and track the evolution of your career interests.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Attempts List */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {attempts.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6b7280' }}>
              <Clock size={36} color="#9ca3af" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No assessment attempts recorded yet.</p>
            </div>
          ) : (
            attempts.map((att, idx) => {
              const isCompleted = att.completionStatus === 'completed';
              return (
                <div
                  key={att._id}
                  onClick={() => {
                    onSelectAttempt(att);
                    onClose();
                  }}
                  className="glass-panel-hover"
                  style={{
                    padding: '1.15rem',
                    borderRadius: '12px',
                    backgroundColor: '#fafafa',
                    border: '1.5px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: isCompleted ? '#ecfdf5' : '#fffbeb',
                          color: isCompleted ? '#059669' : '#d97706'
                        }}
                      >
                        {isCompleted ? '✓ Completed' : '⏳ In Progress'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                        Attempt #{attempts.length - idx} • {formatDate(att.completedAt || att.createdAt)}
                      </span>
                    </div>

                    {isCompleted && (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {att.riasecCode && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>
                            Code: {att.riasecCode}
                          </span>
                        )}
                        {att.topInterests?.length > 0 && (
                          <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                            ({att.topInterests.join(', ')})
                          </span>
                        )}
                        {att.abilityScores?.overallPercentage !== undefined && (
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                            • Reasoning: {att.abilityScores.overallPercentage}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1d4ed8', fontWeight: 700, fontSize: '0.82rem' }}>
                    View Results <ArrowRight size={14} />
                  </div>
                </div>
              );
            })
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
            alignItems: 'center'
          }}
        >
          <button
            onClick={() => {
              onStartNewAttempt();
              onClose();
            }}
            className="btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCcw size={14} /> Start Fresh Assessment
          </button>

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
  );
};

export default AssessmentHistoryModal;

