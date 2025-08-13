import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Chip,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material'
import { 
  LogoutOutlined, 
  DashboardOutlined, 
  PeopleOutlined, 
  QueueOutlined, 
  AssessmentOutlined,
  Menu as MenuIcon,
  PersonOutline
} from '@mui/icons-material'
import { logout } from '../../features/authSlice'

const Header = ({ onMobileMenuToggle }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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
    <AppBar 
      position="static" 
      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-strong"
      elevation={0}
    >
      <Toolbar className="px-4 md:px-6">
        {/* Logo and Title */}
        <Typography 
          variant="h5" 
          component="div" 
          className="flex-1 font-bold text-white tracking-wide flex items-center"
        >
          <Box className="w-8 h-8 bg-white/20 rounded-lg mr-3 flex items-center justify-center">
            <Typography variant="h6" className="text-white font-black">M</Typography>
          </Box>
          MHCQMS
        </Typography>
        
        {/* Desktop Navigation */}
        {!isMobile && (
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
        )}

        {/* User Info and Actions */}
        <Box className="flex items-center space-x-4 ml-4">
          {/* User Welcome Chip */}
          <Chip
            avatar={
              <Avatar className="w-6 h-6 bg-white/20 text-white text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
              </Avatar>
            }
            label={`Welcome, ${user?.name || 'Staff'}`}
            className="bg-white/20 text-white border-white/30 hidden sm:flex"
            size="medium"
            sx={{
              '& .MuiChip-label': {
                color: 'white',
                fontWeight: 500,
              }
            }}
          />

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={onMobileMenuToggle}
              className="text-white hover:bg-white/20 transition-all duration-200"
              size="large"
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logout Button */}
          <IconButton
            color="inherit"
            onClick={handleLogout}
            className="text-white hover:bg-white/20 transition-all duration-200 focus-ring"
            size="large"
            title="Logout"
          >
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
