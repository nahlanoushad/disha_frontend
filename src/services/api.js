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

  const token = options.token || (options.userType === 'student' ? localStorage.getItem('disha_student_token') : localStorage.getItem('disha_admin_token'));
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
   * Student Registration
   */
  async studentRegister(name, email, password) {
    return request('/auth/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  /**
   * Student OTP Verification
   */
  async studentVerifyOtp(email, otp, fcmToken = null) {
    const payload = { email, otp };
    if (fcmToken) {
      payload.fcmToken = fcmToken;
    }
    return request('/auth/user/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  /**
   * Student Resend OTP
   */
  async studentResendOtp(email) {
    return request('/auth/user/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Student Login
   */
  async studentLogin(email, password) {
    return request('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
};

export default api;
