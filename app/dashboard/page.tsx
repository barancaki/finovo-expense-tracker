'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCards from '@/components/dashboard/StatsCards'
import ExpenseChart from '@/components/charts/ExpenseChart'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import ExpenseList from '@/components/expenses/ExpenseList'
import ExpenseFilters from '@/components/expenses/ExpenseFilters'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import type { Expense } from '@prisma/client'
import type { ExpenseStats } from '@/types'

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState<ExpenseStats | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filters, setFilters] = useState<{
    category?: string
    startDate?: string
    endDate?: string
  }>({})

  const fetchExpenses = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/expenses?${params}`)
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/expenses/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleAddExpense = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        await fetchExpenses()
        await fetchStats()
      } else {
        alert('Failed to add expense')
      }
    } catch (error) {
      alert('Failed to add expense')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleUpdate = async () => {
    await fetchExpenses()
    await fetchStats()
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchExpenses(), fetchStats()])
      setIsLoading(false)
    }
    loadData()
  }, [filters])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Track and manage your personal expenses
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add Expense
          </Button>
        </div>

        {/* Stats */}
        {stats && <StatsCards stats={stats} />}

        {/* Chart */}
        {stats && stats.monthlyTotals.length > 0 && (
          <Card title="Monthly Expense Trends">
            <ExpenseChart monthlyTotals={stats.monthlyTotals} />
          </Card>
        )}

        {/* Filters and Expenses */}
        <div className="expense-grid">
          <div className="lg:col-span-1">
            <ExpenseFilters onFilter={handleFilter} />
          </div>
          
          <div className="lg:col-span-2">
            <Card title="Recent Expenses">
              <ExpenseList expenses={expenses} onUpdate={handleUpdate} />
            </Card>
          </div>
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Expense"
        >
          <ExpenseForm
            onSubmit={handleAddExpense}
            onCancel={() => setIsAddModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
