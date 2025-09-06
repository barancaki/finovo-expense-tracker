#!/usr/bin/env node

/**
 * Cleanup script for expired free trial users
 * This script should be run as a cron job to automatically delete
 * user data when their free trial expires
 * 
 * Usage: node scripts/cleanup-expired-trials.js
 * Cron example: 0 2 * * * (run daily at 2 AM)
 */

const https = require('https')
const http = require('http')

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const CLEANUP_ENDPOINT = '/api/subscription/cleanup'

async function runCleanup() {
  try {
    console.log('Starting cleanup of expired free trial users...')
    
    const url = new URL(CLEANUP_ENDPOINT, API_URL)
    const client = url.protocol === 'https:' ? https : http
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here
        // 'Authorization': `Bearer ${process.env.CLEANUP_API_KEY}`
      }
    }
    
    const req = client.request(url, options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data)
          console.log('Cleanup completed successfully:')
          console.log(`- Processed ${result.processedUsers} users`)
          console.log(`- Results:`, result.results)
        } else {
          console.error('Cleanup failed:', res.statusCode, data)
          process.exit(1)
        }
      })
    })
    
    req.on('error', (error) => {
      console.error('Request failed:', error)
      process.exit(1)
    })
    
    req.end()
    
  } catch (error) {
    console.error('Cleanup script error:', error)
    process.exit(1)
  }
}

// Run the cleanup
runCleanup()
