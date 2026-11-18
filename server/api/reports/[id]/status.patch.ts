import { prisma, ensureDbReady } from '~/server/utils/prisma'
import { sendTrackingEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  await ensureDbReady()
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Ticket ID required' })
  }

  const body = await readBody(event)
  const { status, assigned_tech, image_after_url, note } = body

  if (!status || !['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid or missing status. Allowed: PENDING, ASSIGNED, IN_PROGRESS, RESOLVED'
    })
  }

  try {
    const existing = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Ticket not found' })
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
    } else if (status === 'ASSIGNED') {
      updateData.sla_time = updateData.sla_time || 'Technician Assigned'
    }

    // Determine status step name matching 4-step workflow
    let stepName = 'Updated'
    if (status === 'PENDING') stepName = 'Received'
    if (status === 'ASSIGNED') stepName = 'Assigned'
    if (status === 'IN_PROGRESS') stepName = 'Working'
    if (status === 'RESOLVED') stepName = 'Resolved'

    const defaultNote = status === 'RESOLVED' 
      ? 'Repair completed and verified by technician.' 
      : (status === 'IN_PROGRESS' 
        ? 'Technician is actively working on-site.' 
        : (status === 'ASSIGNED' 
          ? (assigned_tech ? `Dispatched and assigned to ${assigned_tech}.` : 'Technician assigned to ticket.')
          : 'Ticket received and queued for triage.'))

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        ...updateData,
        status_logs: {
          create: [
            {
              status_step: stepName,
              note: note || defaultNote
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

    // Trigger Email Notification (Stage 2 or 3) in reporter's chosen language
    const ticketLang = (updatedTicket as any).lang || 'th'
    const isEnTicket = ticketLang.toLowerCase() === 'en'

    const defaultMailNote = isEnTicket
      ? (status === 'RESOLVED' ? 'Repairs finished successfully.' : 'Technician assigned and dispatched.')
      : (status === 'RESOLVED' ? 'ดำเนินการซ่อมแซมและตรวจสอบความเรียบร้อยแล้ว' : 'มอบหมายงานและทีมช่างเตรียมความพร้อมเข้าตรวจสอบ')

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
      note: note || defaultMailNote,
      lang: ticketLang
    })

    return {
      success: true,
      data: updatedTicket
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusCode === 404 ? 'Not Found' : 'Internal Server Error',
      message: `Status update failed: ${err.message}`
    })
  }
})
