import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [user, expenses] = await executeQuery(async (prisma) => {
      const userPromise = prisma.user.findUnique({
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

      const expensesPromise = prisma.expense.findMany({
        where: {
          userId: session.user.id
        }
      })

      return Promise.all([userPromise, expensesPromise])
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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
