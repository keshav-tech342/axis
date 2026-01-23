import api from './api';

const signalService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/signals?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/signals/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/signals', data);
    return response.data;
  },

  updateValue: async (id, value) => {
    const response = await api.put(`/signals/${id}/update-value`, { value });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/signals/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/signals/${id}`);
    return response.data;
  },

  getCritical: async (limit = 10) => {
    const response = await api.get(`/signals/critical?limit=${limit}`);
    return response.data;
  }
};

export default signalService;