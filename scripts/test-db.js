#!/usr/bin/env node

/**
 * Simple database connection test
 * Run this to verify your database connection is working
 */

const { PrismaClient } = require('@prisma/client')

async function testDatabase() {
  console.log('🔍 Testing database connection...')
  
  const prisma = new PrismaClient({
    log: ['error'],
  })

  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Test a simple query
    const userCount = await prisma.user.count()
    console.log(`📊 Found ${userCount} users in database`)

    const expenseCount = await prisma.expense.count()
    console.log(`💰 Found ${expenseCount} expenses in database`)

    console.log('🎉 Database test completed successfully!')
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  }
}

if (require.main === module) {
  testDatabase().catch(console.error)
}

module.exports = { testDatabase }
