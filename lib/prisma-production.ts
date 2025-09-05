/**
 * Production-optimized Prisma configuration for Vercel serverless deployment
 * This file specifically addresses the prepared statement conflict issue
 */

import { PrismaClient } from '@prisma/client'

// Create a new Prisma client instance optimized for serverless
export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Critical: Configure for serverless environment
    __internal: {
      engine: {
        // Prevent prepared statement reuse that causes conflicts
        closePromise: undefined,
      },
    },
  })
}

// Singleton for development, fresh instance for production
let globalPrisma: PrismaClient | undefined

export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    // Always return a fresh client in production
    return createPrismaClient()
  } else {
    // Reuse in development
    if (!globalPrisma) {
      globalPrisma = createPrismaClient()
    }
    return globalPrisma
  }
}

// Enhanced database operation wrapper with proper cleanup
export async function withDatabase<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const client = getPrismaClient()
  
  try {
    const result = await Promise.race([
      operation(client),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timeout')), 30000)
      )
    ])
    
    return result
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  } finally {
    // Critical: Always disconnect in production to prevent connection reuse
    if (process.env.NODE_ENV === 'production') {
      await client.$disconnect().catch(console.error)
    }
  }
}
