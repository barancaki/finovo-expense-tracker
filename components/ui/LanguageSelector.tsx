'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/i18n'

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { value: 'en', label: t('english'), flag: '🇺🇸' },
    { value: 'tr', label: t('turkish'), flag: '🇹🇷' }
  ]

  return (
    <div className="relative group">
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <span className="text-lg">
          {languages.find(l => l.value === language)?.flag}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('language')}
        </span>
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => setLanguage(lang.value as Language)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
              language === lang.value ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-medium">{lang.label}</span>
            {language === lang.value && (
              <svg className="w-4 h-4 ml-auto text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
