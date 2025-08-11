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
import { addPatient } from '../features/patientSlice'

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    appointmentTime: '',
    priority: 'normal',
    symptoms: '',
    emergencyContact: '',
    emergencyPhone: '',
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.age) newErrors.age = 'Age is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required'
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Appointment time is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await dispatch(addPatient(formData)).unwrap()
      navigate('/queue')
    } catch (error) {
      console.error('Failed to add patient:', error)
    }
  }

  const handleClear = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      contact: '',
      address: '',
      appointmentTime: '',
      priority: 'normal',
      symptoms: '',
      emergencyContact: '',
      emergencyPhone: '',
    })
    setErrors({})
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} className="p-8">
        <Box className="text-center mb-8">
          <PersonAddOutlined className="text-5xl text-blue-600 mb-4" />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            Patient Registration
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Add new patients to the queue management system
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold text-gray-700 mb-3">
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
                required
                variant="outlined"
                inputProps={{ min: 0, max: 150 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
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
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
                required
                variant="outlined"
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
              />
            </Grid>

            <Grid item xs={12}>
              <Divider className="my-4" />
            </Grid>

            {/* Appointment Details */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold text-gray-700 mb-3">
                Appointment Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appointment Time"
                name="appointmentTime"
                type="datetime-local"
                value={formData.appointmentTime}
                onChange={handleChange}
                error={!!errors.appointmentTime}
                helperText={errors.appointmentTime}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDateTime() }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority Level</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority Level"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
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
                placeholder="Describe the patient's symptoms or reason for the appointment..."
              />
            </Grid>

            <Grid item xs={12}>
              <Divider className="my-4" />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold text-gray-700 mb-3">
                Emergency Contact (Optional)
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box className="flex justify-end space-x-4 mt-8">
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearOutlined />}
              className="px-6"
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveOutlined />}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isLoading ? 'Adding Patient...' : 'Add Patient'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default PatientRegistration
