import React from 'react'
import { InputProps } from '@/types'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  placeholder,
  error,
  required = false,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-50 disabled:text-gray-500',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400',
          'dark:focus:border-primary-400 dark:focus:ring-primary-400',
          'dark:disabled:bg-gray-900 dark:disabled:text-gray-500',
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400' : '',
          className || ''
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
