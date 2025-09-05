import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Singleton pattern for Prisma client
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), create a fresh client for each invocation
  // This prevents prepared statement conflicts in serverless functions
  prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
} else {
  // In development, reuse the connection
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
  }
  prisma = global.__prisma
}

export { prisma }

// Utility function for database operations with automatic cleanup
export async function withPrisma<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    const result = await operation(prisma)
    return result
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  } finally {
    // Only disconnect in production to prevent connection reuse issues
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect()
    }
  }
}
