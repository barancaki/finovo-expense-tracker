'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getMonthName } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ExpenseChartProps {
  monthlyTotals: Array<{
    month: string
    total: number
  }>
}

export default function ExpenseChart({ monthlyTotals }: ExpenseChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Expenses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2)
          }
        }
      }
    }
  }

  const labels = monthlyTotals.map(item => {
    const [year, month] = item.month.split('-')
    return `${getMonthName(parseInt(month) - 1)} ${year}`
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: monthlyTotals.map(item => item.total),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  return <Bar options={options} data={data} />
}
