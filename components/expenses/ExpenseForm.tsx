'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { EXPENSE_CATEGORIES } from '@/types'
import { formatDateForInput } from '@/lib/utils'

interface ExpenseFormData {
  amount: number
  category: string
  description: string
  date: string
}

interface ExpenseFormProps {
  expense?: any
  onSubmit: (data: ExpenseFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export default function ExpenseForm({
  expense,
  onSubmit,
  onCancel,
  isLoading = false
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: expense?.amount || '',
      category: expense?.category || '',
      description: expense?.description || '',
      date: expense ? formatDateForInput(new Date(expense.date)) : formatDateForInput(new Date())
    }
  })

  const categoryOptions = EXPENSE_CATEGORIES.map(category => ({
    value: category,
    label: category
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        {...register('amount', {
          required: 'Amount is required',
          min: {
            value: 0.01,
            message: 'Amount must be greater than 0'
          }
        })}
        error={errors.amount?.message}
      />

      <Select
        label="Category"
        placeholder="Select a category"
        options={categoryOptions}
        {...register('category', {
          required: 'Category is required'
        })}
        error={errors.category?.message}
      />

      <Input
        label="Description"
        type="text"
        placeholder="Enter a description (optional)"
        {...register('description')}
        error={errors.description?.message}
      />

      <Input
        label="Date"
        type="date"
        {...register('date', {
          required: 'Date is required'
        })}
        error={errors.date?.message}
      />

      <div className="flex space-x-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
