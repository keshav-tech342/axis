import api from './api';

const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getActivityTrends: async (days = 30) => {
    const response = await api.get(`/analytics/trends/activities?days=${days}`);
    return response.data;
  },

  getOutcomeProgress: async () => {
    const response = await api.get('/analytics/outcomes/progress');
    return response.data;
  }
};

export default analyticsService;