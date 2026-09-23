import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { created_at: 'desc' }
    })

    const statusLogs = await prisma.statusLog.findMany({
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
        }
      }
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database raw query failed: ${err.message}`
    })
  }
})
