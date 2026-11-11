import { useState, useCallback } from 'react';
import api from '../services/api.js';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1
  });

  const fetchCourses = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = {
        search: params.search ?? search,
        status: params.status ?? status,
        category: params.category ?? category,
        page: params.page ?? page,
        limit: params.limit ?? limit
      };
      const response = await api.getCourses(queryParams);
      if (response.status === 'success') {
        setCourses(response.data.courses || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, category, page, limit]);

  const addCourse = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.createCourse(data);
      setSuccessMessage('Course created successfully');
      await fetchCourses();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create course');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editCourse = async (id, data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.updateCourse(id, data);
      setSuccessMessage('Course updated successfully');
      await fetchCourses();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update course');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCourse = async (id) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.deleteCourse(id);
      setSuccessMessage('Course deleted successfully');
      
      if (courses.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      } else {
        await fetchCourses();
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete course');
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
    courses,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    search, setSearch,
    status, setStatus,
    category, setCategory,
    page, setPage,
    limit, setLimit,
    pagination,
    fetchCourses,
    addCourse,
    editCourse,
    removeCourse,
    clearMessages
  };
};

export default useCourses;
