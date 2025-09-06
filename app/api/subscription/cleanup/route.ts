import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { shouldDeleteUserData } from '@/lib/subscription'

export async function POST() {
  try {
    // This endpoint should be called by a cron job or scheduled task
    // to clean up expired free trial users
    
    const expiredUsers = await executeQuery(async (prisma) => {
      return await prisma.user.findMany({
        where: {
          subscriptionType: 'FREE_TRIAL',
          subscriptionEnd: {
            lt: new Date() // subscriptionEnd is in the past
          }
        },
        select: {
          id: true,
          subscriptionType: true,
          subscriptionEnd: true
        }
      })
    })

    const cleanupResults = []

    for (const user of expiredUsers) {
      if (shouldDeleteUserData(user.subscriptionType, user.subscriptionEnd)) {
        try {
          // Delete all user data
          await executeQuery(async (prisma) => {
            // Delete expenses first (due to foreign key constraints)
            await prisma.expense.deleteMany({
              where: { userId: user.id }
            })
            
            // Delete accounts
            await prisma.account.deleteMany({
              where: { userId: user.id }
            })
            
            // Delete sessions
            await prisma.session.deleteMany({
              where: { userId: user.id }
            })
            
            // Finally delete the user
            await prisma.user.delete({
              where: { id: user.id }
            })
          })

          cleanupResults.push({
            userId: user.id,
            status: 'deleted',
            message: 'User data successfully deleted'
          })
        } catch (error) {
          console.error(`Failed to delete user ${user.id}:`, error)
          cleanupResults.push({
            userId: user.id,
            status: 'error',
            message: 'Failed to delete user data'
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Cleanup completed',
      processedUsers: expiredUsers.length,
      results: cleanupResults
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
