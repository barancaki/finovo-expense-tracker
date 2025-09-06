#!/usr/bin/env node

/**
 * Simple script to make a user admin using raw SQL
 * Usage: node scripts/make-admin-simple.js <email>
 */

const { Client } = require('pg')

async function makeAdmin(email) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    console.log('Connecting to database...')
    await client.connect()
    console.log('✅ Connected to database')

    // Check if user exists
    console.log(`Looking for user: ${email}`)
    const userResult = await client.query(
      'SELECT id, name, email FROM "User" WHERE email = $1',
      [email]
    )

    if (userResult.rows.length === 0) {
      console.error(`❌ User with email ${email} not found`)
      
      // Show available users
      const allUsersResult = await client.query(
        'SELECT email, name FROM "User" LIMIT 10'
      )
      console.log('Available users:')
      allUsersResult.rows.forEach(u => 
        console.log(`  - ${u.email} (${u.name || 'No name'})`)
      )
      process.exit(1)
    }

    const user = userResult.rows[0]
    console.log(`✅ Found user: ${user.name || 'No name'} (${user.email})`)

    // Try to add isAdmin column if it doesn't exist
    try {
      await client.query('ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN DEFAULT false')
      console.log('✅ Added isAdmin column to User table')
    } catch (alterError) {
      if (alterError.code === '42701') {
        console.log('ℹ️  isAdmin column already exists')
      } else {
        throw alterError
      }
    }

    // Update user to be admin
    await client.query(
      'UPDATE "User" SET "isAdmin" = true WHERE email = $1',
      [email]
    )
    
    console.log(`✅ Successfully made ${email} an admin`)

  } catch (error) {
    console.error('❌ Error making user admin:', error.message)
    
    if (error.code === '42P01') {
      console.log('💡 User table does not exist. Please run the database setup first.')
    } else if (error.code === '42701') {
      console.log('ℹ️  Column already exists, continuing...')
    } else {
      console.log('Full error:', error)
    }
    process.exit(1)
  } finally {
    await client.end()
    console.log('Disconnected from database')
  }
}

const email = process.argv[2]

if (!email) {
  console.error('Usage: node scripts/make-admin-simple.js <email>')
  process.exit(1)
}

makeAdmin(email)
