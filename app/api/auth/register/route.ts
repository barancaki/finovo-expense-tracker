import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { executeQuery } from '@/lib/db'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Hash password first to avoid database calls if validation fails
    const hashedPassword = await bcrypt.hash(password, 12)

    // Use the database operation wrapper
    const result = await executeQuery(async (prisma) => {
      return await prisma.$transaction(async (tx) => {
        // Check if user already exists
        const existingUser = await tx.user.findUnique({
          where: { email }
        })

        if (existingUser) {
          throw new Error('User already exists')
        }

        // Create user
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword
          }
        })

        return user
      })
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: result.id,
          name: result.name,
          email: result.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        )
      }
      
      // Handle Prisma connection errors
      if (error.message.includes('prepared statement') || error.message.includes('ConnectorError')) {
        console.error('Database connection error after retries')
        return NextResponse.json(
          { error: 'Database connection issue. Please try again.' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
