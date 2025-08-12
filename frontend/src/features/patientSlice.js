import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { patientService } from '../services/patientService'

const initialState = {
  patients: [],
  completedPatients: [],
  isLoading: false,
  error: null,
  stats: {
    totalInQueue: 0,
    totalServed: 0,
    averageWaitTime: 0,
  },
}

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatients()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients')
    }
  }
)

export const addPatient = createAsyncThunk(
  'patients/addPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await patientService.addPatient(patientData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add patient')
    }
  }
)

export const registerPatientWithQueue = createAsyncThunk(
  'patients/registerPatientWithQueue',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await patientService.registerPatientWithQueue(registrationData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register patient with queue')
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(id, patientData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient')
    }
  }
)

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      await patientService.deletePatient(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete patient')
    }
  }
)

export const markPatientServed = createAsyncThunk(
  'patients/markPatientServed',
  async (id, { rejectWithValue }) => {
    try {
      const response = await patientService.markPatientServed(id)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark patient as served')
    }
  }
)

export const fetchCompletedPatients = createAsyncThunk(
  'patients/fetchCompletedPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getCompletedPatients()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed patients')
    }
  }
)

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateStats: (state) => {
      const inQueue = state.patients.filter(p => !p.isServed).length
      const served = state.completedPatients.length
      
      // Calculate average wait time (simplified)
      const totalWaitTime = state.completedPatients.reduce((sum, p) => {
        if (p.waitTime) return sum + p.waitTime
        return sum
      }, 0)
      
      state.stats = {
        totalInQueue: inQueue,
        totalServed: served,
        averageWaitTime: served > 0 ? Math.round(totalWaitTime / served) : 0,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients = action.payload
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Add patient
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload)
      })
      
      // Register patient with queue
      .addCase(registerPatientWithQueue.fulfilled, (state, action) => {
        state.patients.push(action.payload.patient)
        // You might want to also update queue state here if you have it
      })
      
      // Update patient
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
      })
      
      // Delete patient
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patients = state.patients.filter(p => p.id !== action.payload)
      })
      
      // Mark patient served
      .addCase(markPatientServed.fulfilled, (state, action) => {
        const index = state.patients.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
        state.completedPatients.push(action.payload)
      })
      
      // Fetch completed patients
      .addCase(fetchCompletedPatients.fulfilled, (state, action) => {
        state.completedPatients = action.payload
      })
  },
})

export const { clearError, updateStats } = patientSlice.actions
export default patientSlice.reducer
