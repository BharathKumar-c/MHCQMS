import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { login, clearError } from '../features/authSlice'

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)
  
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(login(credentials))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <Box className="absolute inset-0 overflow-hidden">
        <Box className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></Box>
        <Box className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl"></Box>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></Box>
      </Box>

      <Container maxWidth="sm" className="relative z-10">
        <Paper 
          elevation={0} 
          className="card p-8 md:p-12 backdrop-blur-md bg-white/90 border border-white/30"
        >
          {/* Header Section */}
          <Box className="text-center mb-10 fade-in">
            <Box className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6 shadow-lg">
              <LockOutlined className="text-5xl text-blue-600" />
            </Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h1" 
              className="font-bold text-slate-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              MHCQMS Login
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              className="text-slate-600 font-normal"
            >
              Sign in to access the patient queue management system
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              className="mb-6 slide-up"
              sx={{
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 slide-up" style={{ animationDelay: '200ms' }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              required
              variant="outlined"
              size="large"
              className="search-field focus-ring"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              required
              variant="outlined"
              size="large"
              className="search-field focus-ring"
              InputProps={{
                endAdornment: (
                  <Box className="flex items-center">
                    <Button
                      onClick={togglePasswordVisibility}
                      className="text-slate-500 hover:text-slate-700 p-1 min-w-0"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              className="btn-primary py-4 text-lg font-semibold focus-ring"
            >
              {isLoading ? (
                <Box className="flex items-center space-x-2">
                  <CircularProgress size={24} color="inherit" />
                  <span>Signing In...</span>
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <Box className="mt-8 text-center slide-up" style={{ animationDelay: '400ms' }}>
            <Box className="inline-block p-4 bg-slate-50/80 rounded-xl border border-slate-200/50">
              <Typography variant="body2" className="text-slate-600 font-medium mb-2">
                Demo Credentials
              </Typography>
              <Typography variant="body2" className="text-slate-500 font-mono">
                Username: admin
              </Typography>
              <Typography variant="body2" className="text-slate-500 font-mono">
                Password: password123
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box className="mt-8 text-center slide-up" style={{ animationDelay: '600ms' }}>
            <Typography variant="body2" className="text-slate-400">
              Healthcare Queue Management System
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
