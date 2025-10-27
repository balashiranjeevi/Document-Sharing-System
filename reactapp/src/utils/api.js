import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// URL validation helper
const validateUrl = (url) => {
  const allowedHosts = ['localhost', '127.0.0.1'];
  try {
    const urlObj = new URL(url, API_BASE_URL);
    if (process.env.NODE_ENV === 'production') {
      return urlObj.origin === new URL(API_BASE_URL).origin;
    }
    return allowedHosts.some(host => urlObj.hostname === host) || urlObj.origin === new URL(API_BASE_URL).origin;
  } catch {
    return false;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => localStorage.removeItem("token"),
  searchUsers: (query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return Promise.reject(new Error('Invalid search query'));
    }
    return api.get("/auth/users/search", { params: { q: query.trim() } });
  },
};

export const documentService = {
  getAll: (params = {}) => api.get("/documents", { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post("/documents", data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  rename: (id, title) => api.patch(`/documents/${id}`, { title }),
  delete: (id) => api.delete(`/documents/${id}`),
  search: (query, page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
    const validatedParams = {
      search: query ? query.trim() : '',
      page: Math.max(0, parseInt(page) || 0),
      size: Math.min(100, Math.max(1, parseInt(size) || 10)),
      sortBy: ['id', 'title', 'createdAt', 'updatedAt'].includes(sortBy) ? sortBy : 'id',
      sortDir: ['asc', 'desc'].includes(sortDir) ? sortDir : 'asc'
    };
    return api.get("/documents", { params: validatedParams });
  },
  getRecent: () => api.get("/documents/recent"),
  getShared: () => api.get("/documents/shared"),
  getTrash: () => api.get("/documents/trash"),
  getStats: () => api.get("/documents/stats"),
  share: (id) => api.put(`/documents/${id}/share`),
  moveToTrash: (id) => api.put(`/documents/${id}/trash`),
  download: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') {
      return Promise.reject(new Error('Invalid document ID'));
    }
    return api.get(`/documents/${encodeURIComponent(id)}/download`, { responseType: "blob" });
  },
  view: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') {
      return Promise.reject(new Error('Invalid document ID'));
    }
    return api.get(`/documents/${encodeURIComponent(id)}/view`, { responseType: "blob" });
  },
  permanentDelete: (id) => api.delete(`/documents/${id}/permanent`),
  restore: (id) => api.put(`/documents/${id}/restore`),
  getActivities: () => api.get("/documents/activities"),
  getByType: (type) => api.get(`/documents/by-type/${type}`),
  // Permission management endpoints
  grantPermission: (documentId, userId, permission) =>
    api.post(`/documents/${documentId}/permissions`, { userId, permission }),
  revokePermission: (documentId, userId) =>
    api.delete(`/documents/${documentId}/permissions/${userId}`),
  getPermissions: (documentId) =>
    api.get(`/documents/${documentId}/permissions`),
  updatePermission: (documentId, userId, permission) =>
    api.put(`/documents/${documentId}/permissions/${userId}`, { permission }),
};

export const folderService = {
  getAll: () => api.get("/folders"),
  create: (data) => api.post("/folders", data),
  update: (id, data) => api.put(`/folders/${id}`, data),
  delete: (id) => api.delete(`/folders/${id}`),
};

export const dashboardService = {
  getStats: () => api.get("/documents/stats"),
};

// API methods for testing compatibility
const apiMethods = {
  getAllDocuments: (params = {}) =>
    api.get("/documents", { params }).then((res) => res.data),
  getDocumentById: (id) => api.get(`/documents/${id}`).then((res) => res.data),
  createDocument: (data) =>
    api.post("/documents", data).then((res) => res.data),
  updateDocument: (id, data) =>
    api.put(`/documents/${id}`, data).then((res) => res.data),
  deleteDocument: (id) =>
    api.delete(`/documents/${id}`).then((res) => res.data),
};

Object.assign(api, apiMethods);

export default api;
