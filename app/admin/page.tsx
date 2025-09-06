'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { AdminUser, SubscriptionRequest } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [requests, setRequests] = useState<SubscriptionRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('requests')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [usersRes, requestsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/requests')
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json()
        setRequests(requestsData)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestAction = async (requestId: string, action: 'APPROVED' | 'REJECTED', adminNotes?: string) => {
    try {
      const response = await fetch('/api/admin/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId,
          action,
          adminNotes
        })
      })

      if (response.ok) {
        await fetchData() // Refresh data
        alert(`Request ${action.toLowerCase()} successfully!`)
      } else {
        alert('Failed to update request')
      }
    } catch (error) {
      console.error('Request action error:', error)
      alert('Failed to update request')
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

  const pendingRequests = requests.filter(req => req.status === 'PENDING')

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Admin Panel
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage user subscriptions and requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Users">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {users.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Registered users
            </p>
          </Card>

          <Card title="Pending Requests">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingRequests.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Awaiting approval
            </p>
          </Card>

          <Card title="Active Subscriptions">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {users.filter(u => u.subscriptionType !== 'FREE_TRIAL').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Pro & Ultimate users
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Subscription Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            All Users ({users.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'requests' && (
          <Card title="Subscription Requests">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {request.user.name || request.user.email}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Requesting: <span className="font-medium">{request.requestedType}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Requested: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.reason && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Reason: {request.reason}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRequestAction(request.id, 'APPROVED')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRequestAction(request.id, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'users' && (
          <Card title="All Users">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Subscription</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Requests</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user.name || 'No name'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.subscriptionType === 'FREE_TRIAL' 
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            : user.subscriptionType === 'PRO'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {user.subscriptionType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {user.pendingRequests > 0 ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                            {user.pendingRequests} pending
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-500">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
