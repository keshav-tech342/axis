import api from './api';

const roleService = {
  getAll: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  assignRole: async (data) => {
    const response = await api.post('/roles/assign', data);
    return response.data;
  },

  removeRole: async (userRoleId) => {
    const response = await api.delete(`/roles/remove/${userRoleId}`);
    return response.data;
  },

  getUserRoles: async (userId, departmentId = null) => {
    const params = departmentId ? `?department_id=${departmentId}` : '';
    const response = await api.get(`/roles/user/${userId}${params}`);
    return response.data;
  },

  getDepartmentUsers: async (departmentId) => {
    const response = await api.get(`/roles/department/${departmentId}/users`);
    return response.data;
  }
};

export default roleService;