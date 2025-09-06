import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { executeQuery } from './db'
import bcrypt from 'bcryptjs'
type SubscriptionType = 'FREE_TRIAL' | 'PRO' | 'ULTIMATE'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await executeQuery(async (prisma) => {
            return await prisma.user.findUnique({
              where: {
                email: credentials.email
              }
            })
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            subscriptionType: (user as any).subscriptionType || 'FREE_TRIAL',
            subscriptionEnd: (user as any).subscriptionEnd || null,
            isAdmin: (user as any).isAdmin || false,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.subscriptionType = user.subscriptionType
        token.subscriptionEnd = user.subscriptionEnd
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.subscriptionType = token.subscriptionType as SubscriptionType
        session.user.subscriptionEnd = token.subscriptionEnd as Date | null
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    }
  }
}
