import { User, Expense } from '@prisma/client'

export type SubscriptionType = 'NONE' | 'FREE_TRIAL' | 'PRO' | 'ULTIMATE'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

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
  subscriptionType: SubscriptionType
  subscriptionStart: Date
  subscriptionEnd: Date | null
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

export interface SubscriptionInfo {
  type: SubscriptionType
  startDate: Date
  endDate: Date | null
  isActive: boolean
  daysRemaining: number | null
  features: string[]
}

export interface SubscriptionPlan {
  type: SubscriptionType
  name: string
  duration: number // in days
  price: number
  features: string[]
  description: string
}

export interface SubscriptionRequest {
  id: string
  userId: string
  user: User
  requestedType: SubscriptionType
  status: RequestStatus
  reason?: string
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AdminUser {
  id: string
  name: string | null
  email: string
  subscriptionType: SubscriptionType
  subscriptionStart: Date
  subscriptionEnd: Date | null
  isAdmin: boolean
  createdAt: Date
  pendingRequests: number
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionType, SubscriptionPlan> = {
  NONE: {
    type: 'NONE',
    name: 'No Subscription',
    duration: 0,
    price: 0,
    features: [],
    description: 'No active subscription'
  },
  FREE_TRIAL: {
    type: 'FREE_TRIAL',
    name: 'Free Trial',
    duration: 1, // 1 day
    price: 0,
    features: ['Basic expense tracking', 'Simple reports', '1 day access'],
    description: 'Try our service for free'
  },
  PRO: {
    type: 'PRO',
    name: 'Pro',
    duration: 30, // 30 days
    price: 9.99,
    features: ['Unlimited expenses', 'Advanced reports', 'Data export', '30 days access'],
    description: 'Perfect for regular users'
  },
  ULTIMATE: {
    type: 'ULTIMATE',
    name: 'Ultimate',
    duration: 30, // 30 days
    price: 19.99,
    features: ['Everything in Pro', 'AI expense analyzer', 'Smart insights', 'Priority support'],
    description: 'For power users who want AI insights'
  }
}
