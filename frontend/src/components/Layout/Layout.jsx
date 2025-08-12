import { Container, Box } from '@mui/material'
import Header from './Header'

const Layout = ({ children }) => {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <Container maxWidth="xl" className="py-8 px-4 md:px-6">
        <Box className="max-w-7xl mx-auto">
          {children}
        </Box>
      </Container>
    </Box>
  )
}

export default Layout
