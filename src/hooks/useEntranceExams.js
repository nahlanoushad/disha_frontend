import { useState, useCallback } from 'react';
import api from '../services/api.js';

export const useEntranceExams = () => {
  const [entranceExams, setEntranceExams] = useState([]);
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

  const fetchEntranceExams = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = {
        search: params.search ?? search,
        status: params.status ?? status,
        page: params.page ?? page,
        limit: params.limit ?? limit
      };
      const response = await api.getEntranceExams(queryParams);
      if (response.status === 'success') {
        setEntranceExams(response.data.entranceExams || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch entrance exams');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, page, limit]);

  const addEntranceExam = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.createEntranceExam(data);
      setSuccessMessage('Entrance Exam created successfully');
      await fetchEntranceExams();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create entrance exam');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editEntranceExam = async (id, data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.updateEntranceExam(id, data);
      setSuccessMessage('Entrance Exam updated successfully');
      await fetchEntranceExams();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update entrance exam');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeEntranceExam = async (id) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await api.deleteEntranceExam(id);
      setSuccessMessage('Entrance Exam deleted successfully');
      
      if (entranceExams.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      } else {
        await fetchEntranceExams();
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete entrance exam');
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
    entranceExams,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    search, setSearch,
    status, setStatus,
    page, setPage,
    limit, setLimit,
    pagination,
    fetchEntranceExams,
    addEntranceExam,
    editEntranceExam,
    removeEntranceExam,
    clearMessages
  };
};

export default useEntranceExams;
