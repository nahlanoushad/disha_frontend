import React, { useState, useEffect, useRef } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import useCategories from '../hooks/useCategories.js';

const CategoriesTab = () => {
  const {
    categories,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    search, setSearch,
    status, setStatus,
    page, setPage,
    limit, setLimit,
    pagination,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
    clearMessages
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Local state for the search input to allow debouncing
  const [localSearch, setLocalSearch] = useState(search);
  const searchTimeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });

  // Fetch data when parameters change
  useEffect(() => {
    fetchCategories({ search, status, page, limit });
  }, [fetchCategories, search, status, page, limit]);

  // Handle local search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value.trim());
      setPage(1); // Reset to page 1 on new search
    }, 400); // 400ms debounce
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1); // Reset to page 1 on status filter change
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

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearMessages]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        status: category.status
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        status: 'active'
      });
    }
    clearMessages();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleOpenDeleteModal = (category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let success = false;
    if (editingCategory) {
      success = await editCategory(editingCategory._id, formData);
    } else {
      success = await addCategory(formData);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingCategory) {
      const success = await removeCategory(deletingCategory._id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1035' }}>Category Directory</h2>
          <p style={{ fontSize: '0.82rem', color: '#7c6f93' }}>Manage core academic categories linked to courses and institutions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary" 
          style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7c6f93' }} />
          <input 
            type="text" 
            placeholder="Search categories..." 
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
      {isLoading && categories.length === 0 ? (
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
        </div>
      ) : (
        /* Data Table */
        <div className="glass-panel" style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
          {categories.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#7c6f93' }}>
              <Layers size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>{search || status !== 'all' ? 'No categories match your search/filter.' : 'No categories found.'}</p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #ede9fe', color: '#7c6f93', backgroundColor: '#faf5ff' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category Name</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Description</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ position: 'relative' }}>
                  {/* Subtle overlay while loading new pages/filters */}
                  {isLoading && (
                    <tr style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 1 }} />
                  )}
                  {categories.map((category) => (
                    <tr key={category._id} style={{ borderBottom: '1px solid #ede9fe', transition: 'background 0.2s' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e1035' }}>{category.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#5b5273', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {category.description || '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${category.status === 'active' ? 'badge-emerald' : 'badge-rose'}`}>
                          {category.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleOpenModal(category)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: '0.3rem', position: 'relative', zIndex: 2 }}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenDeleteModal(category)}
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
            width: '100%', maxWidth: '500px', backgroundColor: '#ffffff',
            padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Engineering"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#5b5273', marginBottom: '0.4rem' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the category..."
                  rows="3"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid #ede9fe', backgroundColor: '#fbfaff',
                    fontSize: '0.9rem', color: '#1e1035', outline: 'none', resize: 'vertical'
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
                <button type="button" onClick={handleCloseModal} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', minWidth: '100px', display: 'flex', justifyContent: 'center' }} disabled={isSubmitting || !formData.name.trim()}>
                  {isSubmitting ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #ede9fe', borderTopColor: '#ffffff' }} /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingCategory && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1035', marginBottom: '1rem' }}>Delete Category</h3>
            <p style={{ fontSize: '0.9rem', color: '#5b5273', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete the category <strong>"{deletingCategory.name}"</strong>? This action cannot be undone.
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

export default CategoriesTab;
