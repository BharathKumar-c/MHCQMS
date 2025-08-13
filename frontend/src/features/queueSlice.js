import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { queueService } from '../services/queueService'

const initialState = {
  queue: [],
  isLoading: false,
  error: null,
  stats: {
    total_waiting: 0,
    total_in_progress: 0,
    total_completed: 0,
    total_cancelled: 0,
    average_wait_time: 0,
    estimated_completion_time: null,
  },
}

export const fetchQueueStatus = createAsyncThunk(
  'queue/fetchQueueStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await queueService.getQueueStatus()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch queue status')
    }
  }
)

export const addToQueue = createAsyncThunk(
  'queue/addToQueue',
  async (queueData, { rejectWithValue }) => {
    try {
      const response = await queueService.addToQueue(queueData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to queue')
    }
  }
)

export const updateQueueStatus = createAsyncThunk(
  'queue/updateQueueStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await queueService.updateQueueStatus(id, statusData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update queue status')
    }
  }
)

export const removeFromQueue = createAsyncThunk(
  'queue/removeFromQueue',
  async (id, { rejectWithValue }) => {
    try {
      await queueService.removeFromQueue(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from queue')
    }
  }
)

export const fetchQueueStats = createAsyncThunk(
  'queue/fetchQueueStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await queueService.getQueueStats()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch queue stats')
    }
  }
)

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch queue status
      .addCase(fetchQueueStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchQueueStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.queue = action.payload
      })
      .addCase(fetchQueueStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Add to queue
      .addCase(addToQueue.fulfilled, (state, action) => {
        state.queue.push(action.payload)
      })
      
      // Update queue status
      .addCase(updateQueueStatus.fulfilled, (state, action) => {
        const index = state.queue.findIndex(q => q.id === action.payload.id)
        if (index !== -1) {
          state.queue[index] = action.payload
        }
      })
      
      // Remove from queue
      .addCase(removeFromQueue.fulfilled, (state, action) => {
        state.queue = state.queue.filter(q => q.id !== action.payload)
      })
      
      // Fetch queue stats
      .addCase(fetchQueueStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const { clearError } = queueSlice.actions
export default queueSlice.reducer
