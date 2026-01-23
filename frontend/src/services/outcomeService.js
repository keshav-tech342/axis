import api from './api';

const outcomeService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/outcomes?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/outcomes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/outcomes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/outcomes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/outcomes/${id}`);
    return response.data;
  }
};

export default outcomeService;