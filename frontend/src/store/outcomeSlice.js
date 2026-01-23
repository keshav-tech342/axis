import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import outcomeService from '../services/outcomeService';

// Async thunks
export const fetchOutcomes = createAsyncThunk(
  'outcomes/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await outcomeService.getAll(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch outcomes' });
    }
  }
);

export const fetchOutcomeById = createAsyncThunk(
  'outcomes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await outcomeService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch outcome' });
    }
  }
);

export const createOutcome = createAsyncThunk(
  'outcomes/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await outcomeService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create outcome' });
    }
  }
);

export const updateOutcome = createAsyncThunk(
  'outcomes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await outcomeService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update outcome' });
    }
  }
);

export const deleteOutcome = createAsyncThunk(
  'outcomes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await outcomeService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete outcome' });
    }
  }
);

const outcomeSlice = createSlice({
  name: 'outcomes',
  initialState: {
    outcomes: [],
    currentOutcome: null,
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
    clearCurrentOutcome: (state) => {
      state.currentOutcome = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all outcomes
      .addCase(fetchOutcomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutcomes.fulfilled, (state, action) => {
        state.loading = false;
        state.outcomes = action.payload.outcomes;
        state.total = action.payload.total;
      })
      .addCase(fetchOutcomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single outcome
      .addCase(fetchOutcomeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutcomeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOutcome = action.payload;
      })
      .addCase(fetchOutcomeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create outcome
      .addCase(createOutcome.fulfilled, (state, action) => {
        state.outcomes.unshift(action.payload);
        state.total += 1;
      })
      // Update outcome
      .addCase(updateOutcome.fulfilled, (state, action) => {
        const index = state.outcomes.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.outcomes[index] = action.payload;
        }
        if (state.currentOutcome?.id === action.payload.id) {
          state.currentOutcome = action.payload;
        }
      })
      // Delete outcome
      .addCase(deleteOutcome.fulfilled, (state, action) => {
        state.outcomes = state.outcomes.filter(o => o.id !== action.payload);
        state.total -= 1;
      });
  }
});

export const { setFilters, clearError, clearCurrentOutcome } = outcomeSlice.actions;
export default outcomeSlice.reducer;