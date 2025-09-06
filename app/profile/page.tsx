'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatCurrency, formatDate, exportToCSV } from '@/lib/utils'
import type { UserProfile } from '@/types'
import type { Expense } from '@prisma/client'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/expenses')
      if (response.ok) {
        const expenses: Expense[] = await response.json()
        
        const csvData = expenses.map(expense => ({
          Date: formatDate(new Date(expense.date)),
          Amount: expense.amount,
          Category: expense.category,
          Description: expense.description || '',
          'Created At': formatDate(new Date(expense.createdAt))
        }))

        const filename = `finovo-expenses-${new Date().toISOString().split('T')[0]}.csv`
        exportToCSV(csvData, filename)
      } else {
        alert('Failed to export data')
      }
    } catch (error) {
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

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
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">
            Manage your account and export your data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card title="Profile Information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {profile?.name || 'Not provided'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{profile?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {profile?.createdAt ? formatDate(new Date(profile.createdAt)) : 'Unknown'}
                </p>
              </div>
            </div>
          </Card>

          {/* Account Statistics */}
          <Card title="Account Statistics">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Expenses</span>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {profile ? formatCurrency(profile.totalExpenses) : '--'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Transactions</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {profile?.expenseCount || 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average per Transaction</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {profile && profile.expenseCount > 0 
                    ? formatCurrency(profile.totalExpenses / profile.expenseCount)
                    : '--'
                  }
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Export */}
        <Card title="Data Export">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export all your expense data as a CSV file for backup or analysis in other applications.
            </p>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleExportCSV}
                disabled={isExporting || !profile || profile.expenseCount === 0}
              >
                {isExporting ? 'Exporting...' : 'Export as CSV'}
              </Button>
              
              {profile && profile.expenseCount === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No expenses to export
                </p>
              )}
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>The CSV file will include:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Date of each expense</li>
                <li>Amount and category</li>
                <li>Description (if provided)</li>
                <li>Created timestamp</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
