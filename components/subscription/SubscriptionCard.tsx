'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SubscriptionPlan, SubscriptionType } from '@/types'
import { cn } from '@/lib/utils'

interface SubscriptionCardProps {
  plan: SubscriptionPlan
  currentPlan?: SubscriptionType
  onUpgrade?: (planType: SubscriptionType) => void
  isLoading?: boolean
}

export default function SubscriptionCard({ 
  plan, 
  currentPlan, 
  onUpgrade, 
  isLoading = false 
}: SubscriptionCardProps) {
  const isCurrentPlan = currentPlan === plan.type
  const isUpgrade = currentPlan && ['FREE_TRIAL', 'PRO'].includes(currentPlan) && plan.type !== currentPlan
  const isRequest = currentPlan === 'NONE'

  return (
    <Card 
      className={cn(
        'relative transition-all duration-200 hover:shadow-lg',
        isCurrentPlan ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : '',
        plan.type === 'ULTIMATE' ? 'border-purple-200 dark:border-purple-700' : ''
      )}
    >
      {plan.type === 'ULTIMATE' && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {plan.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {plan.description}
        </p>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            ${plan.price}
          </span>
          <span className="text-gray-600 dark:text-gray-400 ml-2">
            /{plan.duration === 1 ? 'day' : 'month'}
          </span>
        </div>

        <ul className="space-y-3 mb-8 text-left">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {isCurrentPlan ? (
          <Button 
            disabled 
            className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          >
            Current Plan
          </Button>
        ) : (
          <Button
            onClick={() => onUpgrade?.(plan.type)}
            disabled={isLoading}
            className={cn(
              'w-full',
              plan.type === 'ULTIMATE' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : '',
              plan.type === 'PRO' ? 'bg-blue-600 hover:bg-blue-700' : '',
              plan.type === 'FREE_TRIAL' ? 'bg-gray-600 hover:bg-gray-700' : ''
            )}
          >
            {isLoading ? 'Processing...' : isRequest ? 'Request Access' : isUpgrade ? 'Upgrade' : 'Select Plan'}
          </Button>
        )}
      </div>
    </Card>
  )
}
