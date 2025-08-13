import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import patientReducer from '../features/patientSlice';
import queueReducer from '../features/queueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    queue: queueReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
