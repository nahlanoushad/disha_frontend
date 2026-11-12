import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  Edit2,
  Trash2,
  Eye,
  Send,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Check,
  X,
  Layers,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Tag
} from 'lucide-react';
import api from '../services/api.js';

const SECTIONS = [
  { id: 'academic_background', label: 'Academic Stream / Background' },
  { id: 'subject_interests', label: 'Subject Affinity' },
  { id: 'career_interests', label: 'Practical & Career Interests' },
  { id: 'strengths', label: 'Core Strengths & Confidence' },
  { id: 'work_preferences', label: 'Work Style & Environment' },
  { id: 'study_preferences', label: 'Program Duration & Study Preferences' }
];

const PREDEFINED_TAGS = [
  'technology', 'software', 'coding', 'computer_science', 'bca', 'btech', 'bsc',
  'pharmacy', 'bpharm', 'healthcare', 'medicine', 'biology', 'chemistry', 'science',
  'management', 'business', 'bba', 'leadership', 'entrepreneurship', 'corporate',
  'finance', 'accounting', 'analytics', 'economics', 'commerce',
  'maths', 'maths_high', 'maths_moderate', 'maths_low', 'pcm', 'pcb',
  'duration_3_years', 'duration_4_years', 'flexible_duration',
  'practical', 'laboratory', 'interactive', 'creative', 'design'
];

