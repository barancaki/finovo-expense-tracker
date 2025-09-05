'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ExpenseCardSkeleton } from '@/components/ui/SkeletonLoader'
import ExpenseForm from './ExpenseForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Expense } from '@prisma/client'

interface ExpenseListProps {
  expenses: Expense[]
  onUpdate: () => void
}

export default function ExpenseList({ expenses, onUpdate }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { t } = useLanguage()

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm(t('deleteConfirm'))) {
      return
    }

    setDeletingId(expenseId)
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success(t('deleteSuccess'))
        onUpdate()
      } else {
        toast.error(t('errorOccurred'))
      }
    } catch (error) {
      toast.error(t('errorOccurred'))
    } finally {
      setDeletingId(null)
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
        toast.success(t('updateSuccess'))
        setIsEditModalOpen(false)
        setEditingExpense(null)
        onUpdate()
      } else {
        toast.error(t('errorOccurred'))
      }
    } catch (error) {
      toast.error(t('errorOccurred'))
    } finally {
      setIsLoading(false)
    }
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{t('noExpensesFound')}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {t('noExpensesDesc')}
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
                  disabled={isLoading || deletingId === expense.id}
                >
                  {t('edit')}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                  disabled={isLoading || deletingId === expense.id}
                >
                  {deletingId === expense.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t('delete')
                  )}
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
