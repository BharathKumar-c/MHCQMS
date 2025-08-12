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
  CircularProgress 
} from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import { login, clearError } from '../features/authSlice'

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
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

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={0} className="card p-8 md:p-12">
          <Box className="text-center mb-10">
            <Box className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <LockOutlined className="text-5xl text-blue-600" />
            </Box>
            <Typography variant="h3" component="h1" className="font-bold text-gray-800 mb-3">
              MHCQMS Login
            </Typography>
            <Typography variant="h6" className="text-gray-600 font-normal">
              Sign in to access the patient queue management system
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              className="search-field"
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
              variant="outlined"
              size="large"
              className="search-field"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              className="btn-primary py-4 text-lg font-semibold"
            >
              {isLoading ? (
                <CircularProgress size={28} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Box className="mt-8 text-center">
            <Typography variant="body2" className="text-gray-500 font-medium">
              Demo Credentials: admin / password123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