const CareerAssessmentQuestionsTab = () => {
  const [questions, setQuestions] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, published: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Edit / Create Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    section: 'academic_background',
    category: 'Academic Stream',
    answerType: 'single_choice',
    status: 'draft',
    order: 1,
    difficulty: 'medium',
    options: [
      { text: '', value: '1', tags: [] },
      { text: '', value: '2', tags: [] }
    ]
  });
  const [tagInput, setTagInput] = useState({});
  const [saving, setSaving] = useState(false);

  // Preview Modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewStep, setPreviewStep] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState({});

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.getCareerQuestions({
        status: statusFilter,
        search: searchQuery
      });
      if (res?.data) {
        setQuestions(res.data.questions || []);
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
      showFeedback('error', err.message || 'Failed to load assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      questionText: '',
      section: 'academic_background',
      category: 'Academic Stream',
      answerType: 'single_choice',
      status: 'draft',
      order: (questions.length + 1) || 1,
      difficulty: 'medium',
      options: [
        { text: '', value: 'opt_1', tags: [] },
        { text: '', value: 'opt_2', tags: [] }
      ]
    });
    setTagInput({});
    setModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      questionText: q.questionText || '',
      section: q.section || 'academic_background',
      category: q.category || 'General',
      answerType: q.answerType || 'single_choice',
      status: q.status || 'draft',
      order: q.order || 1,
      difficulty: q.difficulty || 'medium',
      options: Array.isArray(q.options) && q.options.length > 0
        ? q.options.map((o, idx) => ({
            text: o.text || '',
            value: o.value || String(idx + 1),
            tags: o.tags || []
          }))
        : [
            { text: '', value: 'opt_1', tags: [] },
            { text: '', value: 'opt_2', tags: [] }
          ]
    });
    setTagInput({});
    setModalOpen(true);
  };

  const handleOptionChange = (idx, field, val) => {
    const updated = [...formData.options];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { text: '', value: `opt_${prev.options.length + 1}`, tags: [] }
      ]
    }));
  };

  const handleRemoveOption = (idx) => {
    if (formData.options.length <= 2) {
      alert('A question must have at least 2 options.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx)
    }));
  };

  const handleAddTagToOption = (optIdx, tagToAdd) => {
    const tag = String(tagToAdd || '').trim().toLowerCase();
    if (!tag) return;
    const currentTags = formData.options[optIdx]?.tags || [];
    if (!currentTags.includes(tag)) {
      const updated = [...formData.options];
      updated[optIdx] = {
        ...updated[optIdx],
        tags: [...currentTags, tag]
      };
      setFormData((prev) => ({ ...prev, options: updated }));
    }
    setTagInput((prev) => ({ ...prev, [optIdx]: '' }));
  };

  const handleRemoveTagFromOption = (optIdx, tagToRemove) => {
    const updated = [...formData.options];
    updated[optIdx] = {
      ...updated[optIdx],
      tags: (updated[optIdx].tags || []).filter((t) => t !== tagToRemove)
    };
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!formData.questionText.trim()) {
      alert('Question text is required.');
      return;
    }

    for (let i = 0; i < formData.options.length; i++) {
      if (!formData.options[i].text.trim()) {
        alert(`Option ${i + 1} text cannot be empty.`);
        return;
      }
    }

    setSaving(true);
    try {
      if (editingQuestion?._id) {
        await api.updateCareerQuestion(editingQuestion._id, formData);
        showFeedback('success', 'Question updated successfully.');
      } else {
        await api.createCareerQuestion(formData);
        showFeedback('success', 'New question created successfully.');
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to save question:', err);
      showFeedback('error', err.message || 'Could not save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (questionId, newStatus) => {
    try {
      await api.updateCareerQuestionStatus(questionId, newStatus);
      showFeedback('success', `Question status updated to ${newStatus}.`);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to update status:', err);
      showFeedback('error', err.message || 'Could not update status.');
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }
    try {
      await api.deleteCareerQuestion(questionId);
      showFeedback('success', 'Question removed successfully.');
      fetchQuestions();
    } catch (err) {
      console.error('Failed to delete question:', err);
      showFeedback('error', err.message || 'Could not delete question.');
    }
  };

  const handlePublishAll = async () => {
    if (!window.confirm('Publish all current draft questions? They will immediately become live in the student career assessment.')) {
      return;
    }
    try {
      const res = await api.publishCareerQuestions();
      showFeedback('success', res.message || 'Draft questions published successfully.');
      fetchQuestions();
    } catch (err) {
      console.error('Failed to publish questions:', err);
      showFeedback('error', err.message || 'Failed to publish questions.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        paddingBottom: '0.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1035' }}>
              Career Assessment Questions
            </h2>
            <span className="badge badge-violet" style={{ fontSize: '0.72rem' }}>
              Undergraduate Discovery v2.0
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>
            Manage the Plus Two course-discovery questions, recommendation tags, and publication state.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => {
              setPreviewStep(0);
              setPreviewAnswers({});
              setPreviewOpen(true);
            }}
            className="btn-outline"
            style={{
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem'
            }}
          >
            <Eye size={15} />
            Preview as Student
          </button>

          <button
            onClick={handlePublishAll}
            className="btn-outline"
            style={{
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              borderColor: '#059669',
              color: '#059669'
            }}
          >
            <Send size={15} />
            Publish All Drafts
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="btn-primary"
            style={{
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.15rem'
            }}
          >
            <Plus size={16} />
            Add New Question
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.15rem 1.35rem', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #ede9fe' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c6f93', textTransform: 'uppercase' }}>Total Questions</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1035', marginTop: '0.35rem' }}>{metrics.total}</h3>
          <span style={{ fontSize: '0.72rem', color: '#6d28d9' }}>Career Discovery Catalog</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.15rem 1.35rem', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #d1fae5' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase' }}>Published & Live</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>{metrics.published}</h3>
          <span style={{ fontSize: '0.72rem', color: '#059669' }}>Active in Student Portal</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.15rem 1.35rem', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #fef3c7' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#d97706', textTransform: 'uppercase' }}>Draft Questions</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginTop: '0.35rem' }}>{metrics.draft}</h3>
          <span style={{ fontSize: '0.72rem', color: '#b45309' }}>Hidden from Students</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.15rem 1.35rem', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Archived</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#64748b', marginTop: '0.35rem' }}>{metrics.archived}</h3>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Inactive</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.75rem 1.15rem',
          borderRadius: '10px',
          backgroundColor: feedback.type === 'success' ? '#ecfdf5' : '#fff1f2',
          border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecdd3'}`,
          color: feedback.type === 'success' ? '#059669' : '#e11d48',
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{
        padding: '0.9rem 1.25rem',
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #ede9fe',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7c6f93' }}>Status:</span>
          {['all', 'published', 'draft', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                fontSize: '0.76rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: statusFilter === st ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                backgroundColor: statusFilter === st ? '#f5f3ff' : '#ffffff',
                color: statusFilter === st ? '#7c3aed' : '#64748b',
                fontWeight: statusFilter === st ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#7c6f93" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search question text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.35rem 0.85rem 0.35rem 2.1rem',
                fontSize: '0.8rem',
                width: '220px',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            className="btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              fetchQuestions();
            }}
            title="Reset Filters"
            className="btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem' }}
          >
            <RefreshCw size={13} className={loading ? 'spinner' : ''} />
          </button>
        </form>
      </div>

      {/* Questions Table */}
      <div className="glass-panel" style={{
        padding: '0',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #ede9fe',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#7c6f93' }}>
            <RefreshCw size={24} className="spinner" style={{ margin: '0 auto 0.75rem auto', color: '#7c3aed' }} />
            <p style={{ fontSize: '0.88rem' }}>Loading Career Discovery questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <HelpCircle size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
              No Career Discovery Questions Found
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#7c6f93', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
              {statusFilter !== 'all'
                ? `No questions match the "${statusFilter}" filter. Try switching back to all.`
                : 'Get started by creating your first question or publishing the initial question set.'}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.55rem 1.15rem' }}
            >
              <Plus size={15} /> Create Question
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #ede9fe',
                color: '#64748b',
                fontWeight: 700,
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <th style={{ padding: '0.85rem 1rem', width: '55px' }}>#</th>
                <th style={{ padding: '0.85rem 1rem' }}>Question & Section</th>
                <th style={{ padding: '0.85rem 1rem', width: '130px' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem', width: '220px' }}>Options & Recommendation Tags</th>
                <th style={{ padding: '0.85rem 1rem', width: '110px' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', width: '135px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr
                  key={q._id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background 0.15s'
                  }}
                >
                  {/* Order */}
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#7c3aed' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '26px',
                      height: '26px',
                      lineHeight: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#f5f3ff',
                      textAlign: 'center',
                      fontSize: '0.76rem'
                    }}>
                      {q.order || idx + 1}
                    </span>
                  </td>

                  {/* Question Text & Section */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem', lineHeight: 1.4 }}>
                      {q.questionText}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-violet" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        {q.category || q.section}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Section: <code>{q.section}</code>
                      </span>
                    </div>
                  </td>

                  {/* Answer Type */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: q.answerType === 'multiple_choice' ? '#f0fdf4' : '#eff6ff',
                      color: q.answerType === 'multiple_choice' ? '#15803d' : '#1d4ed8',
                      border: `1px solid ${q.answerType === 'multiple_choice' ? '#bbf7d0' : '#bfdbfe'}`
                    }}>
                      {q.answerType === 'multiple_choice' ? 'Multiple Choice' : 'Single Select'}
                    </span>
                  </td>

                  {/* Options & Tags Preview */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#334155' }}>
                        {q.options?.length || 0} Options Configured
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '240px' }}>
                        {Array.from(new Set((q.options || []).flatMap((o) => o.tags || []))).slice(0, 4).map((t, tidx) => (
                          <span
                            key={tidx}
                            style={{
                              fontSize: '0.64rem',
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            #{t}
                          </span>
                        ))}
                        {new Set((q.options || []).flatMap((o) => o.tags || [])).size > 4 && (
                          <span style={{ fontSize: '0.64rem', color: '#94a3b8', alignSelf: 'center' }}>
                            +{new Set((q.options || []).flatMap((o) => o.tags || [])).size - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor:
                          q.status === 'published' ? '#ecfdf5' : q.status === 'draft' ? '#fef3c7' : '#f1f5f9',
                        color:
                          q.status === 'published' ? '#059669' : q.status === 'draft' ? '#b45309' : '#64748b',
                        border: `1px solid ${
                          q.status === 'published' ? '#a7f3d0' : q.status === 'draft' ? '#fde68a' : '#e2e8f0'
                        }`
                      }}
                    >
                      {q.status === 'published' ? 'Published' : q.status === 'draft' ? 'Draft' : 'Archived'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      {/* Status quick toggle */}
                      {q.status === 'published' ? (
                        <button
                          onClick={() => handleStatusToggle(q._id, 'draft')}
                          title="Move to Draft (unpublish)"
                          style={{
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#d97706',
                            padding: '0.35rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Clock size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusToggle(q._id, 'published')}
                          title="Publish question"
                          style={{
                            border: '1px solid #a7f3d0',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            padding: '0.35rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Check size={13} />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        title="Edit question & tags"
                        style={{
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          padding: '0.35rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(q._id)}
                        title="Delete question"
                        style={{
                          border: '1px solid #fecdd3',
                          backgroundColor: '#fff1f2',
                          color: '#e11d48',
                          padding: '0.35rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #ede9fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fbfbfe'
            }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e1035' }}>
                  {editingQuestion ? 'Edit Career Assessment Question' : 'Create New Assessment Question'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#7c6f93' }}>
                  Configured questions and recommendation tags drive DISHA's course match engine.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Question Text */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
                    Question Prompt / Text <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.questionText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, questionText: e.target.value }))}
                    placeholder="e.g. Which Plus Two subjects did you enjoy studying the most?"
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Section & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
                      Assessment Section
                    </label>
                    <select
                      value={formData.section}
                      onChange={(e) => {
                        const sec = e.target.value;
                        const match = SECTIONS.find((s) => s.id === sec);
                        setFormData((prev) => ({
                          ...prev,
                          section: sec,
                          category: match ? match.label : prev.category
                        }));
                      }}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {SECTIONS.map((sec) => (
                        <option key={sec.id} value={sec.id}>{sec.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
                      Answer Selection Type
                    </label>
                    <select
                      value={formData.answerType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, answerType: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="single_choice">Single Choice (Radio)</option>
                      <option value="multiple_choice">Multiple Choice (Checkboxes)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="draft">Draft (Hidden)</option>
                      <option value="published">Published (Live for Students)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Display Order */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '120px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
                      Sequence Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) || 1 }))}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
                      Category Tag / Header
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                </div>

                {/* Options Builder with Recommendation Tags */}
                <div style={{ borderTop: '1px solid #ede9fe', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e1035' }}>
                        Answer Options & Recommendation Tags
                      </h4>
                      <p style={{ fontSize: '0.74rem', color: '#7c6f93' }}>
                        Assign recommendation tags (e.g. <code>#technology</code>, <code>#btech</code>, <code>#pcm</code>, <code>#pharmacy</code>, <code>#bba</code>) to guide candidate matching.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="btn-outline"
                      style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Plus size={13} /> Add Option
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {formData.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        style={{
                          padding: '1rem',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            lineHeight: '24px',
                            textAlign: 'center',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#475569'
                          }}>
                            {optIdx + 1}
                          </span>
                          <input
                            type="text"
                            placeholder={`Option ${optIdx + 1} text (e.g. Computer Science & Software Coding)`}
                            value={opt.text}
                            onChange={(e) => handleOptionChange(optIdx, 'text', e.target.value)}
                            required
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.84rem'
                            }}
                          />
                          {formData.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(optIdx)}
                              title="Delete option"
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#e11d48',
                                cursor: 'pointer',
                                padding: '0.4rem'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* Tags Pill Container */}
                        <div style={{ paddingLeft: '2rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                            {(opt.tags || []).map((t, tidx) => (
                              <span
                                key={tidx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  backgroundColor: '#ede9fe',
                                  color: '#6d28d9',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '9999px',
                                  border: '1px solid #ddd6fe'
                                }}
                              >
                                #{t}
                                <X
                                  size={11}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleRemoveTagFromOption(optIdx, t)}
                                />
                              </span>
                            ))}

                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <input
                                type="text"
                                placeholder="+ Add tag..."
                                value={tagInput[optIdx] || ''}
                                onChange={(e) => setTagInput((prev) => ({ ...prev, [optIdx]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTagToOption(optIdx, tagInput[optIdx]);
                                  }
                                }}
                                style={{
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '9999px',
                                  border: '1px dashed #cbd5e1',
                                  fontSize: '0.72rem',
                                  width: '100px',
                                  backgroundColor: '#ffffff'
                                }}
                              />
                              {tagInput[optIdx] && (
                                <button
                                  type="button"
                                  onClick={() => handleAddTagToOption(optIdx, tagInput[optIdx])}
                                  style={{
                                    border: 'none',
                                    backgroundColor: '#7c3aed',
                                    color: '#ffffff',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Plus size={11} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Quick Suggest Tags */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.66rem', color: '#94a3b8', alignSelf: 'center', marginRight: '0.2rem' }}>
                              Quick tags:
                            </span>
                            {PREDEFINED_TAGS.slice(0, 10).map((pt) => {
                              const already = (opt.tags || []).includes(pt);
                              if (already) return null;
                              return (
                                <button
                                  key={pt}
                                  type="button"
                                  onClick={() => handleAddTagToOption(optIdx, pt)}
                                  style={{
                                    fontSize: '0.62rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    backgroundColor: '#ffffff',
                                    color: '#64748b',
                                    padding: '0.05rem 0.35rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  +{pt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '1rem 1.75rem',
                borderTop: '1px solid #ede9fe',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                backgroundColor: '#fbfbfe'
              }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-outline"
                  style={{ fontSize: '0.82rem', padding: '0.55rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '0.55rem 1.45rem' }}
                >
                  {saving ? 'Saving...' : editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT PREVIEW MODAL */}
      {previewOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '720px',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Banner */}
            <div style={{
              padding: '0.9rem 1.5rem',
              backgroundColor: '#1e1035',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600 }}>
                <Eye size={15} color="#a78bfa" />
                Live Student Experience Simulator (Draft + Published)
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulated Question Card */}
            {questions.length === 0 ? (
              <div style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                <p>No questions to preview.</p>
              </div>
            ) : (
              <div style={{ padding: '2rem' }}>
                {(() => {
                  const currentQ = questions[previewStep] || questions[0];
                  const qId = currentQ._id;
                  const currentAns = previewAnswers[qId];

                  return (
                    <div>
                      {/* Step Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                          Question {previewStep + 1} of {questions.length} • {currentQ.category || currentQ.section}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          {currentQ.answerType === 'multiple_choice' ? 'Select all that apply' : 'Select one'}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                        {currentQ.questionText}
                      </h3>

                      {/* Options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                        {(currentQ.options || []).map((opt, oidx) => {
                          const isSelected = currentQ.answerType === 'multiple_choice'
                            ? Array.isArray(currentAns) && currentAns.includes(opt.value)
                            : currentAns === opt.value;

                          return (
                            <button
                              key={oidx}
                              type="button"
                              onClick={() => {
                                if (currentQ.answerType === 'multiple_choice') {
                                  const prevList = Array.isArray(currentAns) ? currentAns : [];
                                  const updated = prevList.includes(opt.value)
                                    ? prevList.filter((v) => v !== opt.value)
                                    : [...prevList, opt.value];
                                  setPreviewAnswers((prev) => ({ ...prev, [qId]: updated }));
                                } else {
                                  setPreviewAnswers((prev) => ({ ...prev, [qId]: opt.value }));
                                }
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #7c3aed' : '1.5px solid #e2e8f0',
                                backgroundColor: isSelected ? '#f5f3ff' : '#ffffff',
                                color: isSelected ? '#4c1d95' : '#1e293b',
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s'
                              }}
                            >
                              <span>{opt.text}</span>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: currentQ.answerType === 'multiple_choice' ? '4px' : '50%',
                                border: isSelected ? '2px solid #7c3aed' : '2px solid #cbd5e1',
                                backgroundColor: isSelected ? '#7c3aed' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff'
                              }}>
                                {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewStep((prev) => Math.max(0, prev - 1))}
                          disabled={previewStep === 0}
                          className="btn-outline"
                          style={{
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.55rem 1rem',
                            opacity: previewStep === 0 ? 0.4 : 1
                          }}
                        >
                          <ArrowLeft size={15} /> Previous
                        </button>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {questions.map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              onClick={() => setPreviewStep(dotIdx)}
                              style={{
                                width: dotIdx === previewStep ? '18px' : '7px',
                                height: '7px',
                                borderRadius: '4px',
                                backgroundColor: dotIdx === previewStep ? '#7c3aed' : '#e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (previewStep < questions.length - 1) {
                              setPreviewStep((prev) => prev + 1);
                            } else {
                              alert('Preview complete! All answers captured in simulation.');
                              setPreviewOpen(false);
                            }
                          }}
                          className="btn-primary"
                          style={{
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.55rem 1.15rem'
                          }}
                        >
                          {previewStep === questions.length - 1 ? 'Finish Simulation' : 'Next'} <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerAssessmentQuestionsTab;

