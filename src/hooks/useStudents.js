import { useState, useCallback } from 'react';
import api from '../services/api.js';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const fetchStudents = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = {
        search: params.search ?? search,
        status: params.status ?? status,
        page: params.page ?? page,
        limit: params.limit ?? limit
      };
      const response = await api.getStudents(queryParams);
      if (response.status === 'success') {
        setStudents(response.data.students || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, page, limit]);

  const updateStudentStatus = async (id, newStatus) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.updateStudentStatus(id, newStatus);
      setSuccessMessage(`Student ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      await fetchStudents();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update student status');
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
    students,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    search, setSearch,
    status, setStatus,
    page, setPage,
    limit, setLimit,
    pagination,
    fetchStudents,
    updateStudentStatus,
    clearMessages
  };
};

export default useStudents;
