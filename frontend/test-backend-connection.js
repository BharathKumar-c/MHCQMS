// Simple script to test backend connection
import http from 'http';
import https from 'https';

const API_URL = 'http://localhost:8000/health';

console.log('Testing backend connection...');
console.log('API URL:', API_URL);

function testConnection() {
  const url = new URL(API_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const req = client.request(url, { timeout: 5000 }, (res) => {
    console.log(`✅ Backend is accessible!`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response: ${data}`);
      process.exit(0);
    });
  });
  
  req.on('error', (error) => {
    console.error(`❌ Backend connection failed:`, error.message);
    console.log('\nPossible solutions:');
    console.log('1. Make sure the backend is running on port 8000');
    console.log('2. Check if there are any firewall issues');
    console.log('3. Verify the backend server is started');
    console.log('4. Check backend logs for any errors');
    process.exit(1);
  });
  
  req.on('timeout', () => {
    console.error('❌ Request timeout - backend may be slow or unresponsive');
    req.destroy();
    process.exit(1);
  });
  
  req.end();
}

testConnection();
