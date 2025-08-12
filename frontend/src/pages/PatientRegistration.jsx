import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import { PersonAddOutlined, SaveOutlined, ClearOutlined } from '@mui/icons-material'
import { registerPatientWithQueue } from '../features/patientSlice'

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    checkup_type: '',
    priority: 0,
    symptoms: '',
    emergency_contact: '',
    estimated_wait_time: 30,
  })

  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.patients)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.checkup_type.trim()) newErrors.checkup_type = 'Checkup type is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const transformFormData = () => {
    // Transform the form data to match the backend schema
    const transformed = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email || null,
      address: formData.address || null,
      emergency_contact: formData.emergency_contact || null,
      medical_history: formData.symptoms || null,
      checkup_type: formData.checkup_type,
      priority: parseInt(formData.priority),
      notes: formData.symptoms || null,
      estimated_wait_time: parseInt(formData.estimated_wait_time) || 30
    }
    
    return transformed
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      const transformedData = transformFormData()
      await dispatch(registerPatientWithQueue(transformedData)).unwrap()
      navigate('/queue')
    } catch (error) {
      console.error('Failed to register patient:', error)
    }
  }

  const handleClear = () => {
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      checkup_type: '',
      priority: 0,
      symptoms: '',
      emergency_contact: '',
      estimated_wait_time: 30,
    })
    setErrors({})
  }

  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <Box className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <Box className="text-center">
        <Box className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <PersonAddOutlined className="text-4xl text-blue-600" />
        </Box>
        <Typography variant="h3" component="h1" className="font-bold text-gray-800 mb-3">
          Patient Registration
        </Typography>
        <Typography variant="h6" className="text-gray-600 font-normal">
          Add new patients to the queue management system
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="content-spacing">
          {error}
        </Alert>
      )}

      {/* Form Section */}
      <Paper elevation={0} className="card p-8">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Box className="bg-blue-50 rounded-xl p-4 mb-6">
                <Typography variant="h5" className="font-semibold text-blue-800 mb-2">
                  Basic Information
                </Typography>
                <Typography variant="body2" className="text-blue-700">
                  Enter the patient's personal details
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                required
                variant="outlined"
                size="medium"
                className="search-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
                required
                variant="outlined"
                size="medium"
                className="search-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth}
                required
                variant="outlined"
                size="medium"
                className="search-field"
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: getCurrentDate() }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.gender} size="medium">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                  variant="outlined"
                  className="search-field"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                variant="outlined"
                size="medium"
                className="search-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                className="search-field"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
                variant="outlined"
                size="medium"
                className="search-field"
              />
            </Grid>

            {/* Appointment Details */}
            <Grid item xs={12}>
              <Box className="bg-green-50 rounded-xl p-4 mb-6 mt-8">
                <Typography variant="h5" className="font-semibold text-green-800 mb-2">
                  Appointment Details
                </Typography>
                <Typography variant="body2" className="text-green-700">
                  Schedule and prioritize the appointment
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Checkup Type"
                name="checkup_type"
                value={formData.checkup_type}
                onChange={handleChange}
                error={!!errors.checkup_type}
                helperText={errors.checkup_type}
                required
                variant="outlined"
                size="medium"
                className="search-field"
                placeholder="e.g., General Checkup, Consultation"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="medium">
                <InputLabel>Priority Level</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority Level"
                  variant="outlined"
                  className="search-field"
                >
                  <MenuItem value={0}>Normal</MenuItem>
                  <MenuItem value={1}>Urgent</MenuItem>
                  <MenuItem value={2}>Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Symptoms/Reason for Visit"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
                size="medium"
                className="search-field"
                placeholder="Describe the patient's symptoms or reason for the appointment..."
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Box className="bg-orange-50 rounded-xl p-4 mb-6 mt-8">
                <Typography variant="h5" className="font-semibold text-orange-800 mb-2">
                  Emergency Contact (Optional)
                </Typography>
                <Typography variant="body2" className="text-orange-700">
                  Additional contact information for emergencies
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                className="search-field"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Wait Time (minutes)"
                name="estimated_wait_time"
                type="number"
                value={formData.estimated_wait_time}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                className="search-field"
                inputProps={{ min: 0, max: 480 }}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-10">
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearOutlined />}
              className="btn-secondary"
              size="large"
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveOutlined />}
              className="btn-primary"
              size="large"
            >
              {isLoading ? 'Registering Patient...' : 'Register Patient'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default PatientRegistration
