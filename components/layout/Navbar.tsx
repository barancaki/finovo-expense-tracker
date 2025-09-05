'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import ThemeSelector from '@/components/ui/ThemeSelector'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { t } = useLanguage()

  const navigation = [
    { name: t('dashboard'), href: '/dashboard' },
    { name: t('profile'), href: '/profile' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              Finovo
            </Link>
            
            {session && (
              <div className="hidden md:flex ml-8 space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                      pathname === item.href
                        ? 'border-primary-500 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme and Language Selectors */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeSelector />
              <LanguageSelector />
            </div>
            
            {session ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('welcome')}, {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  {t('signOut')}
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    {t('signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
