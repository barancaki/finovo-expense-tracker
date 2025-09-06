import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { executeQuery } from '@/lib/db'
import { calculateSubscriptionEndDate } from '@/lib/subscription'

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

    // Get all subscription requests
    const requests = await executeQuery(async (prisma) => {
      return await prisma.subscriptionRequest.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              subscriptionType: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Admin requests fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { requestId, action, adminNotes } = await request.json()

    if (!requestId || !action || !['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Update the request status
    const updatedRequest = await executeQuery(async (prisma) => {
      const request = await prisma.subscriptionRequest.update({
        where: { id: requestId },
        data: {
          status: action,
          adminNotes: adminNotes || null
        },
        include: {
          user: true
        }
      })

      // If approved, update user's subscription
      if (action === 'APPROVED') {
        const subscriptionEnd = calculateSubscriptionEndDate(request.requestedType)
        
        await prisma.user.update({
          where: { id: request.userId },
          data: {
            subscriptionType: request.requestedType,
            subscriptionStart: new Date(),
            subscriptionEnd: subscriptionEnd
          }
        })
      }

      return request
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Admin request update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
