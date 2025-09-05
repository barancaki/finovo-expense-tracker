'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { EXPENSE_CATEGORIES } from '@/types'
import { formatDateForInput } from '@/lib/utils'

interface ExpenseFiltersProps {
  onFilter: (filters: {
    category?: string
    startDate?: string
    endDate?: string
  }) => void
}

export default function ExpenseFilters({ onFilter }: ExpenseFiltersProps) {
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...EXPENSE_CATEGORIES.map(cat => ({
      value: cat,
      label: cat
    }))
  ]

  const handleFilter = () => {
    onFilter({
      category: category === 'all' ? undefined : category,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    })
  }

  const handleReset = () => {
    setCategory('')
    setStartDate('')
    setEndDate('')
    onFilter({})
  }

  const setQuickFilter = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    
    setStartDate(formatDateForInput(start))
    setEndDate(formatDateForInput(end))
  }

  return (
    <Card title="Filters">
      <div className="space-y-4">
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          placeholder="All Categories"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Quick Filters:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickFilter(7)}
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickFilter(30)}
            >
              Last 30 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickFilter(90)}
            >
              Last 3 months
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleFilter} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}
