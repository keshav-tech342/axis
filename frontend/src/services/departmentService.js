import api from './api';

const departmentService = {
  getAll: async (params = {}) => {
    try {
      console.log('🔍 DepartmentService: Calling API with params:', params);
      const queryString = new URLSearchParams(params).toString();
      console.log('🔗 URL:', `/departments?${queryString}`);
      
      const response = await api.get(`/departments?${queryString}`);
      
      console.log('✅ DepartmentService: Response received:', response);
      return response.data;
    } catch (error) {
      console.error('❌ DepartmentService: Error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  getById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/departments', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  }
};

export default departmentService;