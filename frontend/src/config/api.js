// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  
  // Timeout settings
  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    LOGIN: 15000,   // 15 seconds for login
    UPLOAD: 30000,  // 30 seconds for file uploads
  },
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // CORS settings
  CORS: {
    withCredentials: false,
  },
  
  // Debug mode
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.MODE === 'development',
}

// Log configuration on startup
if (API_CONFIG.DEBUG) {
  console.log('API Configuration:', API_CONFIG)
  console.log('Environment Variables:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_DEBUG: import.meta.env.VITE_DEBUG,
    MODE: import.meta.env.MODE,
  })
}

export default API_CONFIG
