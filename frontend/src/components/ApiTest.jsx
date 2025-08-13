import { useState } from 'react'
import { Box, Button, Typography, Paper, Alert } from '@mui/material'
import { PlayArrow, CheckCircle, Error } from '@mui/icons-material'
import api from '../services/api'

const ApiTest = () => {
  const [testResults, setTestResults] = useState({})
  const [isTesting, setIsTesting] = useState(false)

  const runApiTest = async (endpoint, method = 'GET', data = null) => {
    setIsTesting(true)
    const testKey = `${method}_${endpoint}`
    
    try {
      console.log(`Testing ${method} ${endpoint}...`)
      
      let response
      if (method === 'GET') {
        response = await api.get(endpoint)
      } else if (method === 'POST') {
        response = await api.post(endpoint, data)
      }
      
      console.log(`Test ${testKey} successful:`, response)
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          success: true,
          status: response.status,
          data: response.data,
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error) {
      console.error(`Test ${testKey} failed:`, error)
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          success: false,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setIsTesting(false)
    }
  }

  const testEndpoints = [
    { endpoint: '/health', method: 'GET', description: 'Health Check (Root)' },
    { endpoint: '/', method: 'GET', description: 'Root Endpoint' },
    { endpoint: '/api/v1', method: 'GET', description: 'API Info' },
    { endpoint: '/auth/login', method: 'POST', description: 'Auth Login (will fail without credentials)', data: { username: 'test', password: 'test' } },
    { endpoint: '/patients', method: 'GET', description: 'Get Patients' },
    { endpoint: '/queue', method: 'GET', description: 'Get Queue Status' },
  ]

  const clearResults = () => {
    setTestResults({})
  }

  return (
    <Box className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold text-slate-800 mb-4">
        API Connection Test
      </Typography>
      
      <Paper className="p-6">
        <Typography variant="h6" className="mb-4">
          Test Backend Connectivity
        </Typography>
        
        <Box className="space-y-4">
          {testEndpoints.map((test, index) => (
            <Box key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <Box>
                <Typography variant="body1" className="font-medium">
                  {test.description}
                </Typography>
                <Typography variant="body2" className="text-slate-600">
                  {test.method} {test.endpoint}
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                onClick={() => runApiTest(test.endpoint, test.method, test.data)}
                disabled={isTesting}
                startIcon={<PlayArrow />}
                className="btn-secondary"
              >
                Test
              </Button>
            </Box>
          ))}
        </Box>
        
        <Box className="mt-6 flex space-x-4">
          <Button
            variant="outlined"
            onClick={clearResults}
            className="btn-secondary"
          >
            Clear Results
          </Button>
          
          <Button
            variant="contained"
            onClick={() => testEndpoints.forEach(test => runApiTest(test.endpoint, test.method, test.data))}
            disabled={isTesting}
            className="btn-primary"
          >
            Run All Tests
          </Button>
        </Box>
      </Paper>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4">
            Test Results
          </Typography>
          
          <Box className="space-y-4">
            {Object.entries(testResults).map(([key, result]) => (
              <Box key={key} className="border rounded-lg p-4">
                <Box className="flex items-center space-x-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="text-green-600" />
                  ) : (
                    <Error className="text-red-600" />
                  )}
                  <Typography variant="body1" className="font-medium">
                    {key}
                  </Typography>
                  <Typography variant="body2" className="text-slate-500">
                    {result.timestamp}
                  </Typography>
                </Box>
                
                {result.success ? (
                  <Alert severity="success" className="mb-2">
                    Success - Status: {result.status}
                  </Alert>
                ) : (
                  <Alert severity="error" className="mb-2">
                    Failed - {result.error}
                    {result.status && ` (Status: ${result.status})`}
                  </Alert>
                )}
                
                {result.data && (
                  <Box className="mt-2">
                    <Typography variant="body2" className="font-medium mb-1">
                      Response Data:
                    </Typography>
                    <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
      
      {/* Debug Information */}
      <Paper className="p-6">
        <Typography variant="h6" className="mb-4">
          Debug Information
        </Typography>
        
        <Box className="space-y-2 text-sm">
          <Typography variant="body2">
            <strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}
          </Typography>
          <Typography variant="body2">
            <strong>Environment:</strong> {import.meta.env.MODE}
          </Typography>
          <Typography variant="body2">
            <strong>Debug Mode:</strong> {import.meta.env.VITE_DEBUG || 'false'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default ApiTest
