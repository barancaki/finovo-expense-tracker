import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { executeWithRetry } from '@/lib/prisma-edge'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expenses = await executeWithRetry(async (prisma) => {
      return await prisma.expense.findMany({
        where: {
          userId: session.user.id
        }
      })
    })

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const expenseCount = expenses.length
    const averageAmount = expenseCount > 0 ? totalAmount / expenseCount : 0

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {}
    expenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount
    })

    // Monthly totals for the last 12 months
    const now = new Date()
    const monthlyData: Record<string, number> = {}
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = 0
    }

    // Populate with actual data
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += expense.amount
      }
    })

    const monthlyTotals = Object.entries(monthlyData).map(([month, total]) => ({
      month,
      total
    })).sort((a, b) => a.month.localeCompare(b.month))

    return NextResponse.json({
      totalAmount,
      expenseCount,
      averageAmount,
      categoryBreakdown,
      monthlyTotals
    })
  } catch (error) {
    console.error('Get expense stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
