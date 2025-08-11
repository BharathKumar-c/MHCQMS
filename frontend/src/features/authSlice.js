import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services/authService'

// Get token from localStorage on app start
const getTokenFromStorage = () => {
  try {
    return localStorage.getItem('mhcqms_token')
  } catch (error) {
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
      const response = await authService.login(credentials)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('mhcqms_token')
      return null
    } catch (error) {
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
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('mhcqms_token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setToken } = authSlice.actions
export default authSlice.reducer
