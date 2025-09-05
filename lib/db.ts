/**
 * Database configuration optimized for Vercel serverless deployment
 * Fixes prepared statement conflicts and connection pooling issues
 */

import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance in development
declare global {
  var __globalPrisma: PrismaClient | undefined
}

// Create a new Prisma client instance with optimal settings for serverless
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// Get or create Prisma client based on environment
function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    // Always create fresh client in production to avoid connection conflicts
    return createPrismaClient()
  } else {
    // Reuse client in development
    if (!globalThis.__globalPrisma) {
      globalThis.__globalPrisma = createPrismaClient()
    }
    return globalThis.__globalPrisma
  }
}

// Main database operation wrapper
export async function executeQuery<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const client = getPrismaClient()
  
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout after 30s')), 30000)
    })
    
    const result = await Promise.race([
      operation(client),
      timeoutPromise
    ])
    
    return result
  } catch (error) {
    // Enhanced error handling for Prisma connection issues
    if (error instanceof Error) {
      if (error.message.includes('prepared statement') || 
          error.message.includes('ConnectorError') ||
          error.message.includes('connection')) {
        console.error('Database connection error:', error.message)
        // In case of connection errors, throw a more user-friendly error
        throw new Error('Database connection issue. Please try again in a moment.')
      }
    }
    
    console.error('Database operation failed:', error)
    throw error
  } finally {
    // Critical: Always disconnect in production to prevent connection reuse
    if (process.env.NODE_ENV === 'production') {
      try {
        await client.$disconnect()
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError)
      }
    }
  }
}

// Export a singleton for development or fresh instance for production
export const db = getPrismaClient()

// Alias for backwards compatibility
export { db as prisma }
