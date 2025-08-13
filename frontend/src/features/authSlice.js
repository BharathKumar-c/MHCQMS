import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services/authService'

// Get token from localStorage on app start
const getTokenFromStorage = () => {
  try {
    return localStorage.getItem('mhcqms_token')
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null
  }
}

const initialState = {
  user: null,
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Auth slice: Starting login process');
      const response = await authService.login(credentials)
      console.log('Auth slice: Login successful, response:', response);
      
      // Ensure we have the expected response structure
      if (!response.access_token && !response.token) {
        throw new Error('Invalid response format - missing token');
      }
      
      return response
    } catch (error) {
      console.error('Auth slice: Login failed:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.detail || 
                           error.response.data?.message || 
                           `Server error: ${error.response.status}`;
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue('No response from server - check if backend is running');
      } else {
        // Something else happened
        return rejectWithValue(error.message || 'Login failed');
      }
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Auth slice: Starting logout process');
      localStorage.removeItem('mhcqms_token')
      console.log('Auth slice: Logout successful');
      return null
    } catch (error) {
      console.error('Auth slice: Logout failed:', error);
      return rejectWithValue('Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        console.log('Auth slice: Login pending');
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Auth slice: Login fulfilled, payload:', action.payload);
        state.isLoading = false
        state.isAuthenticated = true
        
        // Handle different response formats
        if (action.payload.user) {
          state.user = action.payload.user
        } else if (action.payload.username) {
          state.user = { name: action.payload.username }
        }
        
        // Handle different token field names
        const token = action.payload.access_token || action.payload.token
        if (token) {
          state.token = token
          localStorage.setItem('mhcqms_token', token)
        }
      })
      .addCase(login.rejected, (state, action) => {
        console.log('Auth slice: Login rejected, payload:', action.payload);
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('Auth slice: Logout fulfilled');
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setToken } = authSlice.actions
export default authSlice.reducer
