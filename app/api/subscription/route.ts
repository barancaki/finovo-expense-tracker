import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { executeQuery } from '@/lib/db'
import { SubscriptionType } from '@prisma/client'
import { calculateSubscriptionEndDate, getSubscriptionInfo } from '@/lib/subscription'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await executeQuery(async (prisma) => {
      return await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          subscriptionType: true,
          subscriptionStart: true,
          subscriptionEnd: true
        }
      })
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const subscriptionInfo = getSubscriptionInfo(
      user.subscriptionType,
      user.subscriptionStart,
      user.subscriptionEnd
    )

    return NextResponse.json(subscriptionInfo)
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscriptionType, reason } = await request.json()
    
    if (!subscriptionType || !['NONE', 'FREE_TRIAL', 'PRO', 'ULTIMATE'].includes(subscriptionType)) {
      return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 })
    }

    // Allow requesting FREE_TRIAL
    // if (subscriptionType === 'FREE_TRIAL') {
    //   return NextResponse.json({ error: 'Cannot request free trial' }, { status: 400 })
    // }

    // Check if user already has a pending request for this subscription type
    const existingRequest = await executeQuery(async (prisma) => {
      return await prisma.subscriptionRequest.findFirst({
        where: {
          userId: session.user.id,
          requestedType: subscriptionType,
          status: 'PENDING'
        }
      })
    })

    if (existingRequest) {
      return NextResponse.json({ error: 'You already have a pending request for this subscription' }, { status: 400 })
    }

    // Create subscription request
    const subscriptionRequest = await executeQuery(async (prisma) => {
      return await prisma.subscriptionRequest.create({
        data: {
          userId: session.user.id,
          requestedType: subscriptionType as SubscriptionType,
          reason: reason || null,
          status: 'PENDING'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    })

    return NextResponse.json({
      message: 'Subscription request submitted successfully',
      request: subscriptionRequest
    })
  } catch (error) {
    console.error('Subscription request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
