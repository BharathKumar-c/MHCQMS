import { useState } from 'react'
import { Container, Box, useMediaQuery, useTheme } from '@mui/material'
import Header from './Header'
import MobileNavigation from './MobileNavigation'

const Layout = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <Header onMobileMenuToggle={() => setMobileNavOpen(!mobileNavOpen)} />
      
      <Container maxWidth="xl" className="py-8 px-4 md:px-6 pb-24 md:pb-8">
        <Box className="max-w-7xl mx-auto">
          <Box className="fade-in">
            {children}
          </Box>
        </Box>
      </Container>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation 
          open={mobileNavOpen} 
          onClose={() => setMobileNavOpen(false)} 
        />
      )}
    </Box>
  )
}

export default Layout
