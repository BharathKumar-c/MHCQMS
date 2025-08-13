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
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      email: patient.email,
      medical_history: patient.medical_history,
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
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.patient_id?.includes(searchTerm)
  )

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 2: return 'error'      // Emergency
      case 1: return 'warning'    // Urgent
      case 0: return 'primary'    // Normal
      default: return 'default'
    }
  }

  const getPriorityChipClass = (priority) => {
    switch (priority) {
      case 2: return 'chip-emergency'  // Emergency
      case 1: return 'chip-high'       // Urgent
      case 0: return 'chip-normal'     // Normal
      default: return 'chip-normal'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 2: return '🚨'  // Emergency
      case 1: return '⚠️'  // Urgent
      case 0: return '📋'  // Normal
      default: return '📋'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 2: return 'Emergency'
      case 1: return 'Urgent'
      case 0: return 'Normal'
      default: return 'Normal'
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
    <Box className="space-y-8">
      {/* Header Section */}
      <Box className="text-center md:text-left">
        <Typography variant="h3" component="h1" className="font-bold text-gray-800 mb-3">
          Queue Management
        </Typography>
        <Typography variant="h6" className="text-gray-600 font-normal">
          Manage patient queue, update status, and handle appointments
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="content-spacing">
          {error}
        </Alert>
      )}

      {/* Search and Stats Section */}
      <Box className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <Box className="flex items-center space-x-4">
            <TextField
              placeholder="Search patients by name, contact, or priority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="search-field w-80"
              size="medium"
              variant="outlined"
            />
            <Chip 
              label={`${filteredPatients.length} patients in queue`}
              color="primary"
              variant="outlined"
              className="font-medium"
            />
          </Box>
          
          <Box className="flex space-x-3">
            <Chip 
              label={`${patients.filter(p => p.priority === 2).length} Emergency`}
              color="error"
              size="medium"
              className="font-medium"
            />
            <Chip 
              label={`${patients.filter(p => p.priority === 1).length} High Priority`}
              color="warning"
              size="medium"
              className="font-medium"
            />
          </Box>
        </Box>
      </Box>

      {/* Patients Table */}
      <Paper elevation={0} className="table-container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell className="table-header">Patient Info</TableCell>
                <TableCell className="table-header">Contact</TableCell>
                <TableCell className="table-header">Appointment</TableCell>
                <TableCell className="table-header">Priority</TableCell>
                <TableCell className="table-header">Status</TableCell>
                <TableCell className="table-header">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    <Box className="text-center">
                      <Typography variant="h6" className="text-gray-400 mb-2">
                        No patients found in queue
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        Try adjusting your search criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="table-row">
                    <TableCell className="table-cell">
                      <Box>
                        <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-2">
                          {patient.first_name} {patient.last_name}
                        </Typography>
                        <Box className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <PersonOutline fontSize="small" className="text-gray-400" />
                          <span>{patient.patient_id} • {patient.gender}</span>
                        </Box>
                        {patient.address && (
                          <Box className="flex items-center space-x-2 text-sm text-gray-600">
                            <LocationOnOutlined fontSize="small" className="text-gray-400" />
                            <span className="truncate max-w-48">{patient.address}</span>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell className="table-cell">
                      <Box className="flex items-center space-x-2">
                        <PhoneOutlined fontSize="small" className="text-gray-400" />
                        <Typography variant="body2" className="font-medium">{patient.phone}</Typography>
                      </Box>
                      {patient.email && (
                        <Typography variant="body2" className="text-gray-500 text-sm">
                          {patient.email}
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell className="table-cell">
                      <Box className="flex items-center space-x-2">
                        <ScheduleOutlined fontSize="small" className="text-gray-400" />
                        <Typography variant="body2" className="font-medium">
                          {new Date(patient.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell className="table-cell">
                      <Chip
                        label={`${getPriorityIcon(patient.priority)} ${getPriorityLabel(patient.priority)}`}
                        className={`${getPriorityChipClass(patient.priority)} capitalize`}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell className="table-cell">
                      <Chip
                        label="Waiting"
                        color="warning"
                        size="small"
                        className="font-medium"
                      />
                    </TableCell>
                    
                    <TableCell className="table-cell">
                      <Box className="flex space-x-2">
                        {!patient.isServed && (
                          <Tooltip title="Mark as Served">
                            <IconButton
                              size="medium"
                              color="success"
                              onClick={() => handleMarkServed(patient.id)}
                              className="hover:bg-green-50"
                            >
                              <CheckCircleOutlined />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        <Tooltip title="Edit Patient">
                          <IconButton
                            size="medium"
                            color="primary"
                            onClick={() => handleEdit(patient)}
                            className="hover:bg-blue-50"
                          >
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Patient">
                          <IconButton
                            size="medium"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, patient })}
                            className="hover:bg-red-50"
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
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, patient: null })} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          className: "rounded-xl"
        }}
      >
        <DialogTitle className="text-xl font-semibold text-gray-800 pb-4">
          Edit Patient Information
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Box className="form-grid">
            <TextField
              label="First Name"
              value={editForm.first_name || ''}
              onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
              fullWidth
              variant="outlined"
              size="medium"
            />
            <TextField
              label="Last Name"
              value={editForm.last_name || ''}
              onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
              fullWidth
              variant="outlined"
              size="medium"
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={editForm.date_of_birth || ''}
              onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
              fullWidth
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth size="medium">
              <InputLabel>Gender</InputLabel>
              <Select
                value={editForm.gender || ''}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                label="Gender"
                variant="outlined"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Phone"
              value={editForm.phone || ''}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              fullWidth
              variant="outlined"
              size="medium"
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
              variant="outlined"
              size="medium"
            />
            <TextField
              label="Address"
              value={editForm.address || ''}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              fullWidth
              variant="outlined"
              size="medium"
              multiline
              rows={2}
            />
            <TextField
              label="Medical History"
              value={editForm.medical_history || ''}
              onChange={(e) => setEditForm({ ...editForm, medical_history: e.target.value })}
              fullWidth
              variant="outlined"
              size="medium"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-6 pt-0">
          <Button 
            onClick={() => setEditDialog({ open: false, patient: null })}
            className="btn-secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            className="btn-primary"
          >
            Update Patient
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, patient: null })}
        PaperProps={{
          className: "rounded-xl"
        }}
      >
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Confirm Delete
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography className="text-gray-700">
            Are you sure you want to delete <strong>{deleteDialog.patient?.first_name} {deleteDialog.patient?.last_name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="p-6 pt-0">
          <Button 
            onClick={() => setDeleteDialog({ open: false, patient: null })}
            className="btn-secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QueueManagement
