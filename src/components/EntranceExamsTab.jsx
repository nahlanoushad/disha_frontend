import React, { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Search, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import useEntranceExams from '../hooks/useEntranceExams.js';

const EntranceExamsTab = () => {
  const {
    entranceExams,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    search, setSearch,
    status, setStatus,
    page, setPage,
    limit,
    pagination,
    fetchEntranceExams,
    addEntranceExam,
    editEntranceExam,
    removeEntranceExam,
    clearMessages
  } = useEntranceExams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deletingExam, setDeletingExam] = useState(null);

  const [localSearch, setLocalSearch] = useState(search);
  const searchTimeoutRef = useRef(null);

  const initialFormState = {
    name: '',
    conductingAuthority: '',
    eligibilityCriteria: '',
    applicationProcess: '',
    registrationStartDate: '',
    registrationEndDate: '',
    examDate: '',
    admitCardRelease: '',
    counsellingSchedule: '',
    officialWebsite: '',
    importantInstructions: '',
    status: 'active'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Load initial data
  useEffect(() => {
    fetchEntranceExams({ search, status, page, limit });
  }, [fetchEntranceExams, search, status, page, limit]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value.trim());
      setPage(1);
    }, 400);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearch('');
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage(page + 1);
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearMessages]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    }).format(d);
  };

  const handleOpenModal = (exam = null) => {
    if (exam) {
      setEditingExam(exam);
      setFormData({
        name: exam.name,
        conductingAuthority: exam.conductingAuthority,
        eligibilityCriteria: exam.eligibilityCriteria || '',
        applicationProcess: exam.applicationProcess || '',
        registrationStartDate: formatDateForInput(exam.registrationStartDate),
        registrationEndDate: formatDateForInput(exam.registrationEndDate),
        examDate: formatDateForInput(exam.examDate),
        admitCardRelease: formatDateForInput(exam.admitCardRelease),
        counsellingSchedule: exam.counsellingSchedule || '',
        officialWebsite: exam.officialWebsite || '',
        importantInstructions: exam.importantInstructions || '',
        status: exam.status || 'active'
      });
    } else {
      setEditingExam(null);
      setFormData(initialFormState);
    }
    clearMessages();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
  };

  const handleOpenDeleteModal = (exam) => {
    setDeletingExam(exam);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingExam(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.conductingAuthority.trim()) return;

    let success = false;
    if (editingExam) {
      success = await editEntranceExam(editingExam._id, formData);
    } else {
      success = await addEntranceExam(formData);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingExam) {
      const success = await removeEntranceExam(deletingExam._id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>Entrance Exams</h2>
          <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Manage national and state-level entrance examinations</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary" 
          style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Add Exam
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7c6f93' }} />
          <input 
            type="text" 
            placeholder="Search entrance exams..." 
            value={localSearch}
            onChange={handleSearchChange}
            style={{ 
              width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', 
              border: '1px solid #ede9fe', backgroundColor: '#fbfaff', 
              fontSize: '0.85rem', color: '#1e1035', outline: 'none'
            }} 
          />
          {localSearch && (
            <button 
              onClick={clearSearch}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7c6f93', padding: '0.2rem' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: '#7c6f93' }} />
          <select 
            value={status} 
            onChange={handleStatusChange}
            style={{ 
              padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ede9fe', 
              backgroundColor: '#fbfaff', fontSize: '0.85rem', color: '#1e1035', outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '0.85rem', fontWeight: 500 }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && !isModalOpen && !isDeleteModalOpen && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '0.85rem', fontWeight: 500 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && entranceExams.length === 0 ? (
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
        </div>
      ) : (
        /* Data Table */
        <div className="glass-panel" style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
          {entranceExams.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#7c6f93' }}>
              <FileText size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>{search || status !== 'all' ? 'No entrance exams match your current search or filters.' : 'No entrance exams found.'}</p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #ede9fe', color: '#7c6f93', backgroundColor: '#faf5ff' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Exam Name</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Conducting Authority</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Registration Period</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Exam Date</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ position: 'relative' }}>
                  {isLoading && (
                    <tr style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 1 }} />
                  )}
                  {entranceExams.map((exam) => (
                    <tr key={exam._id} style={{ borderBottom: '1px solid #ede9fe', transition: 'background 0.2s' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e1035' }}>{exam.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>
                        {exam.conductingAuthority || '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>
                        {(exam.registrationStartDate || exam.registrationEndDate) ? (
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                             <Calendar size={12} color="#7c6f93" />
                             <span>
                               {formatDateForDisplay(exam.registrationStartDate)} to {formatDateForDisplay(exam.registrationEndDate)}
                             </span>
                           </div>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>
                        {formatDateForDisplay(exam.examDate)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${exam.status === 'active' ? 'badge-emerald' : 'badge-rose'}`}>
                          {exam.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleOpenModal(exam)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: '0.3rem', position: 'relative', zIndex: 2 }}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenDeleteModal(exam)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11d48', padding: '0.3rem', position: 'relative', zIndex: 2 }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div style={{ padding: '1rem', borderTop: '1px solid #ede9fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fbfaff' }}>
                  <span style={{ fontSize: '0.8rem', color: '#7c6f93' }}>
                    Showing page <strong style={{ color: '#1e1035' }}>{pagination.page}</strong> of <strong style={{ color: '#1e1035' }}>{pagination.totalPages}</strong> ({pagination.totalItems} items)
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handlePrevPage}
                      disabled={page <= 1 || isLoading}
                      style={{ 
                        padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ede9fe', 
                        backgroundColor: page <= 1 ? '#f3f4f6' : '#ffffff', color: page <= 1 ? '#9ca3af' : '#1e1035',
                        cursor: page <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem',
                        fontSize: '0.8rem', fontWeight: 500
                      }}
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <button 
                      onClick={handleNextPage}
                      disabled={page >= pagination.totalPages || isLoading}
                      style={{ 
                        padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ede9fe', 
                        backgroundColor: page >= pagination.totalPages ? '#f3f4f6' : '#ffffff', color: page >= pagination.totalPages ? '#9ca3af' : '#1e1035',
                        cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem',
                        fontSize: '0.8rem', fontWeight: 500
                      }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(30, 16, 53, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%', maxWidth: '700px', backgroundColor: '#ffffff',
            padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035' }}>
                {editingExam ? 'Edit Entrance Exam' : 'Add New Entrance Exam'}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c6f93' }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', backgroundColor: '#fff1f2', color: '#e11d48', fontSize: '0.8rem', fontWeight: 500 }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Examination Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. KEAM, NEET, JEE Main"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Conducting Authority *
                  </label>
                  <input
                    type="text"
                    name="conductingAuthority"
                    value={formData.conductingAuthority}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. National Testing Agency (NTA)"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Registration Start Date
                  </label>
                  <input
                    type="date"
                    name="registrationStartDate"
                    value={formData.registrationStartDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Registration End Date
                  </label>
                  <input
                    type="date"
                    name="registrationEndDate"
                    value={formData.registrationEndDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Examination Date
                  </label>
                  <input
                    type="date"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Admit Card Release
                  </label>
                  <input
                    type="date"
                    name="admitCardRelease"
                    value={formData.admitCardRelease}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                  Counselling Schedule
                </label>
                <input
                  type="text"
                  name="counsellingSchedule"
                  value={formData.counsellingSchedule}
                  onChange={handleInputChange}
                  placeholder="e.g. July 2026 - September 2026 (Multiple Rounds)"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Eligibility Criteria
                  </label>
                  <textarea
                    name="eligibilityCriteria"
                    value={formData.eligibilityCriteria}
                    onChange={handleInputChange}
                    placeholder="e.g. 10+2 with Physics, Chemistry..."
                    rows="2"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Application Process
                  </label>
                  <textarea
                    name="applicationProcess"
                    value={formData.applicationProcess}
                    onChange={handleInputChange}
                    placeholder="e.g. Online submission through portal..."
                    rows="2"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                  Important Instructions
                </label>
                <textarea
                  name="importantInstructions"
                  value={formData.importantInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g. Aadhaar card is mandatory for registration."
                  rows="2"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Official Website
                  </label>
                  <input
                    type="url"
                    name="officialWebsite"
                    value={formData.officialWebsite}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', minWidth: '130px', display: 'flex', justifyContent: 'center' }} disabled={isSubmitting || !formData.name.trim() || !formData.conductingAuthority.trim()}>
                  {isSubmitting ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #ede9fe', borderTopColor: '#ffffff' }} /> : (editingExam ? 'Update Exam' : 'Save Exam')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingExam && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(30, 16, 53, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%', maxWidth: '420px', backgroundColor: '#ffffff',
            padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035', marginBottom: '1rem' }}>Delete Entrance Exam</h3>
            <p style={{ fontSize: '0.9rem', color: '#5b5273', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete the exam <strong>"{deletingExam.name}"</strong>? This action cannot be undone.
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', backgroundColor: '#fff1f2', color: '#e11d48', fontSize: '0.8rem', fontWeight: 500 }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={handleCloseDeleteModal} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} disabled={isSubmitting}>
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                style={{ 
                  padding: '0.6rem 1.25rem', fontSize: '0.85rem', backgroundColor: '#e11d48', 
                  color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                  minWidth: '100px', display: 'flex', justifyContent: 'center'
                }} 
                disabled={isSubmitting}
              >
                {isSubmitting ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntranceExamsTab;
