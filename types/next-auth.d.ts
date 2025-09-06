import NextAuth from "next-auth"
import { SubscriptionType } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      subscriptionType?: SubscriptionType
      subscriptionEnd?: Date | null
      isAdmin?: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    subscriptionType?: SubscriptionType
    subscriptionEnd?: Date | null
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    subscriptionType?: SubscriptionType
    subscriptionEnd?: Date | null
    isAdmin?: boolean
  }
}
