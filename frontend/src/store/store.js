import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import departmentReducer from './departmentSlice';
import activityReducer from './activitySlice'; // ✅ Add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    activities: activityReducer, // ✅ Add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});