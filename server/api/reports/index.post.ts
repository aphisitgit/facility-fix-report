import { prisma, ensureDbReady } from '~/server/utils/prisma'
import { sendTrackingEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  await ensureDbReady()
  const body = await readBody(event)

  const {
    building,
    floor,
    room,
    category,
    urgency = 'Normal',
    description,
    image_before_url,
    reporter_email,
    reporter_name,
    lang = 'th'
  } = body

  if (!building || !room || !category || !description || !reporter_email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Missing required fields: building, room, category, description, reporter_email'
    })
  }

  // Generate sequential Ticket ID (e.g. Ticket 1, Ticket 2, Ticket 3...)
  const existingTickets = await prisma.ticket.findMany({
    select: { id: true }
  })

  let maxSeq = 0
  for (const t of existingTickets) {
    const match = t.id.match(/^Ticket\s*[-#]?\s*(\d+)$/i)
    if (match) {
      const num = parseInt(match[1], 10)
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num
      }
    }
  }

  let nextSeq = maxSeq > 0 ? maxSeq + 1 : (existingTickets.length > 0 ? existingTickets.length + 1 : 1)
  let ticketId = `Ticket ${nextSeq}`

  // Guard against any ID collision
  while (await prisma.ticket.findUnique({ where: { id: ticketId } })) {
    nextSeq++
    ticketId = `Ticket ${nextSeq}`
  }

  const defaultImage = image_before_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'

  try {
    const ticket = await prisma.ticket.create({
      data: {
        id: ticketId,
        building: String(building),
        floor: String(floor || '1'),
        room: String(room),
        category: String(category),
        urgency: String(urgency),
        description: String(description),
        image_before_url: defaultImage,
        reporter_email: String(reporter_email),
        reporter_name: reporter_name || reporter_email.split('@')[0],
        lang: String(lang || 'th'),
        status: 'PENDING',
        sla_time: urgency === 'Urgent' ? '30m triage SLA' : '24h standard SLA',
        status_logs: {
          create: [
            {
              status_step: 'Received',
              note: lang === 'en' ? 'Ticket received via UniLoop mobile portal.' : 'ระบบได้รับรายงานแจ้งซ่อมเรียบร้อยแล้ว'
            }
          ]
        }
      },
      include: {
        status_logs: true
      }
    })

    // Trigger multi-stage email notification (Stage 1: Ticket Received)
    await sendTrackingEmail({
      ticketId: ticket.id,
      to: ticket.reporter_email,
      reporterName: ticket.reporter_name || 'SPU Member',
      status: 'PENDING',
      building: ticket.building,
      room: ticket.room,
      category: ticket.category,
      description: ticket.description,
      imageBeforeUrl: ticket.image_before_url,
      note: lang === 'en' ? 'Your ticket has been queued for technician assignment.' : 'รายงานแจ้งซ่อมอยู่ระหว่างเตรียมความพร้อมและจัดสรรช่าง',
      lang: (ticket as any).lang || lang || 'th'
    })

    return {
      success: true,
      data: ticket
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Failed to create report: ${err.message}`
    })
  }
})
