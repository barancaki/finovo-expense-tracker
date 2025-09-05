/**
 * Environment Variable Validation
 * Ensures all required environment variables are present and valid
 */

interface EnvironmentConfig {
  DATABASE_URL: string
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  NODE_ENV: string
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

export function validateEnvironment(): EnvironmentConfig {
  const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET'] as const
  const missing: string[] = []
  
  // Check required variables
  for (const envVar of requiredVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }
  
  if (missing.length > 0) {
    throw new EnvironmentError(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or deployment environment variables.'
    )
  }
  
  // Validate DATABASE_URL format
  const databaseUrl = process.env.DATABASE_URL!
  if (!databaseUrl.startsWith('postgresql://')) {
    throw new EnvironmentError(
      'DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql://'
    )
  }
  
  // Validate NEXTAUTH_SECRET length
  const secret = process.env.NEXTAUTH_SECRET!
  if (secret.length < 32) {
    console.warn('⚠️  NEXTAUTH_SECRET should be at least 32 characters long for security')
  }
  
  // Set default NEXTAUTH_URL for development
  const nextAuthUrl = process.env.NEXTAUTH_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined)
  
  if (!nextAuthUrl) {
    throw new EnvironmentError(
      'NEXTAUTH_URL is required for production deployments'
    )
  }
  
  return {
    DATABASE_URL: databaseUrl,
    NEXTAUTH_URL: nextAuthUrl,
    NEXTAUTH_SECRET: secret,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
}

// Validate environment on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnvironment()
    console.log('✅ Environment validation passed')
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development'
}
