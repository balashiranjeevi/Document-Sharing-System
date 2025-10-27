import api from '../utils/api';

export const documentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/documents', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, data) => {
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      throw new Error('Invalid document ID');
    }
    const response = await api.put(`/documents/${encodeURIComponent(id)}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      throw new Error('Invalid document ID');
    }
    const response = await api.delete(`/documents/${encodeURIComponent(id)}`);
    return response.data;
  },

  download: async (id) => {
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      throw new Error('Invalid document ID');
    }
    const response = await api.get(`/documents/${encodeURIComponent(id)}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  share: async (id, shareData) => {
    const response = await api.post(`/documents/${id}/share`, shareData);
    return response.data;
  },

  updateVisibility: async (id, visibility) => {
    const response = await api.patch(`/documents/${id}/visibility`, { visibility });
    return response.data;
  },

  search: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const response = await api.get('/documents/search', { params });
    return response.data;
  }
};

export default documentService;