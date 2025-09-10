import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export const scholarApi = {
  /**
   * Search for scholarly articles
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {number} [options.limit=10] - Maximum number of results
   * @param {string} [options.sortBy='relevance'] - Sort by 'relevance' or 'date'
   * @param {boolean} [options.indianOnly=false] - Filter for Indian sources only
   * @returns {Promise<Array>} - Array of search results
   */
  search: async (query, options = {}) => {
    try {
      const response = await api.get('/scholar/search', {
        params: {
          query,
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },
};

export default api;
