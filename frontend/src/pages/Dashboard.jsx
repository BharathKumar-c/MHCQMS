import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress 
} from '@mui/material'
import { 
  PeopleOutline, 
  CheckCircleOutline, 
  AccessTime,
  TrendingUp 
} from '@mui/icons-material'
import { fetchPatients, fetchCompletedPatients, updateStats } from '../features/patientSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { patients, completedPatients, stats, isLoading } = useSelector((state) => state.patients)

  useEffect(() => {
    dispatch(fetchPatients())
    dispatch(fetchCompletedPatients())
  }, [dispatch])

  useEffect(() => {
    if (patients.length > 0 || completedPatients.length > 0) {
      dispatch(updateStats())
    }
  }, [patients, completedPatients, dispatch])

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card className="stat-card h-full">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between">
          <Box className="flex-1">
            <Typography variant="h3" component="div" className={`font-bold ${color} mb-2`}>
              {value}
            </Typography>
            <Typography variant="h6" color="textSecondary" className="font-semibold mb-1">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" className="text-sm">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box className={`p-4 rounded-2xl ${color.replace('text-', 'bg-').replace('-600', '-100')} ml-4`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box className="space-y-8">
      <Box className="text-center md:text-left">
        <Typography variant="h3" component="h1" className="font-bold text-gray-800 mb-3">
          Dashboard Overview
        </Typography>
        <Typography variant="h6" className="text-gray-600 font-normal">
          Monitor your healthcare queue management system
        </Typography>
      </Box>

      <Grid container spacing={4} className="section-spacing">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Patients in Queue"
            value={stats.totalInQueue}
            icon={<PeopleOutline className="text-4xl text-blue-600" />}
            color="text-blue-600"
            subtitle="Currently waiting"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Patients Served"
            value={stats.totalServed}
            icon={<CheckCircleOutline className="text-4xl text-green-600" />}
            color="text-green-600"
            subtitle="Today's total"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Wait Time"
            value={`${stats.averageWaitTime} min`}
            icon={<AccessTime className="text-4xl text-orange-600" />}
            color="text-orange-600"
            subtitle="Based on completed"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Efficiency Rate"
            value="85%"
            icon={<TrendingUp className="text-4xl text-purple-600" />}
            color="text-purple-600"
            subtitle="Queue management"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="card h-full">
            <CardContent className="p-6">
              <Typography variant="h5" className="font-semibold mb-6 text-gray-800">
                Recent Activity
              </Typography>
              <Box className="space-y-4">
                {patients.slice(0, 5).map((patient) => (
                  <Box key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <Box className="flex-1">
                      <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="text-sm">
                        Added to queue at {new Date(patient.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.priority === 'high' 
                          ? 'chip-high' 
                          : 'chip-normal'
                      }`}
                    >
                      {patient.priority} priority
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="card h-full">
            <CardContent className="p-6">
              <Typography variant="h5" className="font-semibold mb-6 text-gray-800">
                Quick Actions
              </Typography>
              <Box className="space-y-4">
                <Box className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200">
                  <Typography variant="body1" className="font-semibold text-blue-800 mb-2">
                    Register New Patient
                  </Typography>
                  <Typography variant="body2" className="text-blue-700">
                    Add patients to the queue quickly
                  </Typography>
                </Box>
                
                <Box className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-shadow duration-200">
                  <Typography variant="body1" className="font-semibold text-green-800 mb-2">
                    Manage Queue
                  </Typography>
                  <Typography variant="body2" className="text-green-700">
                    View and update patient status
                  </Typography>
                </Box>
                
                <Box className="p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 hover:shadow-md transition-shadow duration-200">
                  <Typography variant="body1" className="font-semibold text-purple-800 mb-2">
                    Generate Reports
                  </Typography>
                  <Typography variant="body2" className="text-purple-700">
                    Export daily statistics and reports
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
