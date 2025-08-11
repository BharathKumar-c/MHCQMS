import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  PersonOutline,
  ScheduleOutlined,
  PhoneOutlined,
  LocationOnOutlined
} from '@mui/icons-material'
import { 
  fetchPatients, 
  updatePatient, 
  deletePatient, 
  markPatientServed,
  clearError 
} from '../features/patientSlice'

const QueueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [editDialog, setEditDialog] = useState({ open: false, patient: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, patient: null })
  const [editForm, setEditForm] = useState({})
  
  const dispatch = useDispatch()
  const { patients, isLoading, error } = useSelector((state) => state.patients)

  useEffect(() => {
    dispatch(fetchPatients())
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleEdit = (patient) => {
    setEditForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact,
      address: patient.address,
      appointmentTime: patient.appointmentTime,
      priority: patient.priority,
      symptoms: patient.symptoms,
    })
    setEditDialog({ open: true, patient })
  }

  const handleEditSubmit = async () => {
    try {
      await dispatch(updatePatient({ 
        id: editDialog.patient.id, 
        patientData: editForm 
      })).unwrap()
      setEditDialog({ open: false, patient: null })
    } catch (error) {
      console.error('Failed to update patient:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deletePatient(deleteDialog.patient.id)).unwrap()
      setDeleteDialog({ open: false, patient: null })
    } catch (error) {
      console.error('Failed to delete patient:', error)
    }
  }

  const handleMarkServed = async (patientId) => {
    try {
      await dispatch(markPatientServed(patientId)).unwrap()
    } catch (error) {
      console.error('Failed to mark patient as served:', error)
    }
  }

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm) ||
    patient.priority.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'error'
      case 'high': return 'warning'
      case 'normal': return 'primary'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'emergency': return '🚨'
      case 'high': return '⚠️'
      case 'normal': return '📋'
      case 'low': return '📝'
      default: return '📋'
    }
  }

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
          Queue Management
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Manage patient queue, update status, and handle appointments
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Search and Stats */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <Box className="flex items-center space-x-4">
          <TextField
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            className="w-64"
            size="small"
          />
          <Chip 
            label={`${filteredPatients.length} patients in queue`}
            color="primary"
            variant="outlined"
          />
        </Box>
        
        <Box className="flex space-x-2">
          <Chip 
            label={`${patients.filter(p => p.priority === 'emergency').length} Emergency`}
            color="error"
            size="small"
          />
          <Chip 
            label={`${patients.filter(p => p.priority === 'high').length} High Priority`}
            color="warning"
            size="small"
          />
        </Box>
      </Box>

      {/* Patients Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">Patient Info</TableCell>
                <TableCell className="font-semibold">Contact</TableCell>
                <TableCell className="font-semibold">Appointment</TableCell>
                <TableCell className="font-semibold">Priority</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No patients found in queue
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" className="font-medium">
                          {patient.name}
                        </Typography>
                        <Box className="flex items-center space-x-2 text-sm text-gray-600">
                          <PersonOutline fontSize="small" />
                          <span>{patient.age} years • {patient.gender}</span>
                        </Box>
                        {patient.address && (
                          <Box className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <LocationOnOutlined fontSize="small" />
                            <span className="truncate max-w-48">{patient.address}</span>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box className="flex items-center space-x-2">
                        <PhoneOutlined fontSize="small" className="text-gray-500" />
                        <Typography variant="body2">{patient.contact}</Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box className="flex items-center space-x-2">
                        <ScheduleOutlined fontSize="small" className="text-gray-500" />
                        <Typography variant="body2">
                          {new Date(patient.appointmentTime).toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={`${getPriorityIcon(patient.priority)} ${patient.priority}`}
                        color={getPriorityColor(patient.priority)}
                        size="small"
                        className="capitalize"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={patient.isServed ? 'Served' : 'Waiting'}
                        color={patient.isServed ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box className="flex space-x-1">
                        {!patient.isServed && (
                          <Tooltip title="Mark as Served">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleMarkServed(patient.id)}
                            >
                              <CheckCircleOutlined />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        <Tooltip title="Edit Patient">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(patient)}
                          >
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Patient">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, patient })}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, patient: null })} maxWidth="md" fullWidth>
        <DialogTitle>Edit Patient Information</DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField
              label="Name"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Age"
              type="number"
              value={editForm.age || ''}
              onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={editForm.gender || ''}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Contact"
              value={editForm.contact || ''}
              onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={editForm.address || ''}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Appointment Time"
              type="datetime-local"
              value={editForm.appointmentTime || ''}
              onChange={(e) => setEditForm({ ...editForm, appointmentTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editForm.priority || ''}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Symptoms"
              value={editForm.symptoms || ''}
              onChange={(e) => setEditForm({ ...editForm, symptoms: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, patient: null })}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Update Patient
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, patient: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteDialog.patient?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, patient: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default QueueManagement
