import api from '../utils/api';

export const folderService = {
  getAll: async () => {
    const response = await api.get('/folders');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/folders/${id}`);
    return response.data;
  },

  create: async (folderData) => {
    const response = await api.post('/folders', folderData);
    return response.data;
  },

  update: async (id, folderData) => {
    const response = await api.put(`/folders/${id}`, folderData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },

  getContents: async (id) => {
    const response = await api.get(`/folders/${id}/contents`);
    return response.data;
  },

  move: async (id, parentId) => {
    const response = await api.patch(`/folders/${id}/move`, { parentId });
    return response.data;
  }
};

export default folderService;