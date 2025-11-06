#!/usr/bin/env node
/**
 * MERN Task Manager - Complete Diagnostic & Testing Script
 * Tests: MongoDB, Backend API, Frontend Connection
 */

const http = require('http');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testConnection(url, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MERN-Diagnostic'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = client.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({
          success: true,
          status: res.statusCode,
          statusText: res.statusMessage,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runDiagnostics() {
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║  MERN TASK MANAGER - COMPLETE DIAGNOSTIC REPORT  ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝\n', 'cyan');

  // Test 1: Backend Health
  log('TEST 1: Backend Server Health', 'blue');
  log('─'.repeat(50), 'blue');
  const healthResponse = await testConnection('http://localhost:5000/health');
  if (healthResponse.success && healthResponse.status === 200) {
    log('✅ Backend server is running on port 5000', 'green');
    try {
      const data = JSON.parse(healthResponse.data);
      log(`   Status: ${data.status}`, 'green');
      log(`   Timestamp: ${data.timestamp}`, 'green');
    } catch (e) {
      log(`   Response: ${healthResponse.data}`, 'green');
    }
  } else {
    log(`❌ Backend server is NOT running`, 'red');
    log(`   Error: ${healthResponse.error}`, 'red');
    log(`   Fix: Run 'npm run dev' in the backend folder`, 'yellow');
  }

  // Test 2: Backend Root
  log('\nTEST 2: Backend Root API', 'blue');
  log('─'.repeat(50), 'blue');
  const apiResponse = await testConnection('http://localhost:5000/');
  if (apiResponse.success && apiResponse.status === 200) {
    log('✅ Backend API is accessible', 'green');
    try {
      const data = JSON.parse(apiResponse.data);
      log(`   Message: ${data.message}`, 'green');
    } catch (e) {
      log(`   Response: ${apiResponse.data}`, 'green');
    }
  } else {
    log(`❌ Backend API is NOT accessible`, 'red');
    log(`   Error: ${apiResponse.error}`, 'red');
  }

  // Test 3: User Registration
  log('\nTEST 3: User Registration API', 'blue');
  log('─'.repeat(50), 'blue');
  const testEmail = `test_${Date.now()}@test.com`;
  const registerData = {
    name: 'Test User',
    email: testEmail,
    password: 'TestPass123!'
  };
  
  const registerResponse = await testConnection(
    'http://localhost:5000/api/auth/register',
    'POST',
    registerData
  );
  
  if (registerResponse.success) {
    try {
      const data = JSON.parse(registerResponse.data);
      if (data.token && data.user) {
        log('✅ User registration works!', 'green');
        log(`   Name: ${data.user.name}`, 'green');
        log(`   Email: ${data.user.email}`, 'green');
        log(`   Token received: ${data.token.substring(0, 20)}...`, 'green');
        
        // Test 4: User Login
        log('\nTEST 4: User Login API', 'blue');
        log('─'.repeat(50), 'blue');
        const loginData = {
          email: testEmail,
          password: 'TestPass123!'
        };
        
        const loginResponse = await testConnection(
          'http://localhost:5000/api/auth/login',
          'POST',
          loginData
        );
        
        if (loginResponse.success) {
          const loginData = JSON.parse(loginResponse.data);
          if (loginData.token && loginData.user) {
            log('✅ User login works!', 'green');
            log(`   Email: ${loginData.user.email}`, 'green');
            log(`   Token received: ${loginData.token.substring(0, 20)}...`, 'green');
          } else {
            log('❌ Login failed - no token in response', 'red');
            log(`   Response: ${loginResponse.data}`, 'yellow');
          }
        } else {
          log('❌ Login request failed', 'red');
          log(`   Error: ${loginResponse.error}`, 'red');
        }
      } else {
        log('❌ Registration failed - no token/user in response', 'red');
        log(`   Response: ${registerResponse.data}`, 'yellow');
      }
    } catch (e) {
      log('❌ Registration response parsing error', 'red');
      log(`   Response: ${registerResponse.data}`, 'yellow');
      log(`   Error: ${e.message}`, 'red');
    }
  } else {
    log('❌ Registration request failed', 'red');
    log(`   Error: ${registerResponse.error}`, 'red');
  }

  // Summary
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║  DIAGNOSTIC SUMMARY  ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝\n', 'cyan');

  log('✅ If all tests passed:', 'green');
  log('   1. Open browser at http://localhost:3000', 'green');
  log('   2. Go to Register page', 'green');
  log('   3. Fill in form and register', 'green');
  log('   4. You should be logged in automatically', 'green');

  log('\n❌ If tests failed:', 'red');
  log('   1. Ensure MongoDB is running: mongosh', 'red');
  log('   2. Ensure backend is running: npm run dev (in backend folder)', 'red');
  log('   3. Check .env file has correct MONGODB_URI', 'red');
  log('   4. Run: node diagnostic.js again to test', 'red');

  process.exit(0);
}

// Run diagnostics
runDiagnostics().catch(err => {
  log(`Fatal error: ${err.message}`, 'red');
  process.exit(1);
});
