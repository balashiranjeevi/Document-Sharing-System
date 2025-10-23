import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => localStorage.removeItem('token'),
};

export const documentService = {
  getAll: (params = {}) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  rename: (id, title) => api.patch(`/documents/${id}`, { title }),
  delete: (id) => api.delete(`/documents/${id}`),
  search: (query, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => 
    api.get('/documents', { params: { search: query, page, size, sortBy, sortDir } }),
  getRecent: () => api.get('/documents/recent'),
  getShared: () => api.get('/documents/shared'),
  getTrash: () => api.get('/documents/trash'),
  getStats: () => api.get('/documents/stats'),
  share: (id) => api.put(`/documents/${id}/share`),
  moveToTrash: (id) => api.put(`/documents/${id}/trash`),
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
  view: (id) => api.get(`/documents/${id}/view`, { responseType: 'blob' }),
  permanentDelete: (id) => api.delete(`/documents/${id}/permanent`),
  restore: (id) => api.put(`/documents/${id}/restore`),
  getActivities: () => api.get('/documents/activities'),
  getByType: (type) => api.get(`/documents/by-type/${type}`)
};

export const folderService = {
  getAll: () => api.get('/folders'),
  create: (data) => api.post('/folders', data),
  update: (id, data) => api.put(`/folders/${id}`, data),
  delete: (id) => api.delete(`/folders/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/documents/stats')
};

// API methods for testing compatibility
const apiMethods = {
  getAllDocuments: (params = {}) => api.get('/documents', { params }).then(res => res.data),
  getDocumentById: (id) => api.get(`/documents/${id}`).then(res => res.data),
  createDocument: (data) => api.post('/documents', data).then(res => res.data),
  updateDocument: (id, data) => api.put(`/documents/${id}`, data).then(res => res.data),
  deleteDocument: (id) => api.delete(`/documents/${id}`).then(res => res.data)
};

Object.assign(api, apiMethods);

export default api;