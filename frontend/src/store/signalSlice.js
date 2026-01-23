import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import signalService from '../services/signalService';

// Async thunks
export const fetchSignals = createAsyncThunk(
  'signals/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await signalService.getAll(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch signals' });
    }
  }
);

export const updateSignalValue = createAsyncThunk(
  'signals/updateValue',
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await signalService.updateValue(id, value);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update signal' });
    }
  }
);

export const fetchCriticalSignals = createAsyncThunk(
  'signals/fetchCritical',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await signalService.getCritical(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch critical signals' });
    }
  }
);

const signalSlice = createSlice({
  name: 'signals',
  initialState: {
    signals: [],
    criticalSignals: [],
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
      // Fetch signals
      .addCase(fetchSignals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSignals.fulfilled, (state, action) => {
        state.loading = false;
        state.signals = action.payload.signals;
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update signal value
      .addCase(updateSignalValue.fulfilled, (state, action) => {
        const index = state.signals.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.signals[index] = action.payload;
        }
      })
      // Fetch critical signals
      .addCase(fetchCriticalSignals.fulfilled, (state, action) => {
        state.criticalSignals = action.payload.signals;
      });
  }
});

export const { clearError } = signalSlice.actions;
export default signalSlice.reducer;