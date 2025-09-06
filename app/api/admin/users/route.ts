import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await executeQuery(async (prisma) => {
      return await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isAdmin: true }
      })
    })

    if (!currentUser?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all users with their subscription requests count
    const users = await executeQuery(async (prisma) => {
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          subscriptionType: true,
          subscriptionStart: true,
          subscriptionEnd: true,
          isAdmin: true,
          createdAt: true,
          subscriptionRequests: {
            where: { status: 'PENDING' },
            select: { id: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    })

    const usersWithPendingCount = users.map(user => ({
      ...user,
      pendingRequests: user.subscriptionRequests.length
    }))

    return NextResponse.json(usersWithPendingCount)
  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
