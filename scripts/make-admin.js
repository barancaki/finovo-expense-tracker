#!/usr/bin/env node

/**
 * Script to make a user admin
 * Usage: node scripts/make-admin.js <email>
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function makeAdmin(email) {
  try {
    console.log('Connecting to database...')
    
    // Test connection first
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // First check if user exists
    console.log(`Looking for user: ${email}`)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      console.log('Available users:')
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true }
      })
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.name || 'No name'})`))
      process.exit(1)
    }

    console.log(`✅ Found user: ${user.name || 'No name'} (${user.email})`)

    // Try to update isAdmin field (will fail if column doesn't exist)
    try {
      await prisma.user.update({
        where: { email },
        data: { isAdmin: true }
      })
      console.log(`✅ Successfully made ${email} an admin`)
    } catch (updateError) {
      if (updateError.code === 'P2022') {
        console.error(`❌ Database schema not updated. Please run the following SQL in Supabase:`)
        console.log(`
-- Add isAdmin column to User table
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN DEFAULT false;

-- Create SubscriptionRequest table
CREATE TABLE "SubscriptionRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "requestedType" "SubscriptionType" NOT NULL,
  "status" "RequestStatus" DEFAULT 'PENDING',
  "reason" TEXT,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create RequestStatus enum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Add indexes
CREATE INDEX "SubscriptionRequest_userId_idx" ON "SubscriptionRequest"("userId");
CREATE INDEX "SubscriptionRequest_status_idx" ON "SubscriptionRequest"("status");
        `)
        console.log(`After running the SQL, run: npx prisma generate`)
      } else {
        throw updateError
      }
    }
  } catch (error) {
    console.error('❌ Error making user admin:', error.message)
    if (error.code === '42P05') {
      console.log('💡 This error suggests a connection issue. Try:')
      console.log('   1. Restart your development server')
      console.log('   2. Run: npx prisma generate')
      console.log('   3. Try the command again')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('Disconnected from database')
  }
}

const email = process.argv[2]

if (!email) {
  console.error('Usage: node scripts/make-admin.js <email>')
  process.exit(1)
}

makeAdmin(email)
