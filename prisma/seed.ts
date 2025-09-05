import type { PrismaClient as PrismaClientType } from '@prisma/client'
const { PrismaClient } = require('@prisma/client') as { PrismaClient: new () => PrismaClientType }
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@finovo.com' },
    update: {},
    create: {
      email: 'demo@finovo.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  // Create demo expenses
  const expenses = [
    {
      amount: 25.50,
      category: 'Food',
      description: 'Lunch at cafe',
      date: new Date('2024-01-15'),
      userId: user.id,
    },
    {
      amount: 12.30,
      category: 'Transport',
      description: 'Bus ticket',
      date: new Date('2024-01-16'),
      userId: user.id,
    },
    {
      amount: 85.00,
      category: 'Utilities',
      description: 'Internet bill',
      date: new Date('2024-01-10'),
      userId: user.id,
    },
    {
      amount: 150.00,
      category: 'Shopping',
      description: 'Groceries',
      date: new Date('2024-01-12'),
      userId: user.id,
    },
    {
      amount: 45.20,
      category: 'Entertainment',
      description: 'Movie tickets',
      date: new Date('2024-01-18'),
      userId: user.id,
    },
    {
      amount: 32.75,
      category: 'Food',
      description: 'Dinner',
      date: new Date('2024-01-20'),
      userId: user.id,
    },
    {
      amount: 15.00,
      category: 'Transport',
      description: 'Taxi ride',
      date: new Date('2024-01-21'),
      userId: user.id,
    },
  ]

  for (const expense of expenses) {
    await prisma.expense.create({
      data: expense,
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
