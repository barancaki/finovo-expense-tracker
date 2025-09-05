'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import ExpenseForm from './ExpenseForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Expense } from '@prisma/client'

interface ExpenseListProps {
  expenses: Expense[]
  onUpdate: () => void
}

export default function ExpenseList({ expenses, onUpdate }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onUpdate()
      } else {
        alert('Failed to delete expense')
      }
    } catch (error) {
      alert('Failed to delete expense')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingExpense) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setEditingExpense(null)
        onUpdate()
      } else {
        alert('Failed to update expense')
      }
    } catch (error) {
      alert('Failed to update expense')
    } finally {
      setIsLoading(false)
    }
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">No expenses found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Add your first expense to get started!
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {formatCurrency(expense.amount)}
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {expense.category}
                  </span>
                </div>
                {expense.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {expense.description}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {formatDate(new Date(expense.date))}
                </p>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(expense)}
                  disabled={isLoading}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingExpense(null)
        }}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingExpense(null)
            }}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </>
  )
}
