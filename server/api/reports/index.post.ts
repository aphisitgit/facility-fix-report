import { prisma } from '~/server/utils/prisma'
import { sendTrackingEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
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
    reporter_name
  } = body

  if (!building || !room || !category || !description || !reporter_email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: building, room, category, description, reporter_email'
    })
  }

  // Generate next SPU ticket ID
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const ticketId = `SPU-${randomNum}`

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
        status: 'PENDING',
        sla_time: urgency === 'Urgent' ? '30m triage SLA' : '24h standard SLA',
        status_logs: {
          create: [
            {
              status_step: 'Received',
              note: 'Ticket received via UniLoop mobile portal.'
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
      note: 'Your ticket has been queued for technician assignment.'
    })

    return {
      success: true,
      data: ticket
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create report: ${err.message}`
    })
  }
})
