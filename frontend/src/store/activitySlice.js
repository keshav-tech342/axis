import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import activityService from '../services/activityService';

// Async thunks
export const fetchActivities = createAsyncThunk(
  'activities/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await activityService.getAll(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch activities' });
    }
  }
);

export const fetchActivityById = createAsyncThunk(
  'activities/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await activityService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch activity' });
    }
  }
);

export const createActivity = createAsyncThunk(
  'activities/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await activityService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create activity' });
    }
  }
);

export const executeActivity = createAsyncThunk(
  'activities/execute',
  async ({ id, executionData }, { rejectWithValue }) => {
    try {
      const response = await activityService.execute(id, executionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to execute activity' });
    }
  }
);

export const updateActivity = createAsyncThunk(
  'activities/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await activityService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update activity' });
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'activities/delete',
  async (id, { rejectWithValue }) => {
    try {
      await activityService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete activity' });
    }
  }
);

const activitySlice = createSlice({
  name: 'activities',
  initialState: {
    activities: [],
    currentActivity: null,
    loading: false,
    error: null,
    filters: {},
    total: 0
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentActivity: (state) => {
      state.currentActivity = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.activities;
        state.total = action.payload.total;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single activity
      .addCase(fetchActivityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentActivity = action.payload;
      })
      .addCase(fetchActivityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Execute activity
      .addCase(executeActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeActivity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activities.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
        if (state.currentActivity?.id === action.payload.id) {
          state.currentActivity = action.payload;
        }
      })
      .addCase(executeActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update activity
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.activities.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
      })
      // Delete activity
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter(a => a.id !== action.payload);
        state.total -= 1;
      });
  }
});

export const { setFilters, clearError, clearCurrentActivity } = activitySlice.actions;
export default activitySlice.reducer;