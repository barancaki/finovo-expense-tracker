'use client'

import { Toaster } from 'react-hot-toast'
import { useTheme } from '@/contexts/ThemeContext'

export default function ToastProvider() {
  const { actualTheme } = useTheme()

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: actualTheme === 'dark' ? '#374151' : '#ffffff',
          color: actualTheme === 'dark' ? '#f9fafb' : '#111827',
          border: `1px solid ${actualTheme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: actualTheme === 'dark' ? '#374151' : '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: actualTheme === 'dark' ? '#374151' : '#ffffff',
          },
        },
      }}
    />
  )
}
