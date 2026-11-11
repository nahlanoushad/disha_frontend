const API_BASE = '/api';

/**
 * Universal fetch wrapper for Student requests
 */
async function studentRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = options.token || localStorage.getItem('disha_student_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const studentApi = {
  /**
   * Register Student
   */
  async register(data) {
    return studentRequest('/student/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Login Student
   */
  async login(email, password) {
    return studentRequest('/student/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Get Current Student Profile
   */
  async getProfile(token) {
    return studentRequest('/student/profile', {
      method: 'GET',
      token
    });
  },

  /**
   * Update Current Student Profile
   */
  async updateProfile(data) {
    return studentRequest('/student/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Register Firebase Installation ID
   */
  async registerDevice(data) {
    return studentRequest('/student/notifications/register-device', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Deactivate Firebase Installation ID
   */
  async deactivateDevice(data) {
    return studentRequest('/student/notifications/register-device', {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  },

  /**
   * Get Courses from Catalog (Live API)
   */
  async getCourses(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.duration && params.duration !== 'all') query.append('duration', params.duration);
    if (params.eligibility && params.eligibility !== 'all') query.append('eligibility', params.eligibility);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return studentRequest(qs ? `/courses?${qs}` : '/courses');
  },

  /**
   * Get Course Details by ID
   */
  async getCourseById(id) {
    return studentRequest(`/courses/${id}`);
  },

  /**
   * Get Categories
   */
  async getCategories() {
    return studentRequest('/categories');
  },

  /**
   * Get Colleges (Live API)
   */
  async getColleges(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.state && params.state !== 'all') query.append('state', params.state);
    if (params.district && params.district !== 'all') query.append('district', params.district);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.course && params.course !== 'all') query.append('course', params.course);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.format) query.append('format', params.format);
    const qs = query.toString();
    return studentRequest(qs ? `/colleges?${qs}` : '/colleges');
  },

  /**
   * Get College Details by ID
   */
  async getCollegeById(id) {
    return studentRequest(`/colleges/${id}`);
  },

  /**
   * Get Entrance Exams (Live API)
   */
  async getEntranceExams(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.examLevel && params.examLevel !== 'all') query.append('examLevel', params.examLevel);
    if (params.course && params.course !== 'all') query.append('course', params.course);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return studentRequest(qs ? `/entrance-exams?${qs}` : '/entrance-exams');
  },

  /**
   * Get Entrance Exam Details by ID
   */
  async getEntranceExamById(id) {
    return studentRequest(`/entrance-exams/${id}`);
  },

  /**
   * Get Student's Tracked Exams
   */
  async getTrackedExams() {
    return studentRequest('/student/tracked-exams');
  },

  /**
   * Track an Entrance Exam
   */
  async trackExam(data) {
    return studentRequest('/student/tracked-exams', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Update Tracking & Reminder Preferences
   */
  async updateTrackedExam(examId, data) {
    return studentRequest(`/student/tracked-exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Untrack an Entrance Exam
   */
  async untrackExam(examId) {
    return studentRequest(`/student/tracked-exams/${examId}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get Student Reminder Dispatch History
   */
  async getExamReminders() {
    return studentRequest('/student/exam-reminders');
  },

  /**
   * Trigger Reminder Check On-Demand
   */
  async triggerReminderCheck() {
    return studentRequest('/student/exam-reminders/check', {
      method: 'POST'
    });
  },

  /**
   * Get Active Aptitude Assessment Questions
   */
  async getAptitudeQuestions() {
    return studentRequest('/student/aptitude/questions');
  },

  /**
   * Start or Resume an Aptitude Assessment Attempt
   */
  async createAptitudeAttempt(data = {}) {
    return studentRequest('/student/aptitude/attempts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Get All Assessment Attempts (History)
   */
  async getAptitudeAttempts() {
    return studentRequest('/student/aptitude/attempts');
  },

  /**
   * Get Latest Completed Assessment Attempt
   */
  async getLatestAptitudeAttempt() {
    return studentRequest('/student/aptitude/attempts/latest');
  },

  /**
   * Get Assessment Attempt by ID
   */
  async getAptitudeAttemptById(id) {
    return studentRequest(`/student/aptitude/attempts/${id}`);
  },

  /**
   * Auto-Save Draft Assessment Attempt (Pause & Resume)
   */
  async updateAptitudeAttempt(id, data) {
    return studentRequest(`/student/aptitude/attempts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Submit Completed Assessment Attempt
   */
  async submitAptitudeAttempt(id, data) {
    return studentRequest(`/student/aptitude/attempts/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Retry Gemini AI Analysis on an Attempt
   */
  async retryAptitudeAi(id) {
    return studentRequest(`/student/aptitude/attempts/${id}/retry-ai`, {
      method: 'POST'
    });
  }
};

export default studentApi;
