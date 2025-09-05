'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/i18n'
import Select from './Select'

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  const languageOptions = [
    { value: 'en', label: t('english') },
    { value: 'tr', label: t('turkish') }
  ]

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('language')}:
      </span>
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        options={languageOptions}
        className="min-w-[100px]"
      />
    </div>
  )
}
