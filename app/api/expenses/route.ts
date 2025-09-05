import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

// GET /api/expenses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      userId: session.user.id
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Get expenses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/expenses
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, category, description, date } = await request.json()

    if (!amount || !category) {
      return NextResponse.json(
        { error: 'Amount and category are required' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        description: description || '',
        date: date ? new Date(date) : new Date(),
        userId: session.user.id
      }
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Create expense error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
