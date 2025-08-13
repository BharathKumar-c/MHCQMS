// Simple API Integration Test Script
// Run this in the browser console to test API endpoints

const API_BASE = 'http://localhost:8000/api/v1';

// Test function to check API connectivity
async function testAPI() {
  console.log('🧪 Testing API Integration...');
  
  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing backend connectivity...');
    const response = await fetch(`${API_BASE}/patients`);
    if (response.status === 401) {
      console.log('✅ Backend is running (authentication required)');
    } else {
      console.log('⚠️ Backend response:', response.status);
    }
    
    // Test 2: Test patient registration endpoint
    console.log('2️⃣ Testing patient registration endpoint...');
    const testPatient = {
      first_name: "Test",
      last_name: "Patient",
      date_of_birth: "1990-01-01",
      gender: "male",
      phone: "+1234567890",
      checkup_type: "General Checkup",
      priority: 0,
      estimated_wait_time: 30
    };
    
    const regResponse = await fetch(`${API_BASE}/patients/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testPatient)
    });
    
    if (regResponse.status === 401) {
      console.log('✅ Patient registration endpoint exists (authentication required)');
    } else {
      console.log('⚠️ Patient registration response:', regResponse.status);
    }
    
    // Test 3: Test queue endpoints
    console.log('3️⃣ Testing queue endpoints...');
    const queueResponse = await fetch(`${API_BASE}/queue`);
    if (queueResponse.status === 401) {
      console.log('✅ Queue endpoints exist (authentication required)');
    } else {
      console.log('⚠️ Queue response:', queueResponse.status);
    }
    
    console.log('🎉 API Integration Test Complete!');
    console.log('📝 Note: 401 responses are expected without valid authentication');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    console.log('💡 Make sure the backend is running on http://localhost:8000');
  }
}

// Test function to check frontend services
function testFrontendServices() {
  console.log('🧪 Testing Frontend Services...');
  
  try {
    // Check if Redux store is configured
    if (window.store) {
      console.log('✅ Redux store is configured');
      console.log('📊 Store state:', window.store.getState());
    } else {
      console.log('❌ Redux store not found');
    }
    
    // Check if services are available
    if (window.api) {
      console.log('✅ API service is available');
    } else {
      console.log('❌ API service not found');
    }
    
    console.log('🎉 Frontend Services Test Complete!');
    
  } catch (error) {
    console.error('❌ Frontend Services Test Failed:', error);
  }
}

// Run tests
console.log('🚀 Starting MHCQMS API Integration Tests...');
testAPI();
testFrontendServices();

// Export functions for manual testing
window.testMHCQMSAPI = testAPI;
window.testMHCQMSFrontend = testFrontendServices;
