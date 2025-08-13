import axios from 'axios';
import API_CONFIG from '../config/api';

console.log('API Base URL:', API_CONFIG.BASE_URL);

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  timeout: API_CONFIG.TIMEOUT.DEFAULT,
  ...API_CONFIG.CORS,
});

// Request interceptor to add JWT token and logging
api.interceptors.request.use(
  (config) => {
    if (API_CONFIG.DEBUG) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }
    
    const token = localStorage.getItem('mhcqms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    if (API_CONFIG.DEBUG) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.config?.metadata?.startTime) {
      const duration = new Date() - error.config.metadata.startTime;
      console.error(`API Error: ${error.config.method?.toUpperCase()} ${error.config.url} - ${error.response?.status || 'Network Error'} (${duration}ms)`, error);
    } else {
      console.error('API Error:', error);
    }

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend may be slow or unresponsive');
    }
    
    if (error.message === 'Network Error') {
      console.error('Network error - check if backend is running and accessible');
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('mhcqms_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
