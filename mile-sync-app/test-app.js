#!/usr/bin/env node

const http = require('http');

console.log('🧪 MileSync Application Test Suite');
console.log('=====================================');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const requestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testHomePage() {
  console.log('\n🏠 Testing Home Page...');
  try {
    const response = await makeRequest('/');
    if (response.status === 200) {
      console.log('✅ Home page loads successfully');
      return true;
    } else {
      console.log('❌ Home page failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Home page error:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing Login API...');
  try {
    const response = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'demo@milesync.com',
        password: 'demo123'
      }
    });
    
    if (response.status === 200 && response.data.data && response.data.data.token) {
      console.log('✅ Login successful - token received');
      return response.data.data.token;
    } else {
      console.log('❌ Login failed:', response.status, response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

async function testTripsAPI(token) {
  console.log('\n🚗 Testing Trips API...');
  try {
    const response = await makeRequest('/api/mileage/trips', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 200) {
      console.log('✅ Trips API working - found', response.data.data?.length || 0, 'trips');
      return true;
    } else {
      console.log('❌ Trips API failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Trips API error:', error.message);
    return false;
  }
}

async function testGapsAPI(token) {
  console.log('\n🔍 Testing Gaps API...');
  try {
    const response = await makeRequest('/api/mileage/gaps', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 200) {
      console.log('✅ Gaps API working - found', response.data.data?.length || 0, 'gaps');
      return true;
    } else {
      console.log('❌ Gaps API failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Gaps API error:', error.message);
    return false;
  }
}

async function testRegister() {
  console.log('\n📝 Testing Registration API...');
  try {
    const response = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'test123'
      }
    });
    
    if (response.status === 200 && response.data.data && response.data.data.token) {
      console.log('✅ Registration successful');
      return true;
    } else {
      console.log('❌ Registration failed:', response.status, response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('⏳ Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const results = {
    homePage: false,
    login: false,
    trips: false,
    gaps: false,
    register: false
  };
  
  // Test home page
  results.homePage = await testHomePage();
  
  // Test login
  const token = await testLogin();
  results.login = !!token;
  
  if (token) {
    // Test authenticated endpoints
    results.trips = await testTripsAPI(token);
    results.gaps = await testGapsAPI(token);
  }
  
  // Test registration
  results.register = await testRegister();
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log('Home Page:', results.homePage ? '✅' : '❌');
  console.log('Login API:', results.login ? '✅' : '❌');
  console.log('Trips API:', results.trips ? '✅' : '❌');
  console.log('Gaps API:', results.gaps ? '✅' : '❌');
  console.log('Register API:', results.register ? '✅' : '❌');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Application is ready for production!');
  } else {
    console.log('⚠️  Some tests failed. Check the server logs.');
  }
}

runTests().catch(console.error);
