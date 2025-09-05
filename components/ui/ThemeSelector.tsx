'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Select from './Select'

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  const themeOptions = [
    { value: 'light', label: t('light') },
    { value: 'dark', label: t('dark') },
    { value: 'system', label: t('system') }
  ]

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('theme')}:
      </span>
      <Select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        options={themeOptions}
        className="min-w-[100px]"
      />
    </div>
  )
}
