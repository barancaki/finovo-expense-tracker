import { useLanguage } from '@/contexts/LanguageContext'

export const useValidationRules = () => {
  const { t } = useLanguage()

  return {
    email: {
      required: t('emailRequired'),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('invalidEmail')
      }
    },
    password: {
      required: t('passwordRequired'),
      minLength: {
        value: 6,
        message: t('passwordTooShort')
      }
    },
    name: {
      required: t('nameRequired'),
      minLength: {
        value: 2,
        message: t('nameTooShort')
      }
    },
    amount: {
      required: t('amountRequired'),
      min: {
        value: 0.01,
        message: t('amountTooSmall')
      },
      pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: 'Please enter a valid amount with up to 2 decimal places'
      }
    },
    category: {
      required: t('categoryRequired')
    },
    date: {
      required: t('dateRequired')
    }
  }
}

export const validatePassword = (password: string): string[] => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return errors
}

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return ''
}
