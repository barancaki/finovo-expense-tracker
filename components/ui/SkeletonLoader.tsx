'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  lines?: number
}

export default function Skeleton({ 
  className, 
  variant = 'text', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  
  const variants = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variants[variant],
              'h-4',
              index === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        variant === 'text' && 'h-4',
        variant === 'rectangular' && 'h-24',
        variant === 'circular' && 'h-12 w-12',
        className
      )}
      style={{ width, height }}
    />
  )
}

// Pre-built skeleton components
export function ExpenseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" width="100px" />
        <Skeleton variant="rectangular" width="80px" height="24px" />
      </div>
      <Skeleton variant="text" lines={2} />
      <div className="mt-4 flex space-x-2">
        <Skeleton variant="rectangular" width="60px" height="32px" />
        <Skeleton variant="rectangular" width="60px" height="32px" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <Skeleton variant="text" width="120px" className="mb-2" />
      <Skeleton variant="text" width="80px" height="32px" className="mb-1" />
      <Skeleton variant="text" width="100px" />
    </div>
  )
}
