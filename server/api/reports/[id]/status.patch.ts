import { prisma } from '~/server/utils/prisma'
import { sendTrackingEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Ticket ID required' })
  }

  const body = await readBody(event)
  const { status, assigned_tech, image_after_url, note } = body

  if (!status || !['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing status. Allowed: PENDING, IN_PROGRESS, RESOLVED'
    })
  }

  try {
    const existing = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
    }

    const updateData: any = {
      status,
      updated_at: new Date()
    }

    if (assigned_tech) {
      updateData.assigned_tech = assigned_tech
    }

    if (status === 'RESOLVED') {
      if (image_after_url) {
        updateData.image_after_url = image_after_url
      }
      updateData.sla_time = 'Completed'
    } else if (status === 'IN_PROGRESS') {
      updateData.sla_time = updateData.sla_time || 'Active on site'
    }

    // Determine status step name
    let stepName = 'Updated'
    if (status === 'IN_PROGRESS') stepName = 'Working'
    if (status === 'RESOLVED') stepName = 'Resolved'

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        ...updateData,
        status_logs: {
          create: [
            {
              status_step: stepName,
              note: note || (status === 'RESOLVED' ? 'Repair completed and verified by technician.' : 'Technician assigned and working on-site.')
            }
          ]
        }
      },
      include: {
        status_logs: {
          orderBy: { created_at: 'asc' }
        }
      }
    })

    // Trigger Email Notification (Stage 2 or 3)
    await sendTrackingEmail({
      ticketId: updatedTicket.id,
      to: updatedTicket.reporter_email,
      reporterName: updatedTicket.reporter_name || 'SPU Member',
      status: updatedTicket.status as any,
      building: updatedTicket.building,
      room: updatedTicket.room,
      category: updatedTicket.category,
      description: updatedTicket.description,
      imageBeforeUrl: updatedTicket.image_before_url,
      imageAfterUrl: updatedTicket.image_after_url,
      assignedTech: updatedTicket.assigned_tech,
      note: note || (status === 'RESOLVED' ? 'Repairs finished successfully.' : 'Technician Somchai K. is dispatched.')
    })

    return {
      success: true,
      data: updatedTicket
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Status update failed: ${err.message}`
    })
  }
})
