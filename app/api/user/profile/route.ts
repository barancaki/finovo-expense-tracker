import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            expenses: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate total expenses
    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id
      }
    })

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      expenseCount: user._count.expenses,
      totalExpenses
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
