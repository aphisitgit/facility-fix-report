import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'

let prisma: PrismaClient

declare global {
  var __db__: PrismaClient | undefined
  var __dbReady__: boolean | undefined
}

function resolveDatabaseUrl(): string {
  let url = (process.env.DATABASE_URL || 'file:./dev.db').trim()
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim()
  }

  // On Vercel serverless Lambda, /var/task is read-only.
  // Use writable /tmp directory if running on Vercel with SQLite
  if (process.env.VERCEL && (url.startsWith('file:') || !url.includes('://'))) {
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
process.env.DATABASE_URL = dbUrl

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

let dbReadyPromise: Promise<void> | null = null

export async function ensureDbReady(): Promise<void> {
  if (global.__dbReady__) return

  if (!dbReadyPromise) {
    dbReadyPromise = (async () => {
      try {
        // 1. Create Ticket table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Ticket" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "building" TEXT NOT NULL,
            "floor" TEXT NOT NULL,
            "room" TEXT NOT NULL,
            "category" TEXT NOT NULL,
            "urgency" TEXT NOT NULL DEFAULT 'Normal',
            "description" TEXT NOT NULL,
            "image_before_url" TEXT NOT NULL,
            "image_after_url" TEXT,
            "reporter_email" TEXT NOT NULL,
            "reporter_name" TEXT,
            "status" TEXT NOT NULL DEFAULT 'PENDING',
            "assigned_tech" TEXT,
            "sla_time" TEXT,
            "likes" INTEGER NOT NULL DEFAULT 0,
            "comments_count" INTEGER NOT NULL DEFAULT 0,
            "rating" INTEGER,
            "lang" TEXT DEFAULT 'th',
            "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `)

        // 2. Create StatusLog table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "StatusLog" (
            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "ticket_id" TEXT NOT NULL,
            "status_step" TEXT NOT NULL,
            "note" TEXT,
            "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("ticket_id") REFERENCES "Ticket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `)

        // 3. Create AdminUser table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "AdminUser" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "username" TEXT NOT NULL UNIQUE,
            "password" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "role" TEXT NOT NULL DEFAULT 'Technician',
            "phone" TEXT,
            "avatar_url" TEXT,
            "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `)

        // 4. Seed default admin and staff accounts if table is empty
        const checkResult = await prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*) as count FROM "AdminUser"`)
        const count = checkResult && checkResult[0] ? Number(checkResult[0].count) : 0
        if (count === 0) {
          await prisma.$executeRawUnsafe(`
            INSERT OR IGNORE INTO "AdminUser" ("id", "username", "password", "name", "role", "phone", "avatar_url", "created_at", "updated_at")
            VALUES
              ('admin-1', 'admin', 'admin1234', 'Praew Suksom', 'Operations Director', '02-579-1111 #101', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              ('tech-1', 'somchai', 'admin1234', 'ช่างสมชาย กิจเจริญ', 'ช่างแอร์และเครื่องกล (HVAC Lead)', '081-234-5678', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              ('tech-2', 'niran', 'admin1234', 'ช่างนิรันดร์ วงศ์แก้ว', 'ช่างไฟฟ้าอาวุโส (Senior Electrician)', '082-345-6789', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              ('tech-3', 'wichai', 'admin1234', 'ช่างวิชัย นิ่มนวล', 'ช่างโสตทัศนูปกรณ์ & IT (AV Tech)', '083-456-7890', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              ('tech-4', 'manop', 'admin1234', 'ช่างมานพ ดูแลอาคาร 11', 'ช่างซ่อมบำรุงทั่วไป (General Maintenance)', '084-567-8901', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              ('tech-5', 'god2544', 'admin1234', 'ช่างก้องภพ สุขใจ', 'ช่างประปาและสุขภัณฑ์ (Plumbing & Sanitary)', '085-678-9012', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
          `)
        }

        global.__dbReady__ = true
      } catch (err: any) {
        console.error('[Prisma] Database self-healing check error:', err?.message || err)
      } finally {
        dbReadyPromise = null
      }
    })()
  }

  await dbReadyPromise
}

export { prisma }
