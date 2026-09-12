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
  }
};

export default api;
