'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import SubscriptionCard from '@/components/subscription/SubscriptionCard'
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus'
import { SUBSCRIPTION_PLANS, SubscriptionType, SubscriptionInfo } from '@/types'
import { getSubscriptionInfo } from '@/lib/subscription'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Toast } from '@/components/ui/Toast'

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchSubscriptionInfo()
    
    // Show toast messages based on URL parameters
    if (searchParams.get('no-subscription') === 'true') {
      setToast({ 
        message: 'You need to request a subscription to access the application. Please select a plan below.', 
        type: 'error' 
      })
    } else if (searchParams.get('expired') === 'true') {
      setToast({ 
        message: 'Your subscription has expired. Please request a new subscription to continue.', 
        type: 'error' 
      })
    }
  }, [session, status, router, searchParams])

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (planType: SubscriptionType) => {
    setIsUpgrading(true)
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          subscriptionType: planType,
          reason: `Requesting upgrade to ${SUBSCRIPTION_PLANS[planType].name} plan`
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Show success message
        setToast({ 
          message: 'Subscription request submitted successfully! Your request will be reviewed by an administrator.', 
          type: 'success' 
        })
        
        // Refresh subscription info
        fetchSubscriptionInfo()
      } else {
        const errorData = await response.json()
        setToast({ 
          message: errorData.error || 'Failed to submit subscription request. Please try again.', 
          type: 'error' 
        })
      }
    } catch (error) {
      console.error('Request error:', error)
      setToast({ 
        message: 'Failed to submit subscription request. Please try again.', 
        type: 'error' 
      })
    } finally {
      setIsUpgrading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {subscriptionInfo?.type === 'NONE' ? 'Request Access' : 'Choose Your Plan'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {subscriptionInfo?.type === 'NONE' 
              ? 'You need to request access to use the application. Select a plan below and wait for admin approval.'
              : 'Select the perfect plan for your expense tracking needs. Upgrade or downgrade anytime.'
            }
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscriptionInfo && (
          <SubscriptionStatus 
            subscriptionInfo={subscriptionInfo}
            onUpgrade={() => router.push('#plans')}
          />
        )}

        {/* Subscription Plans */}
        <div id="plans" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.values(SUBSCRIPTION_PLANS)
            .filter(plan => plan.type !== 'NONE') // Don't show NONE plan
            .map((plan) => (
              <SubscriptionCard
                key={plan.type}
                plan={plan}
                currentPlan={subscriptionInfo?.type}
                onUpgrade={handleUpgrade}
                isLoading={isUpgrading}
              />
            ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Features</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Free Trial</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Pro</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Ultimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Basic expense tracking</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Advanced reports</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Data export</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AI expense analyzer</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Smart insights</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Priority support</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
