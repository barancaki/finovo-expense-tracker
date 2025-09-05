import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

// PUT /api/expenses/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if expense belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    const expense = await prisma.expense.update({
      where: {
        id: params.id
      },
      data: {
        amount: parseFloat(amount),
        category,
        description: description || '',
        date: date ? new Date(date) : existingExpense.date
      }
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Update expense error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/expenses/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if expense belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    await prisma.expense.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Delete expense error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
