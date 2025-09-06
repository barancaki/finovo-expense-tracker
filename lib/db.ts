/**
 * Unified database configuration for Finovo
 * Handles both development and production (Vercel) environments
 */

import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Create a new Prisma client instance
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

// Get Prisma client - singleton in development, fresh in production
function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), create a fresh client for each operation
    return createPrismaClient()
  } else {
    // In development, reuse the connection
    if (!globalThis.__prisma) {
      globalThis.__prisma = createPrismaClient()
    }
    return globalThis.__prisma
  }
}

// Main database operation wrapper with proper error handling
async function executeQuery<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const client = getPrismaClient()
  
  try {
    const result = await operation(client)
    return result
  } catch (error) {
    console.error('Database operation failed:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('prepared statement') || 
          error.message.includes('ConnectorError') ||
          error.message.includes('connection')) {
        console.error('Database connection error:', error.message)
        throw new Error('Database connection issue. Please try again in a moment.')
      }
    }
    
    throw error
  } finally {
    // Always disconnect in production to prevent connection reuse
    if (process.env.NODE_ENV === 'production') {
      try {
        await client.$disconnect()
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError)
      }
    }
  }
}

// Export the client for direct use (development only)
export const prisma = getPrismaClient()

// Export executeQuery as the main function for API routes
export { executeQuery }
