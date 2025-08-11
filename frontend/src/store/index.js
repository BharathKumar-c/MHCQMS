import { configureStore } from '@reduxjs/toolkit';

// Import reducers here when you create them
// import authReducer from './slices/authSlice';
// import queueReducer from './slices/queueSlice';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    // auth: authReducer,
    // queue: queueReducer,
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
