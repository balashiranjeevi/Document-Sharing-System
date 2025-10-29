import api from '../utils/api';
import DOMPurify from 'dompurify';

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim());
  }
  return input;
};

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Sanitize user data before storing
      const sanitizedUser = {
        ...response.data.user,
        name: sanitizeInput(response.data.user.name),
        email: sanitizeInput(response.data.user.email)
      };
      localStorage.setItem('user', JSON.stringify(sanitizedUser));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;