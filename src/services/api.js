const API_BASE = '/api';

/**
 * Universal fetch wrapper with error handling and optional auth header
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = options.token || localStorage.getItem('disha_admin_token');
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

export const api = {
  /**
   * Health check
   */
  async checkHealth() {
    return request('/health');
  },

  /**
   * Admin Login
   */
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Get Current Admin Profile
   */
  async getMe(token) {
    return request('/auth/me', {
      method: 'GET',
      token
    });
  },

  /**
   * Get all categories with optional search, filtering, and pagination
   */
  async getCategories(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/categories?${queryString}` : '/categories';
    return request(endpoint);
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id) {
    return request(`/categories/${id}`);
  },

  /**
   * Create category
   */
  async createCategory(data) {
    return request('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Update category
   */
  async updateCategory(id, data) {
    return request(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete category
   */
  async deleteCategory(id) {
    return request(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get all courses with optional search, filtering, and pagination
   */
  async getCourses(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/courses?${queryString}` : '/courses';
    return request(endpoint);
  },

  /**
   * Get course by ID
   */
  async getCourseById(id) {
    return request(`/courses/${id}`);
  },

  /**
   * Create course
   */
  async createCourse(data) {
    return request('/courses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Update course
   */
  async updateCourse(id, data) {
    return request(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete course
   */
  async deleteCourse(id) {
    return request(`/courses/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get all entrance exams with optional search, filtering, and pagination
   */
  async getEntranceExams(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/entrance-exams?${queryString}` : '/entrance-exams';
    return request(endpoint);
  },

  /**
   * Get entrance exam by ID
   */
  async getEntranceExamById(id) {
    return request(`/entrance-exams/${id}`);
  },

  /**
   * Create entrance exam
   */
  async createEntranceExam(data) {
    return request('/entrance-exams', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Update entrance exam
   */
  async updateEntranceExam(id, data) {
    return request(`/entrance-exams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete entrance exam
   */
  async deleteEntranceExam(id) {
    return request(`/entrance-exams/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get all students with optional search, filtering, and pagination
   */
  async getStudents(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/admin/students?${queryString}` : '/admin/students';
    return request(endpoint);
  },

  /**
   * Get student by ID
   */
  async getStudentById(id) {
    return request(`/admin/students/${id}`);
  },

  /**
   * Update student status
   */
  async updateStudentStatus(id, status) {
    return request(`/admin/students/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

export default api;
