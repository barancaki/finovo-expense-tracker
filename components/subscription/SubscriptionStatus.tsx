'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SubscriptionInfo, SubscriptionType } from '@/types'
import { cn } from '@/lib/utils'

interface SubscriptionStatusProps {
  subscriptionInfo: SubscriptionInfo
  onUpgrade?: () => void
}

export default function SubscriptionStatus({ subscriptionInfo, onUpgrade }: SubscriptionStatusProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (subscriptionInfo.daysRemaining !== null) {
      const updateTimeRemaining = () => {
        if (subscriptionInfo.endDate) {
          const now = new Date()
          const endDate = new Date(subscriptionInfo.endDate)
          const diffTime = endDate.getTime() - now.getTime()
          
          if (diffTime > 0) {
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
            
            if (days > 0) {
              setTimeRemaining(`${days} day${days > 1 ? 's' : ''} remaining`)
            } else if (hours > 0) {
              setTimeRemaining(`${hours} hour${hours > 1 ? 's' : ''} remaining`)
            } else {
              setTimeRemaining(`${minutes} minute${minutes > 1 ? 's' : ''} remaining`)
            }
          } else {
            setTimeRemaining('Expired')
          }
        }
      }

      updateTimeRemaining()
      const interval = setInterval(updateTimeRemaining, 60000) // Update every minute
      return () => clearInterval(interval)
    }
  }, [subscriptionInfo.endDate, subscriptionInfo.daysRemaining])

  const getStatusColor = () => {
    if (subscriptionInfo.type === 'NONE') return 'text-red-600 dark:text-red-400'
    if (!subscriptionInfo.isActive) return 'text-red-600 dark:text-red-400'
    if (subscriptionInfo.daysRemaining !== null && subscriptionInfo.daysRemaining <= 1) {
      return 'text-yellow-600 dark:text-yellow-400'
    }
    return 'text-green-600 dark:text-green-400'
  }

  const getStatusText = () => {
    if (subscriptionInfo.type === 'NONE') return 'No Subscription'
    if (!subscriptionInfo.isActive) return 'Expired'
    if (subscriptionInfo.daysRemaining !== null && subscriptionInfo.daysRemaining <= 1) {
      return 'Expiring Soon'
    }
    return 'Active'
  }

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Subscription Status
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {subscriptionInfo.type.replace('_', ' ')}
            </span>
            <span className={cn('text-sm font-medium', getStatusColor())}>
              {getStatusText()}
            </span>
            {timeRemaining && (
              <span className="text-sm text-gray-500 dark:text-gray-500">
                {timeRemaining}
              </span>
            )}
          </div>
        </div>
        
        {subscriptionInfo.type === 'NONE' && (
          <Button onClick={onUpgrade} size="sm">
            Request Access
          </Button>
        )}
        {subscriptionInfo.type === 'FREE_TRIAL' && subscriptionInfo.isActive && (
          <Button onClick={onUpgrade} size="sm">
            Upgrade Now
          </Button>
        )}
      </div>
      
      {subscriptionInfo.type === 'NONE' && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                No Active Subscription
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                You need to request a subscription to access the application. Select a plan below and wait for admin approval.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {subscriptionInfo.type === 'FREE_TRIAL' && subscriptionInfo.daysRemaining !== null && subscriptionInfo.daysRemaining <= 1 && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Trial Expiring Soon
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Upgrade to continue using Finovo after your trial ends.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
