import { prisma, ensureDbReady } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  await ensureDbReady()
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { created_at: 'desc' }
    })

    const statusLogs = await prisma.statusLog.findMany({
      orderBy: { created_at: 'desc' }
    })

    const adminUsers = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        phone: true,
        avatar_url: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    })

    return {
      success: true,
      database: 'SQLite (prisma/dev.db)',
      tables: {
        tickets: {
          count: tickets.length,
          columns: ['id', 'building', 'floor', 'room', 'category', 'urgency', 'description', 'image_before_url', 'image_after_url', 'reporter_email', 'status', 'assigned_tech', 'sla_time', 'created_at'],
          rows: tickets
        },
        status_logs: {
          count: statusLogs.length,
          columns: ['id', 'ticket_id', 'status_step', 'note', 'created_at'],
          rows: statusLogs
        },
        admin_users: {
          count: adminUsers.length,
          columns: ['id', 'username', 'name', 'role', 'phone', 'created_at'],
          rows: adminUsers
        }
      }
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Database raw query failed: ${err.message}`
    })
  }
})
