import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { canAccessFeature, shouldDeleteUserData } from '@/lib/subscription'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Allow access to public routes
  const publicRoutes = ['/auth/signin', '/auth/signup', '/']
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Redirect to signin if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Check subscription status for protected routes
  const protectedRoutes = ['/dashboard', '/profile']
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const subscriptionType = token.subscriptionType as string
    const subscriptionEnd = token.subscriptionEnd ? new Date(token.subscriptionEnd as unknown as string) : null

    // Users with NONE subscription must request a trial first
    if (subscriptionType === 'NONE') {
      return NextResponse.redirect(new URL('/subscription?no-subscription=true', request.url))
    }

    // Check if user data should be deleted (expired free trial)
    if (shouldDeleteUserData(subscriptionType as any, subscriptionEnd)) {
      // Redirect to subscription page with expired message
      return NextResponse.redirect(new URL('/subscription?expired=true', request.url))
    }

    // Check if subscription is active
    const isActive = canAccessFeature(subscriptionType as any, subscriptionEnd, 'basic')
    if (!isActive) {
      return NextResponse.redirect(new URL('/subscription?expired=true', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
