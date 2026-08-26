import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading indicator if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      toast.error(`Error ${error.response.status}: ${message}`);
    } else if (error.request) {
      toast.error('Network error: Unable to reach server');
    } else {
      toast.error('Request error: ' + error.message);
    }
    return Promise.reject(error);
  }
);

export const databaseAPI = {
  // Insert a record
  insert: async (key, value) => {
    const response = await api.post('/database/insert', { key, value });
    return response.data;
  },

  // Search for a record
  search: async (key) => {
    const response = await api.get(`/database/search/${key}`);
    return response.data;
  },

  // Delete a record
  delete: async (key) => {
    const response = await api.delete(`/database/delete/${key}`);
    return response.data;
  },

  // Update a record
  update: async (key, value) => {
    const response = await api.put('/database/update', { key, value });
    return response.data;
  },

  // Range query
  rangeQuery: async (start, end) => {
    const response = await api.get('/database/range', {
      params: { start, end }
    });
    return response.data;
  },

  // Bulk insert
  bulkInsert: async (records) => {
    const response = await api.post('/database/bulk-insert', records);
    return response.data;
  },

  // Get database info
  getInfo: async () => {
    const response = await api.get('/database/info');
    return response.data;
  },

  // Get tree visualization
  visualize: async () => {
    const response = await api.get('/database/visualize');
    return response.data;
  }
};

export default api;