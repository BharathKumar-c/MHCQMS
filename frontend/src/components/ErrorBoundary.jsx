import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <Paper elevation={0} className="card max-w-md text-center p-8">
            <Box className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl mb-6">
              <ErrorOutline className="text-4xl text-red-600" />
            </Box>
            
            <Typography variant="h4" component="h1" className="font-bold text-slate-800 mb-4">
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" className="text-slate-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </Typography>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleRetry}
              className="btn-primary"
              size="large"
            >
              Refresh Page
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box className="mt-6 p-4 bg-slate-100 rounded-lg text-left">
                <Typography variant="body2" className="font-mono text-xs text-slate-700">
                  <strong>Error:</strong> {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="body2" className="font-mono text-xs text-slate-700 mt-2">
                    <strong>Stack:</strong> {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
