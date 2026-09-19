import React, { useState, useEffect, useRef } from 'react';
import { Users, Eye, Power, PowerOff, CheckCircle2, AlertCircle, X, Search, Filter, ChevronLeft, ChevronRight, Calendar, Mail, Phone, Clock, UserCheck } from 'lucide-react';
import useStudents from '../hooks/useStudents.js';

const StudentsTab = () => {
  const {
    students,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    search, setSearch,
    status, setStatus,
    page, setPage,
    limit,
    pagination,
    fetchStudents,
    updateStudentStatus,
    clearMessages
  } = useStudents();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [localSearch, setLocalSearch] = useState(search);
  const searchTimeoutRef = useRef(null);

  // Load initial data
  useEffect(() => {
    fetchStudents({ search, status, page, limit });
  }, [fetchStudents, search, status, page, limit]);

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

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    }).format(d);
  };
  
  const formatDateTimeForDisplay = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(d);
  };

  const handleOpenViewModal = (student) => {
    setSelectedStudent(student);
    clearMessages();
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
  };

  const handleOpenStatusModal = (student) => {
    setSelectedStudent(student);
    clearMessages();
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedStudent(null);
  };

  const handleStatusConfirm = async () => {
    if (selectedStudent) {
      const newStatus = selectedStudent.isActive ? 'inactive' : 'active';
      const success = await updateStudentStatus(selectedStudent._id, newStatus);
      if (success) {
        handleCloseStatusModal();
        if (isViewModalOpen) {
           // update internal selected student state to reflect UI change without closing details modal if it were open
           setSelectedStudent(prev => ({ ...prev, isActive: !prev.isActive }));
        }
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>Student Accounts</h2>
          <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Manage student profiles and platform access</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7c6f93' }} />
          <input 
            type="text" 
            placeholder="Search students by name, email, or phone..." 
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

      {error && !isViewModalOpen && !isStatusModalOpen && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '0.85rem', fontWeight: 500 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && students.length === 0 ? (
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
        </div>
      ) : (
        /* Data Table */
        <div className="glass-panel" style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
          {students.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#7c6f93' }}>
              <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>{search || status !== 'all' ? 'No students match your current search or filters.' : 'No students found.'}</p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #ede9fe', color: '#7c6f93', backgroundColor: '#faf5ff' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Student Name</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Email</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Phone</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Created Date</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ position: 'relative' }}>
                  {isLoading && (
                    <tr style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 1 }} />
                  )}
                  {students.map((student) => (
                    <tr key={student._id} style={{ borderBottom: '1px solid #ede9fe', transition: 'background 0.2s' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e1035' }}>{student.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Mail size={12} color="#7c6f93" />
                          <span>{student.email || '-'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>
                        {student.phone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Phone size={12} color="#7c6f93" />
                            <span>{student.phone}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>
                        {formatDateForDisplay(student.createdAt)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${student.isActive ? 'badge-emerald' : 'badge-rose'}`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleOpenViewModal(student)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: '0.3rem', position: 'relative', zIndex: 2 }}
                            title="View Profile"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenStatusModal(student)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: student.isActive ? '#e11d48' : '#059669', padding: '0.3rem', position: 'relative', zIndex: 2 }}
                            title={student.isActive ? "Deactivate" : "Activate"}
                          >
                            {student.isActive ? <PowerOff size={16} /> : <Power size={16} />}
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

      {/* View Details Modal Overlay */}
      {isViewModalOpen && selectedStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(30, 16, 53, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%', maxWidth: '550px', backgroundColor: '#ffffff',
            padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#7c3aed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700
                }}>
                  {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035', marginBottom: '0.2rem' }}>
                    {selectedStudent.name}
                  </h3>
                  <span className={`badge ${selectedStudent.isActive ? 'badge-emerald' : 'badge-rose'}`}>
                    {selectedStudent.isActive ? 'Active Account' : 'Inactive Account'}
                  </span>
                </div>
              </div>
              <button onClick={handleCloseViewModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c6f93', padding: '0.2rem' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7c6f93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', borderBottom: '1px solid #ede9fe', paddingBottom: '0.4rem' }}>
                Personal Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#7c6f93', marginBottom: '0.2rem' }}>Email Address</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e1035', fontSize: '0.9rem', fontWeight: 500 }}>
                    <Mail size={14} color="#7c3aed" /> {selectedStudent.email || '-'}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#7c6f93', marginBottom: '0.2rem' }}>Phone Number</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e1035', fontSize: '0.9rem', fontWeight: 500 }}>
                    <Phone size={14} color="#7c3aed" /> {selectedStudent.phone || '-'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7c6f93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', borderBottom: '1px solid #ede9fe', paddingBottom: '0.4rem' }}>
                Account History
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#7c6f93', marginBottom: '0.2rem' }}>Registration Date</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e1035', fontSize: '0.9rem', fontWeight: 500 }}>
                    <Calendar size={14} color="#7c3aed" /> {formatDateTimeForDisplay(selectedStudent.createdAt)}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#7c6f93', marginBottom: '0.2rem' }}>Last Login</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e1035', fontSize: '0.9rem', fontWeight: 500 }}>
                    <Clock size={14} color="#7c3aed" /> {formatDateTimeForDisplay(selectedStudent.lastLogin) !== '-' ? formatDateTimeForDisplay(selectedStudent.lastLogin) : 'Never logged in'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ede9fe', paddingTop: '1.25rem' }}>
               <button 
                  onClick={() => handleOpenStatusModal(selectedStudent)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    color: selectedStudent.isActive ? '#e11d48' : '#059669', 
                    fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                  disabled={isSubmitting}
                >
                  {selectedStudent.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                  {selectedStudent.isActive ? 'Deactivate Account' : 'Activate Account'}
                </button>
              
              <button type="button" onClick={handleCloseViewModal} className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Confirmation Modal */}
      {isStatusModalOpen && selectedStudent && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035', marginBottom: '1rem' }}>
              {selectedStudent.isActive ? 'Deactivate Student' : 'Activate Student'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#5b5273', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to {selectedStudent.isActive ? 'deactivate' : 'activate'} the student account for <strong>"{selectedStudent.name}"</strong>?
              {selectedStudent.isActive && " They will immediately lose access to the platform."}
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', backgroundColor: '#fff1f2', color: '#e11d48', fontSize: '0.8rem', fontWeight: 500 }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={handleCloseStatusModal} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} disabled={isSubmitting}>
                Cancel
              </button>
              <button 
                onClick={handleStatusConfirm} 
                style={{ 
                  padding: '0.6rem 1.25rem', fontSize: '0.85rem', 
                  backgroundColor: selectedStudent.isActive ? '#e11d48' : '#059669', 
                  color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                  minWidth: '100px', display: 'flex', justifyContent: 'center'
                }} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} />
                ) : (
                  selectedStudent.isActive ? 'Deactivate' : 'Activate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTab;
