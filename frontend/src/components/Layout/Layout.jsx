import { Container, Box } from '@mui/material'
import Header from './Header'

const Layout = ({ children }) => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Header />
      <Container maxWidth="xl" className="py-8">
        {children}
      </Container>
    </Box>
  )
}

export default Layout
