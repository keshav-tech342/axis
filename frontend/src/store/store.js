import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import departmentReducer from './departmentSlice';
import activityReducer from './activitySlice';
import outcomeReducer from './outcomeSlice';
import signalReducer from './signalSlice';
import roleReducer from './roleSlice';  // ✅ Add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    activities: activityReducer,
    outcomes: outcomeReducer,
    signals: signalReducer,
    roles: roleReducer,  // ✅ Add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});