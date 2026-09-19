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
  }
};

export default studentApi;
