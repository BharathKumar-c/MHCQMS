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
    <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
      <Paper elevation={3} className="p-8 w-full">
        <Box className="text-center mb-8">
          <LockOutlined className="text-6xl text-blue-600 mb-4" />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            MHCQMS Login
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Sign in to access the patient queue management system
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            required
            variant="outlined"
            className="mb-4"
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
            className="mb-6"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-500">
            Demo Credentials: admin / password123
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login
