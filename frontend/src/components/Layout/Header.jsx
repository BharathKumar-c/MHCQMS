import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Chip } from '@mui/material'
import { LogoutOutlined, DashboardOutlined, PeopleOutlined, QueueOutlined, AssessmentOutlined } from '@mui/icons-material'
import { logout } from '../../features/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlined /> },
    { label: 'Register Patient', path: '/register-patient', icon: <PeopleOutlined /> },
    { label: 'Queue Management', path: '/queue', icon: <QueueOutlined /> },
    { label: 'Reports', path: '/reports', icon: <AssessmentOutlined /> },
  ]

  return (
    <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <Toolbar className="px-4 md:px-6">
        <Typography variant="h5" component="div" className="flex-1 font-bold text-white tracking-wide">
          MHCQMS
        </Typography>
        
        <Box className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
                className={`nav-link ${isActive ? 'active' : ''}`}
                sx={{
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Button>
            )
          })}
        </Box>

        <Box className="flex items-center space-x-4 ml-4">
          <Chip
            label={`Welcome, ${user?.name || 'Staff'}`}
            className="bg-white/20 text-white border-white/30"
            size="small"
          />
          <IconButton
            color="inherit"
            onClick={handleLogout}
            className="text-white hover:bg-white/20 transition-all duration-200"
            size="large"
          >
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
