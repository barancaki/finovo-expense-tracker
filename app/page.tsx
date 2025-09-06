'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import ThemeSelector from '@/components/ui/ThemeSelector'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header with Theme/Language Selectors */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-10">
        <ThemeSelector />
        <LanguageSelector />
      </div>
      
      {/* Hero Section */}
      <div className="container py-20">
        <div className="text-center max-w-4xl mx-auto">

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {t('landingTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('landingSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {t('getStarted')}
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                {t('signIn')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="group text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t('trackExpenses')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {t('trackExpensesDesc')}
            </p>
          </div>
          
          <div className="group text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t('visualizeData')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {t('visualizeDataDesc')}
            </p>
          </div>
          
          <div className="group text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">💾</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t('exportData')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {t('exportDataDesc')}
            </p>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('whyChooseFinovo')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('whyChooseDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('secure')}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('secureDesc')}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900 dark:to-cyan-900 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('fast')}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('fastDesc')}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('mobileFirst')}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('mobileFirstDesc')}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('global')}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('globalDesc')}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">{t('readyToTakeControl')}</h2>
          <p className="text-xl mb-8 opacity-90">{t('readyDesc')}</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              {t('startFreeJourney')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
