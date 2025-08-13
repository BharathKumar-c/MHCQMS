import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { 
  PeopleOutline, 
  CheckCircleOutline, 
  AccessTime,
  TrendingUp,
  Emergency,
  Speed,
  Schedule,
  QueueOutlined,
  AssessmentOutlined
} from '@mui/icons-material'
import { fetchPatients, fetchCompletedPatients, updateStats } from '../features/patientSlice'
import ApiTest from '../components/ApiTest'

const Dashboard = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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

  const StatCard = ({ title, value, icon, color, subtitle, gradient, delay = 0 }) => (
    <Grid item xs={12} sm={6} md={3} className="slide-up" style={{ animationDelay: `${delay}ms` }}>
      <Card className={`stat-card ${gradient} h-full group`}>
        <CardContent className="p-6">
          <Box className="flex items-center justify-between">
            <Box className="flex-1">
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                component="div" 
                className={`font-bold ${color} mb-2 transition-all duration-300 group-hover:scale-105`}
              >
                {value}
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                color="textSecondary" 
                className="font-semibold mb-1"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  className="text-sm opacity-80"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box 
              className={`p-4 rounded-2xl ${color.replace('text-', 'bg-').replace('-600', '-100')} 
                         ml-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )

  const QuickActionCard = ({ title, description, icon, gradient, onClick, delay = 0 }) => (
    <Box 
      className={`quick-action ${gradient} cursor-pointer`}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Box className="flex items-center space-x-4">
        <Box className="p-3 bg-white/50 rounded-xl">
          {icon}
        </Box>
        <Box className="flex-1">
          <Typography variant="h6" className="font-semibold mb-2">
            {title}
          </Typography>
          <Typography variant="body2" className="opacity-80">
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Box className="text-center">
          <CircularProgress size={60} className="mb-4" />
          <Typography variant="h6" color="textSecondary">
            Loading dashboard data...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="space-y-8 fade-in">
      {/* Header Section */}
      <Box className="text-center md:text-left">
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          className="font-bold text-slate-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Dashboard Overview
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          className="text-slate-600 font-normal"
        >
          Monitor your healthcare queue management system in real-time
        </Typography>
      </Box>

      {/* API Test Component - Temporary for debugging */}
      <ApiTest />

      {/* Stats Grid */}
      <Grid container spacing={4} className="section-spacing">
        <StatCard
          title="Patients in Queue"
          value={stats.totalInQueue || 0}
          icon={<PeopleOutline className="text-4xl text-blue-600" />}
          color="text-blue-600"
          subtitle="Currently waiting"
          gradient="stat-card-normal"
          delay={100}
        />
        
        <StatCard
          title="Patients Served"
          value={stats.totalServed || 0}
          icon={<CheckCircleOutline className="text-4xl text-emerald-600" />}
          color="text-emerald-600"
          subtitle="Today's total"
          gradient="stat-card-success"
          delay={200}
        />
        
        <StatCard
          title="Average Wait Time"
          value={`${stats.averageWaitTime || 0} min`}
          icon={<AccessTime className="text-4xl text-orange-600" />}
          color="text-orange-600"
          subtitle="Based on completed"
          gradient="stat-card-urgent"
          delay={300}
        />
        
        <StatCard
          title="Efficiency Rate"
          value="85%"
          icon={<TrendingUp className="text-4xl text-purple-600" />}
          color="text-purple-600"
          subtitle="Queue management"
          gradient="stat-card-normal"
          delay={400}
        />
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Recent Activity */}
        <Grid item xs={12} lg={7}>
          <Card className="card h-full slide-up" style={{ animationDelay: '500ms' }}>
            <CardContent className="p-6">
              <Box className="flex items-center justify-between mb-6">
                <Typography variant="h5" className="font-semibold text-slate-800">
                  Recent Activity
                </Typography>
                <Box className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></Box>
              </Box>
              
              <Box className="space-y-4">
                {patients.slice(0, 5).map((patient, index) => (
                  <Box 
                    key={patient.id} 
                    className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 
                             transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <Box className="flex-1">
                      <Typography variant="body1" className="font-semibold text-slate-800 mb-1">
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="text-sm">
                        Added to queue at {new Date(patient.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      className={`chip ${
                        patient.priority === 'high' 
                          ? 'chip-high' 
                          : patient.priority === 'emergency'
                          ? 'chip-emergency'
                          : 'chip-normal'
                      }`}
                    >
                      {patient.priority} priority
                    </Typography>
                  </Box>
                ))}
                
                {patients.length === 0 && (
                  <Box className="text-center py-8 text-slate-500">
                    <PeopleOutline className="text-4xl mb-2 opacity-50" />
                    <Typography variant="body1">No patients in queue</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={5}>
          <Card className="card h-full slide-up" style={{ animationDelay: '600ms' }}>
            <CardContent className="p-6">
              <Box className="flex items-center justify-between mb-6">
                <Typography variant="h5" className="font-semibold text-slate-800">
                  Quick Actions
                </Typography>
                <Box className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></Box>
              </Box>
              
              <Box className="space-y-4">
                <QuickActionCard
                  title="Register New Patient"
                  description="Add patients to the queue quickly"
                  icon={<PeopleOutline className="text-2xl text-blue-600" />}
                  gradient="quick-action"
                  onClick={() => window.location.href = '/register-patient'}
                  delay={700}
                />
                
                <QuickActionCard
                  title="Manage Queue"
                  description="View and update patient status"
                  icon={<QueueOutlined className="text-2xl text-emerald-600" />}
                  gradient="quick-action-success"
                  onClick={() => window.location.href = '/queue'}
                  delay={800}
                />
                
                <QuickActionCard
                  title="Generate Reports"
                  description="Export daily statistics and reports"
                  icon={<AssessmentOutlined className="text-2xl text-purple-600" />}
                  gradient="quick-action-purple"
                  onClick={() => window.location.href = '/reports'}
                  delay={900}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats Row */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="glass-card slide-up" style={{ animationDelay: '1000ms' }}>
            <CardContent className="p-6">
              <Box className="flex items-center space-x-4">
                <Box className="p-4 bg-blue-100 rounded-2xl">
                  <Speed className="text-3xl text-blue-600" />
                </Box>
                <Box>
                  <Typography variant="h4" className="font-bold text-slate-800 mb-1">
                    {stats.averageWaitTime || 0} min
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Average processing time per patient
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card className="glass-card slide-up" style={{ animationDelay: '1100ms' }}>
            <CardContent className="p-6">
              <Box className="flex items-center space-x-4">
                <Box className="p-4 bg-emerald-100 rounded-2xl">
                  <Schedule className="text-3xl text-emerald-600" />
                </Box>
                <Box>
                  <Typography variant="h4" className="font-bold text-slate-800 mb-1">
                    {new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Current date and time
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
