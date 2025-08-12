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
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { 
  AssessmentOutlined,
  DownloadOutlined,
  SearchOutlined,
  FilterListOutlined,
  TrendingUpOutlined,
  ScheduleOutlined,
  CheckCircleOutlined
} from '@mui/icons-material'
import { fetchCompletedPatients, clearError } from '../features/patientSlice'

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('today')
  const [priorityFilter, setPriorityFilter] = useState('all')
  
  const dispatch = useDispatch()
  const { completedPatients, isLoading, error } = useSelector((state) => state.patients)

  useEffect(() => {
    dispatch(fetchCompletedPatients())
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const filteredPatients = completedPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.contact.includes(searchTerm)
    
    const matchesPriority = priorityFilter === 'all' || patient.priority === priorityFilter
    
    let matchesDate = true
    if (dateFilter === 'today') {
      const today = new Date().toDateString()
      matchesDate = new Date(patient.servedAt).toDateString() === today
    } else if (dateFilter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = new Date(patient.servedAt) >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesDate = new Date(patient.servedAt) >= monthAgo
    }
    
    return matchesSearch && matchesPriority && matchesDate
  })

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Age',
      'Gender',
      'Contact',
      'Priority',
      'Appointment Time',
      'Served At',
      'Wait Time (minutes)',
      'Symptoms'
    ]

    const csvData = filteredPatients.map(patient => [
      patient.name,
      patient.age,
      patient.gender,
      patient.contact,
      patient.priority,
      new Date(patient.appointmentTime).toLocaleString(),
      new Date(patient.servedAt).toLocaleString(),
      patient.waitTime || 'N/A',
      patient.symptoms || 'N/A'
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `mhcqms_report_${dateFilter}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPriorityChipClass = (priority) => {
    switch (priority) {
      case 'emergency': return 'chip-emergency'
      case 'high': return 'chip-high'
      case 'normal': return 'chip-normal'
      case 'low': return 'chip-low'
      default: return 'chip-normal'
    }
  }

  const calculateWaitTime = (appointmentTime, servedAt) => {
    const appointment = new Date(appointmentTime)
    const served = new Date(servedAt)
    const diffMs = served - appointment
    const diffMins = Math.round(diffMs / (1000 * 60))
    return diffMins
  }

  const getStats = () => {
    const total = filteredPatients.length
    const avgWaitTime = total > 0 
      ? Math.round(filteredPatients.reduce((sum, p) => sum + (p.waitTime || 0), 0) / total)
      : 0
    
    const priorityCounts = filteredPatients.reduce((acc, p) => {
      acc[p.priority] = (acc[p.priority] || 0) + 1
      return acc
    }, {})

    return { total, avgWaitTime, priorityCounts }
  }

  const stats = getStats()

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
          Reports & Analytics
        </Typography>
        <Typography variant="h6" className="text-gray-600 font-normal">
          View completed checkups and generate comprehensive reports
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="content-spacing">
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={4} className="section-spacing">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="p-6">
              <Box className="flex items-center justify-between">
                <Box className="flex-1">
                  <Typography variant="h3" component="div" className="font-bold text-blue-600 mb-2">
                    {stats.total}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" className="font-semibold">
                    Total Completed
                  </Typography>
                </Box>
                <Box className="p-4 rounded-2xl bg-blue-100 ml-4">
                  <CheckCircleOutlined className="text-4xl text-blue-600" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="p-6">
              <Box className="flex items-center justify-between">
                <Box className="flex-1">
                  <Typography variant="h3" component="div" className="font-bold text-green-600 mb-2">
                    {stats.avgWaitTime}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" className="font-semibold">
                    Avg Wait Time (min)
                  </Typography>
                </Box>
                <Box className="p-4 rounded-2xl bg-green-100 ml-4">
                  <ScheduleOutlined className="text-4xl text-green-600" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="p-6">
              <Box className="flex items-center justify-between">
                <Box className="flex-1">
                  <Typography variant="h3" component="div" className="font-bold text-orange-600 mb-2">
                    {stats.priorityCounts.high || 0}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" className="font-semibold">
                    High Priority
                  </Typography>
                </Box>
                <Box className="p-4 rounded-2xl bg-orange-100 ml-4">
                  <TrendingUpOutlined className="text-4xl text-orange-600" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="p-6">
              <Box className="flex items-center justify-between">
                <Box className="flex-1">
                  <Typography variant="h3" component="div" className="font-bold text-red-600 mb-2">
                    {stats.priorityCounts.emergency || 0}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" className="font-semibold">
                    Emergency Cases
                  </Typography>
                </Box>
                <Box className="p-4 rounded-2xl bg-red-100 ml-4">
                  <AssessmentOutlined className="text-4xl text-red-600" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Export */}
      <Paper elevation={0} className="card p-6">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              placeholder="Search patients by name or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              fullWidth
              size="medium"
              variant="outlined"
              className="search-field"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="medium">
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Date Range"
                variant="outlined"
                className="search-field"
                startAdornment={<FilterListOutlined className="text-gray-400" />}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="medium">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
                variant="outlined"
                className="search-field"
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<DownloadOutlined />}
              onClick={exportToCSV}
              fullWidth
              className="btn-primary bg-green-600 hover:bg-green-700"
              size="large"
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box className="bg-gray-50 rounded-xl p-4">
        <Typography variant="h6" className="font-semibold text-gray-700">
          Results: {filteredPatients.length} completed checkups found
        </Typography>
      </Box>

      {/* Completed Patients Table */}
      <Paper elevation={0} className="table-container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell className="table-header">Patient Details</TableCell>
                <TableCell className="table-header">Contact</TableCell>
                <TableCell className="table-header">Priority</TableCell>
                <TableCell className="table-header">Appointment Time</TableCell>
                <TableCell className="table-header">Served At</TableCell>
                <TableCell className="table-header">Wait Time</TableCell>
                <TableCell className="table-header">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    <Box className="text-center">
                      <Typography variant="h6" className="text-gray-400 mb-2">
                        No completed checkups found
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        Try adjusting your search criteria or date range
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => {
                  const waitTime = calculateWaitTime(patient.appointmentTime, patient.servedAt)
                  return (
                    <TableRow key={patient.id} className="table-row">
                      <TableCell className="table-cell">
                        <Box>
                          <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-1">
                            {patient.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" className="text-sm">
                            {patient.age} years • {patient.gender}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell className="table-cell">
                        <Typography variant="body2" className="font-medium">{patient.contact}</Typography>
                      </TableCell>
                      
                      <TableCell className="table-cell">
                        <Chip
                          label={patient.priority}
                          className={`${getPriorityChipClass(patient.priority)} capitalize`}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell className="table-cell">
                        <Typography variant="body2" className="font-medium">
                          {new Date(patient.appointmentTime).toLocaleString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell className="table-cell">
                        <Typography variant="body2" className="font-medium">
                          {new Date(patient.servedAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell className="table-cell">
                        <Chip
                          label={`${waitTime} min`}
                          color={waitTime <= 15 ? 'success' : waitTime <= 30 ? 'warning' : 'error'}
                          size="small"
                          className="font-medium"
                        />
                      </TableCell>
                      
                      <TableCell className="table-cell">
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                          className="font-medium"
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Export Summary */}
      <Box className="bg-gray-50 rounded-xl p-6 text-center">
        <Typography variant="body2" color="textSecondary" className="mb-2 font-medium">
          Report generated on {new Date().toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Filtered by: {dateFilter} • Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}
        </Typography>
      </Box>
    </Box>
  )
}

export default Reports
