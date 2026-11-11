import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import useCourses from '../hooks/useCourses.js';
import useCategories from '../hooks/useCategories.js';

const CoursesTab = () => {
  const {
    courses,
    isLoading: coursesLoading,
    isSubmitting: coursesSubmitting,
    error: coursesError,
    successMessage,
    search, setSearch,
    status, setStatus,
    category: filterCategory, setCategory: setFilterCategory,
    page, setPage,
    limit,
    pagination,
    fetchCourses,
    addCourse,
    editCourse,
    removeCourse,
    clearMessages
  } = useCourses();

  // We need categories for both the filter dropdown and the form dropdown
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fetchCategories
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const [localSearch, setLocalSearch] = useState(search);
  const searchTimeoutRef = useRef(null);

  const initialFormState = {
    name: '',
    category: '',
    description: '',
    eligibility: '',
    duration: '',
    feeStructure: '',
    admissionProcedure: '',
    entranceExams: '', // Text input, will split to array
    careerOpportunities: '', // Text input, will split to array
    higherStudyOptions: '', // Text input, will split to array
    expectedSalaryRange: '',
    status: 'active'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Load initial data
  useEffect(() => {
    fetchCourses({ search, status, category: filterCategory, page, limit });
  }, [fetchCourses, search, status, filterCategory, page, limit]);

  // Load categories once when the tab mounts for the dropdowns
  // We use fetchCategories with high limit to get all for the dropdown
  useEffect(() => {
    fetchCategories({ limit: 100 });
  }, [fetchCategories]);

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

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
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
    if (successMessage || coursesError) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, coursesError, clearMessages]);

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        category: course.category?._id || course.category || '',
        description: course.description || '',
        eligibility: course.eligibility || '',
        duration: course.duration || '',
        feeStructure: course.feeStructure || '',
        admissionProcedure: course.admissionProcedure || '',
        entranceExams: Array.isArray(course.entranceExams) ? course.entranceExams.join(', ') : '',
        careerOpportunities: Array.isArray(course.careerOpportunities) ? course.careerOpportunities.join(', ') : '',
        higherStudyOptions: Array.isArray(course.higherStudyOptions) ? course.higherStudyOptions.join(', ') : '',
        expectedSalaryRange: course.expectedSalaryRange || '',
        status: course.status || 'active'
      });
    } else {
      setEditingCourse(null);
      setFormData(initialFormState);
    }
    clearMessages();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleOpenDeleteModal = (course) => {
    setDeletingCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) return;

    // Transform comma separated strings to arrays
    const formattedData = {
      ...formData,
      entranceExams: formData.entranceExams ? formData.entranceExams.split(',').map(i => i.trim()).filter(Boolean) : [],
      careerOpportunities: formData.careerOpportunities ? formData.careerOpportunities.split(',').map(i => i.trim()).filter(Boolean) : [],
      higherStudyOptions: formData.higherStudyOptions ? formData.higherStudyOptions.split(',').map(i => i.trim()).filter(Boolean) : []
    };

    let success = false;
    if (editingCourse) {
      success = await editCourse(editingCourse._id, formattedData);
    } else {
      success = await addCourse(formattedData);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingCourse) {
      const success = await removeCourse(deletingCourse._id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  const getCategoryName = (categoryId) => {
    // If it's populated directly
    if (typeof categoryId === 'object' && categoryId?.name) {
      return categoryId.name;
    }
    // Fallback if we only have ID, look up from our loaded categories
    const cat = categories.find(c => c._id === categoryId);
    return cat ? cat.name : 'Unknown Category';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>Course</h2>
          <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Manage higher education courses and roadmaps</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary" 
          style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7c6f93' }} />
          <input 
            type="text" 
            placeholder="Search courses..." 
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
            value={filterCategory} 
            onChange={handleCategoryFilterChange}
            style={{ 
              padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ede9fe', 
              backgroundColor: '#fbfaff', fontSize: '0.85rem', color: '#1e1035', outline: 'none',
              cursor: 'pointer', maxWidth: '200px'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

      {(coursesError || categoriesError) && !isModalOpen && !isDeleteModalOpen && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '0.85rem', fontWeight: 500 }}>
          <AlertCircle size={18} />
          <span>{coursesError || categoriesError}</span>
        </div>
      )}

      {/* Loading State */}
      {coursesLoading && courses.length === 0 ? (
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
        </div>
      ) : (
        /* Data Table */
        <div className="glass-panel" style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
          {courses.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#7c6f93' }}>
              <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>{search || status !== 'all' || filterCategory !== 'all' ? 'No courses match your search/filter.' : 'No courses found.'}</p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #ede9fe', color: '#7c6f93', backgroundColor: '#faf5ff' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Course Name</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ position: 'relative' }}>
                  {coursesLoading && (
                    <tr style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 1 }} />
                  )}
                  {courses.map((course) => (
                    <tr key={course._id} style={{ borderBottom: '1px solid #ede9fe', transition: 'background 0.2s' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e1035' }}>{course.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273' }}>
                        {getCategoryName(course.category)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${course.status === 'active' ? 'badge-emerald' : 'badge-rose'}`}>
                          {course.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleOpenModal(course)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: '0.3rem', position: 'relative', zIndex: 2 }}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenDeleteModal(course)}
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
                      disabled={page <= 1 || coursesLoading}
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
                      disabled={page >= pagination.totalPages || coursesLoading}
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
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c6f93' }}>
                <X size={20} />
              </button>
            </div>

            {coursesError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', backgroundColor: '#fff1f2', color: '#e11d48', fontSize: '0.8rem', fontWeight: 500 }}>
                <AlertCircle size={14} />
                <span>{coursesError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. B.Tech Computer Science"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Category *
                  </label>
                  {categoriesLoading ? (
                    <div style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#7c6f93' }}>Loading categories...</div>
                  ) : categoriesError ? (
                    <div style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#e11d48' }}>Error loading categories</div>
                  ) : (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%', padding: '0.75rem', borderRadius: '8px',
                        border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                        fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                      }}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the course..."
                  rows="3"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Eligibility
                  </label>
                  <textarea
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    placeholder="e.g. 10+2 with PCM"
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
                    Admission Procedure
                  </label>
                  <textarea
                    name="admissionProcedure"
                    value={formData.admissionProcedure}
                    onChange={handleInputChange}
                    placeholder="e.g. Based on Entrance Exam score"
                    rows="2"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 4 Years"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Fee Structure
                  </label>
                  <input
                    type="text"
                    name="feeStructure"
                    value={formData.feeStructure}
                    onChange={handleInputChange}
                    placeholder="e.g. ₹1L - ₹3L per year"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                      fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                    Expected Salary Range
                  </label>
                  <input
                    type="text"
                    name="expectedSalaryRange"
                    value={formData.expectedSalaryRange}
                    onChange={handleInputChange}
                    placeholder="e.g. ₹3L - ₹10L per annum"
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
                  Entrance Exams (Comma separated)
                </label>
                <input
                  type="text"
                  name="entranceExams"
                  value={formData.entranceExams}
                  onChange={handleInputChange}
                  placeholder="e.g. JEE Main, JEE Advanced, KEAM"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                  Career Opportunities (Comma separated)
                </label>
                <input
                  type="text"
                  name="careerOpportunities"
                  value={formData.careerOpportunities}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Engineer, Data Analyst, Web Developer"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                  Higher Study Options (Comma separated)
                </label>
                <input
                  type="text"
                  name="higherStudyOptions"
                  value={formData.higherStudyOptions}
                  onChange={handleInputChange}
                  placeholder="e.g. M.Tech, MS, MBA"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} disabled={coursesSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', minWidth: '130px', display: 'flex', justifyContent: 'center' }} disabled={coursesSubmitting || !formData.name.trim() || !formData.category}>
                  {coursesSubmitting ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #ede9fe', borderTopColor: '#ffffff' }} /> : (editingCourse ? 'Update Course' : 'Save Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingCourse && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035', marginBottom: '1rem' }}>Delete Course</h3>
            <p style={{ fontSize: '0.9rem', color: '#5b5273', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete the course <strong>"{deletingCourse.name}"</strong>? This action cannot be undone.
            </p>

            {coursesError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', backgroundColor: '#fff1f2', color: '#e11d48', fontSize: '0.8rem', fontWeight: 500 }}>
                <AlertCircle size={14} />
                <span>{coursesError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={handleCloseDeleteModal} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} disabled={coursesSubmitting}>
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                style={{ 
                  padding: '0.6rem 1.25rem', fontSize: '0.85rem', backgroundColor: '#e11d48', 
                  color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                  minWidth: '100px', display: 'flex', justifyContent: 'center'
                }} 
                disabled={coursesSubmitting}
              >
                {coursesSubmitting ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
