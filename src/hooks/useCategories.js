import { useState, useCallback } from 'react';
import api from '../services/api.js';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // New states for server-side processing
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1
  });

  const fetchCategories = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = {
        search: params.search ?? search,
        status: params.status ?? status,
        page: params.page ?? page,
        limit: params.limit ?? limit
      };
      const response = await api.getCategories(queryParams);
      if (response.status === 'success') {
        setCategories(response.data.categories || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, page, limit]);

  const addCategory = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.createCategory(data);
      setSuccessMessage('Category created successfully');
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create category');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editCategory = async (id, data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.updateCategory(id, data);
      setSuccessMessage('Category updated successfully');
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update category');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCategory = async (id) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.deleteCategory(id);
      setSuccessMessage('Category deleted successfully');
      
      // If we deleted the last item on the current page, and it's not page 1, go back a page
      if (categories.length === 1 && page > 1) {
        setPage(prev => prev - 1);
        // The useEffect will trigger fetchCategories
      } else {
        await fetchCategories();
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
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
  };
};

export default useCategories;
