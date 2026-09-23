import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status as string | undefined
  const building = query.building as string | undefined
  const search = query.search as string | undefined

  const where: any = {}

  if (status && status !== 'ALL') {
    where.status = status
  }

  if (building && building !== 'ALL' && building !== 'All Buildings') {
    where.building = {
      contains: building
    }
  }

  if (search && search.trim() !== '') {
    const s = search.trim()
    where.OR = [
      { id: { contains: s } },
      { room: { contains: s } },
      { building: { contains: s } },
      { category: { contains: s } },
      { reporter_email: { contains: s } },
      { reporter_name: { contains: s } },
      { description: { contains: s } }
    ]
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        status_logs: {
          orderBy: { created_at: 'asc' }
        }
      }
    })

    return {
      success: true,
      data: tickets,
      count: tickets.length
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch reports: ${err.message}`
    })
  }
})
