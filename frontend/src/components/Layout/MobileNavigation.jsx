import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { 
  DashboardOutlined, 
  PeopleOutlined, 
  QueueOutlined, 
  AssessmentOutlined,
  HomeOutlined
} from '@mui/icons-material'

const MobileNavigation = ({ open, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <HomeOutlined /> },
    { label: 'Patients', path: '/register-patient', icon: <PeopleOutlined /> },
    { label: 'Queue', path: '/queue', icon: <QueueOutlined /> },
    { label: 'Reports', path: '/reports', icon: <AssessmentOutlined /> },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <Paper 
      elevation={8}
      className="mobile-nav"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' }
      }}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          handleNavigation(newValue)
        }}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '8px 0',
            '&.Mui-selected': {
              color: '#2563eb',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            fontWeight: 500,
            marginTop: '4px',
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
            className={location.pathname === item.path ? 'mobile-nav-item active' : 'mobile-nav-item'}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default MobileNavigation
