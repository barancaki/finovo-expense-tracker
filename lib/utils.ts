export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function exportToCSV(data: any[], filename: string) {
  const csvContent = convertToCSV(data)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = []
  
  // Add headers
  csvRows.push(headers.join(','))
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header]
      return `"${val}"`
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}

export function getMonthName(month: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  return months[month]
}

export function calculateExpenseStats(expenses: any[]) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const expenseCount = expenses.length
  const averageAmount = expenseCount > 0 ? totalAmount / expenseCount : 0
  
  // Category breakdown
  const categoryBreakdown: Record<string, number> = {}
  expenses.forEach(expense => {
    categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount
  })
  
  // Monthly totals
  const monthlyData: Record<string, number> = {}
  expenses.forEach(expense => {
    const date = new Date(expense.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + expense.amount
  })
  
  const monthlyTotals = Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total
  })).sort((a, b) => a.month.localeCompare(b.month))
  
  return {
    totalAmount,
    expenseCount,
    averageAmount,
    categoryBreakdown,
    monthlyTotals
  }
}
