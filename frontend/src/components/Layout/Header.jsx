import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material'
import { LogoutOutlined, DashboardOutlined, PeopleOutlined, QueueOutlined, AssessmentOutlined } from '@mui/icons-material'
import { logout } from '../../features/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    <AppBar position="static" className="bg-blue-600">
      <Toolbar>
        <Typography variant="h6" component="div" className="flex-1 font-bold">
          MHCQMS
        </Typography>
        
        <Box className="hidden md:flex space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              startIcon={item.icon}
              className="text-white hover:bg-blue-700"
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box className="flex items-center space-x-4">
          <Typography variant="body2" className="text-white">
            Welcome, {user?.name || 'Staff'}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            className="text-white hover:bg-blue-700"
          >
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
