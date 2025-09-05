import { User, Expense } from '@prisma/client'

export interface ExpenseFormData {
  amount: number
  category: string
  description?: string
  date: Date
}

export interface ExpenseWithUser extends Expense {
  user: User
}

export interface ExpenseFilters {
  category?: string
  startDate?: Date
  endDate?: Date
}

export interface ExpenseStats {
  totalAmount: number
  expenseCount: number
  averageAmount: number
  categoryBreakdown: Record<string, number>
  monthlyTotals: Array<{
    month: string
    total: number
  }>
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  createdAt: Date
  expenseCount: number
  totalExpenses: number
}

export interface AuthUser {
  id: string
  name: string | null
  email: string
  image?: string | null
}

export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

export interface CardProps extends ComponentProps {
  title?: string
  subtitle?: string
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }>
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
