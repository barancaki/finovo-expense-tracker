'use client'

import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseStats } from '@/types'

interface StatsCardsProps {
  stats: ExpenseStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const topCategories = Object.entries(stats.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  return (
    <div className="stats-grid">
      <Card title="Total Expenses">
        <div className="text-3xl font-bold text-primary-600">
          {formatCurrency(stats.totalAmount)}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Across {stats.expenseCount} transactions
        </p>
      </Card>

      <Card title="Average Expense">
        <div className="text-3xl font-bold text-green-600">
          {formatCurrency(stats.averageAmount)}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Per transaction
        </p>
      </Card>

      <Card title="Total Transactions">
        <div className="text-3xl font-bold text-blue-600">
          {stats.expenseCount}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Recorded expenses
        </p>
      </Card>

      <Card title="Top Categories">
        <div className="space-y-2">
          {topCategories.length > 0 ? (
            topCategories.map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="text-sm font-medium">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories yet</p>
          )}
        </div>
      </Card>
    </div>
  )
}
