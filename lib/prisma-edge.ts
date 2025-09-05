/**
 * Edge-compatible Prisma client for serverless functions
 * Handles connection pooling issues in Vercel deployments
 */

import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // In production, create a new client for each serverless function invocation
  prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
} else {
  // In development, use a global variable to prevent exhausting connection limit
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

// Utility function to safely execute database operations
export async function executeWithRetry<T>(
  operation: (client: PrismaClient) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation(prisma)
    } catch (error) {
      lastError = error as Error
      
      // Check if it's a connection-related error
      if (
        error instanceof Error && 
        (error.message.includes('prepared statement') || 
         error.message.includes('ConnectorError') ||
         error.message.includes('connection'))
      ) {
        console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error.message)
        
        // Disconnect and wait before retry
        await prisma.$disconnect()
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        
        if (attempt < maxRetries) {
          continue
        }
      }
      
      // If it's not a connection error or we've exhausted retries, throw
      throw error
    }
  }

  throw lastError!
}
