import { prisma, ensureDbReady } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await ensureDbReady()
  try {
    // Delete all StatusLogs first (foreign key cascade safety)
    const deletedLogs = await prisma.statusLog.deleteMany({})
    // Delete all Tickets
    const deletedTickets = await prisma.ticket.deleteMany({})

    return {
      success: true,
      message: 'All tickets and statistics cleared successfully',
      deleted: {
        tickets: deletedTickets.count,
        statusLogs: deletedLogs.count
      }
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Failed to clear data: ${err.message}`
    })
  }
})
