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
  ScheduleOutline,
  TrendingUpOutline 
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
    <Card className="h-full">
      <CardContent>
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="h4" component="div" className={`font-bold ${color}`}>
              {value}
            </Typography>
            <Typography variant="h6" color="textSecondary" className="mb-2">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
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
    <Box>
      <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-6">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} className="mb-8">
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
            icon={<ScheduleOutline className="text-4xl text-orange-600" />}
            color="text-orange-600"
            subtitle="Based on completed"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Efficiency Rate"
            value="85%"
            icon={<TrendingUpOutline className="text-4xl text-purple-600" />}
            color="text-purple-600"
            subtitle="Queue management"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Recent Activity
              </Typography>
              <Box className="space-y-3">
                {patients.slice(0, 5).map((patient) => (
                  <Box key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Box>
                      <Typography variant="body1" className="font-medium">
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Added to queue at {new Date(patient.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      className={`px-2 py-1 rounded-full text-xs ${
                        patient.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
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
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Quick Actions
              </Typography>
              <Box className="space-y-3">
                <Box className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <Typography variant="body1" className="font-medium text-blue-800 mb-1">
                    Register New Patient
                  </Typography>
                  <Typography variant="body2" className="text-blue-600">
                    Add patients to the queue quickly
                  </Typography>
                </Box>
                
                <Box className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <Typography variant="body1" className="font-medium text-green-800 mb-1">
                    Manage Queue
                  </Typography>
                  <Typography variant="body2" className="text-green-600">
                    View and update patient status
                  </Typography>
                </Box>
                
                <Box className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <Typography variant="body1" className="font-medium text-purple-800 mb-1">
                    Generate Reports
                  </Typography>
                  <Typography variant="body2" className="text-purple-600">
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
