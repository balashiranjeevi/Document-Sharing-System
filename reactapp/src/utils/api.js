import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  delete: (id) => api.delete(`/documents/${id}`),
  search: (query, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => 
    api.get('/documents', { params: { search: query, page, size, sortBy, sortDir } })
};

export const folderService = {
  getAll: () => api.get('/folders'),
  create: (data) => api.post('/folders', data),
  update: (id, data) => api.put(`/folders/${id}`, data),
  delete: (id) => api.delete(`/folders/${id}`),
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