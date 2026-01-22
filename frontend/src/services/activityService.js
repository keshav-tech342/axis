import api from './api';

const activityService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/activities?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/activities', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
  },

  execute: async (id, executionData = {}) => {
    const response = await api.post(`/activities/${id}/execute`, {
      execution_data: executionData
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  }
};

export default activityService;