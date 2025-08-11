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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'error'
      case 'high': return 'warning'
      case 'normal': return 'primary'
      case 'low': return 'default'
      default: return 'default'
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
    <Container maxWidth="xl">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
          Reports & Analytics
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          View completed checkups and generate comprehensive reports
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" component="div" className="font-bold text-blue-600">
                    {stats.total}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Total Completed
                  </Typography>
                </Box>
                <CheckCircleOutlined className="text-4xl text-blue-600" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" component="div" className="font-bold text-green-600">
                    {stats.avgWaitTime}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Avg Wait Time (min)
                  </Typography>
                </Box>
                <ScheduleOutlined className="text-4xl text-green-600" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" component="div" className="font-bold text-orange-600">
                    {stats.priorityCounts.high || 0}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    High Priority
                  </Typography>
                </Box>
                <TrendingUpOutlined className="text-4xl text-orange-600" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" component="div" className="font-bold text-red-600">
                    {stats.priorityCounts.emergency || 0}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Emergency Cases
                  </Typography>
                </Box>
                <AssessmentOutlined className="text-4xl text-red-600" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Export */}
      <Paper elevation={2} className="p-4 mb-6">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
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
              fullWidth
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Date Range"
                startAdornment={<FilterListOutlined />}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
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
              className="bg-green-600 hover:bg-green-700"
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box className="mb-4">
        <Typography variant="h6" className="font-semibold text-gray-700">
          Results: {filteredPatients.length} completed checkups found
        </Typography>
      </Box>

      {/* Completed Patients Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">Patient Details</TableCell>
                <TableCell className="font-semibold">Contact</TableCell>
                <TableCell className="font-semibold">Priority</TableCell>
                <TableCell className="font-semibold">Appointment Time</TableCell>
                <TableCell className="font-semibold">Served At</TableCell>
                <TableCell className="font-semibold">Wait Time</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No completed checkups found for the selected criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => {
                  const waitTime = calculateWaitTime(patient.appointmentTime, patient.servedAt)
                  return (
                    <TableRow key={patient.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1" className="font-medium">
                            {patient.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {patient.age} years • {patient.gender}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">{patient.contact}</Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={patient.priority}
                          color={getPriorityColor(patient.priority)}
                          size="small"
                          className="capitalize"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(patient.appointmentTime).toLocaleString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(patient.servedAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={`${waitTime} min`}
                          color={waitTime <= 15 ? 'success' : waitTime <= 30 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
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
      <Box className="mt-6 text-center">
        <Typography variant="body2" color="textSecondary" className="mb-2">
          Report generated on {new Date().toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Filtered by: {dateFilter} • Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}
        </Typography>
      </Box>
    </Container>
  )
}

export default Reports
