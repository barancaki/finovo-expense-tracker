#!/usr/bin/env node

/**
 * Quick deployment health check script
 * Run this to verify your deployment is working correctly
 */

const https = require('https');

const DEPLOYMENT_URL = process.env.VERCEL_URL || process.env.DEPLOYMENT_URL || 'your-app-url.vercel.app';

async function checkEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const url = `https://${DEPLOYMENT_URL}${path}`;
    console.log(`Checking: ${url}`);
    
    const req = https.get(url, (res) => {
      console.log(`Status: ${res.statusCode} (expected: ${expectedStatus})`);
      
      if (res.statusCode === expectedStatus || res.statusCode === 401) {
        console.log('✅ Endpoint is reachable');
        resolve(true);
      } else {
        console.log('❌ Unexpected status code');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Request timeout');
      req.destroy();
      resolve(false);
    });
  });
}

async function runHealthCheck() {
  console.log('🚀 Running deployment health check...\n');
  
  const checks = [
    { path: '/', name: 'Landing page' },
    { path: '/api/auth/signin', name: 'Auth API' },
    { path: '/api/expenses', name: 'Expenses API (should return 401)' },
    { path: '/api/expenses/stats', name: 'Stats API (should return 401)' },
  ];
  
  let passed = 0;
  
  for (const check of checks) {
    console.log(`\n📋 ${check.name}`);
    const success = await checkEndpoint(check.path);
    if (success) passed++;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Health check complete: ${passed}/${checks.length} checks passed`);
  
  if (passed === checks.length) {
    console.log('🎉 All systems operational!');
    process.exit(0);
  } else {
    console.log('⚠️  Some checks failed. Please review your deployment.');
    process.exit(1);
  }
}

if (require.main === module) {
  runHealthCheck().catch(console.error);
}

module.exports = { checkEndpoint, runHealthCheck };
