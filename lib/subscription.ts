import { SubscriptionType, SubscriptionInfo, SUBSCRIPTION_PLANS } from '@/types'

export function calculateSubscriptionEndDate(
  subscriptionType: SubscriptionType,
  startDate: Date = new Date()
): Date {
  const plan = SUBSCRIPTION_PLANS[subscriptionType]
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + plan.duration)
  return endDate
}

export function isSubscriptionActive(
  subscriptionType: SubscriptionType,
  subscriptionEnd: Date | null
): boolean {
  if (!subscriptionEnd) return false
  return new Date() < subscriptionEnd
}

export function getDaysRemaining(subscriptionEnd: Date | null): number | null {
  if (!subscriptionEnd) return null
  const now = new Date()
  const diffTime = subscriptionEnd.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

export function getSubscriptionInfo(
  subscriptionType: SubscriptionType,
  subscriptionStart: Date,
  subscriptionEnd: Date | null
): SubscriptionInfo {
  const isActive = isSubscriptionActive(subscriptionType, subscriptionEnd)
  const daysRemaining = getDaysRemaining(subscriptionEnd)
  const plan = SUBSCRIPTION_PLANS[subscriptionType]

  return {
    type: subscriptionType,
    startDate: subscriptionStart,
    endDate: subscriptionEnd,
    isActive,
    daysRemaining,
    features: plan.features
  }
}

export function canAccessFeature(
  subscriptionType: SubscriptionType,
  subscriptionEnd: Date | null,
  feature: 'basic' | 'advanced' | 'ai'
): boolean {
  // Users with NONE subscription cannot access any features
  if (subscriptionType === 'NONE') return false
  
  const isActive = isSubscriptionActive(subscriptionType, subscriptionEnd)
  
  if (!isActive) return false

  switch (feature) {
    case 'basic':
      return subscriptionType === 'FREE_TRIAL' || subscriptionType === 'PRO' || subscriptionType === 'ULTIMATE'
    case 'advanced':
      return subscriptionType === 'PRO' || subscriptionType === 'ULTIMATE'
    case 'ai':
      return subscriptionType === 'ULTIMATE'
    default:
      return false
  }
}

export function shouldDeleteUserData(subscriptionType: SubscriptionType, subscriptionEnd: Date | null): boolean {
  // Delete data if free trial has expired
  if (subscriptionType === 'FREE_TRIAL' && subscriptionEnd) {
    return new Date() > subscriptionEnd
  }
  return false
}
