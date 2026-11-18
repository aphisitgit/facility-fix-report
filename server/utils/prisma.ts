import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'

let prisma: PrismaClient

declare global {
  var __db__: PrismaClient | undefined
}

function resolveDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || 'file:./dev.db'

  // On Vercel serverless Lambda, /var/task is read-only.
  // Copy SQLite db to writable /tmp directory if running on Vercel with SQLite file
  if (process.env.VERCEL && url.startsWith('file:')) {
    const tmpDbPath = '/tmp/dev.db'
    if (!fs.existsSync(tmpDbPath)) {
      const possibleSources = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(process.cwd(), '.output', 'server', 'prisma', 'dev.db'),
        path.join(process.cwd(), '.output', 'server', 'dev.db')
      ]
      for (const src of possibleSources) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath)
            break
          } catch (e) {
            console.error('[Prisma] Failed to copy db to /tmp:', e)
          }
        }
      }
    }
    return `file:${tmpDbPath}`
  }

  return url
}

const dbUrl = resolveDatabaseUrl()

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
