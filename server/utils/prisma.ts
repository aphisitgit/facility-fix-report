import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  var __db__: PrismaClient | undefined
}

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'

const prismaOptions = {
  datasources: {
    db: {
      url: dbUrl
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaOptions)
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient(prismaOptions)
  }
  prisma = global.__db__
}

export { prisma }
