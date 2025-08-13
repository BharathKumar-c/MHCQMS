import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PatientRegistration from './pages/PatientRegistration'
import QueueManagement from './pages/QueueManagement'
import Reports from './pages/Reports'

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/register-patient"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientRegistration />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <Layout>
                <QueueManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Default redirects */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
        
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
