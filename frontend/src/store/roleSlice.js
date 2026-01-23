import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roleService from '../services/roleService';

export const fetchRoles = createAsyncThunk(
  'roles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch roles' });
    }
  }
);

export const assignRole = createAsyncThunk(
  'roles/assign',
  async (data, { rejectWithValue }) => {
    try {
      const response = await roleService.assignRole(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to assign role' });
    }
  }
);

export const removeRole = createAsyncThunk(
  'roles/remove',
  async (userRoleId, { rejectWithValue }) => {
    try {
      await roleService.removeRole(userRoleId);
      return userRoleId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove role' });
    }
  }
);

export const fetchUserRoles = createAsyncThunk(
  'roles/fetchUserRoles',
  async ({ userId, departmentId }, { rejectWithValue }) => {
    try {
      const response = await roleService.getUserRoles(userId, departmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user roles' });
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    userRoles: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignRole.fulfilled, (state, action) => {
        state.userRoles.push(action.payload);
      })
      .addCase(removeRole.fulfilled, (state, action) => {
        state.userRoles = state.userRoles.filter(ur => ur.id !== action.payload);
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.userRoles = action.payload.user_roles;
      });
  }
});

export const { clearError } = roleSlice.actions;
export default roleSlice.reducer;