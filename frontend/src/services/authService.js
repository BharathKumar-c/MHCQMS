import api from './api'

export const authService = {
  async login(credentials) {
    try {
      console.log('Attempting login with credentials:', { username: credentials.username });
      
      // Convert credentials to form data format expected by OAuth2PasswordRequestForm
      const formData = new URLSearchParams()
      formData.append('username', credentials.username)
      formData.append('password', credentials.password)
      
      console.log('Sending login request to:', '/auth/login');
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 15000, // 15 second timeout for login
      })
      
      console.log('Login successful:', response.data);
      return response.data
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async logout() {
    try {
      console.log('Attempting logout');
      const response = await api.post('/auth/logout')
      console.log('Logout successful');
      return response.data
    } catch (error) {
      console.error('Logout failed:', error);
      // Don't throw error for logout - just log it
      return { success: true };
    }
  },

  async getCurrentUser() {
    try {
      console.log('Fetching current user');
      const response = await api.get('/auth/me')
      console.log('Current user fetched:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },
}
