// src/store/departmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import departmentService from '../services/departmentService';

// Async thunk to fetch departments
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await departmentService.getAll(params);
      return response.data?.departments || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action) => {
      const index = state.departments.findIndex(d => d.id === action.payload.id);
      if (index !== -1) state.departments[index] = action.payload;
    },
    removeDepartment: (state, action) => {
      state.departments = state.departments.filter(d => d.id !== action.payload);
    },
    clearDepartments: (state) => {
      state.departments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch departments';
      });
  },
});

export const { addDepartment, updateDepartment, removeDepartment, clearDepartments } = departmentSlice.actions;
export default departmentSlice.reducer;
