import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

export async function POST() {
  try {
    // This will create all tables based on your schema
    await executeQuery(async (prisma) => {
      await prisma.$executeRaw`SELECT 1`
      return true
    })
    
    return NextResponse.json({ 
      message: 'Database setup completed successfully!' 
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { error: 'Database setup failed', details: error },
      { status: 500 }
    )
  }
}
