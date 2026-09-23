// Email tracking notification utility

export interface EmailDispatchRecord {
  id: string
  ticketId: string
  to: string
  subject: string
  template: 'TICKET_RECEIVED' | 'IN_PROGRESS' | 'REPAIR_COMPLETED'
  previewText: string
  timestamp: string
  htmlBody: string
}

const recentDispatches: EmailDispatchRecord[] = []

export async function sendTrackingEmail(params: {
  ticketId: string
  to: string
  reporterName?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'
  building: string
  room: string
  category: string
  description: string
  imageBeforeUrl?: string
  imageAfterUrl?: string | null
  assignedTech?: string | null
  note?: string
}) {
  const {
    ticketId,
    to,
    reporterName = 'SPU Member',
    status,
    building,
    room,
    category,
    description,
    imageBeforeUrl,
    imageAfterUrl,
    assignedTech,
    note
  } = params

  let subject = ''
  let template: 'TICKET_RECEIVED' | 'IN_PROGRESS' | 'REPAIR_COMPLETED' = 'TICKET_RECEIVED'
  let previewText = ''

  if (status === 'PENDING') {
    template = 'TICKET_RECEIVED'
    subject = `[UniLoop SPU] Ticket #${ticketId} Received: ${category} at ${building}`
    previewText = `Your maintenance report for ${room} (${building}) has been received by SPU Facilities Team.`
  } else if (status === 'IN_PROGRESS') {
    template = 'IN_PROGRESS'
    subject = `[UniLoop SPU] Ticket #${ticketId} In Progress: Technician Dispatched`
    previewText = `${assignedTech || 'Facility Team'} is actively working on your report at ${building}, ${room}.`
  } else if (status === 'RESOLVED') {
    template = 'REPAIR_COMPLETED'
    subject = `[UniLoop SPU] Ticket #${ticketId} Resolved: Repair Completed`
    previewText = `Maintenance at ${room} (${building}) has been completed. Check out the after-repair photo.`
  }

  const htmlBody = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #4A154B 0%, #2E0D2F 100%); padding: 24px; color: white;">
        <h2 style="margin: 0; font-size: 20px;">UniLoop: SPU Facility Fix & Report</h2>
        <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 13px;">Sripatum University Campus Facilities</p>
      </div>
      <div style="padding: 24px;">
        <div style="display: inline-block; background: #FCE7F3; color: #D63384; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px;">
          ${status}
        </div>
        <h3 style="margin: 0 0 12px 0; color: #1e293b;">Hello ${reporterName},</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">${previewText}</p>
        
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <table style="width: 100%; font-size: 13px; color: #334155;">
            <tr><td style="font-weight: 600; width: 120px; padding: 4px 0;">Ticket ID:</td><td>#${ticketId}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Location:</td><td>${building}, ${room}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Category:</td><td>${category}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Technician:</td><td>${assignedTech || 'Pending Dispatch'}</td></tr>
            ${note ? `<tr><td style="font-weight: 600; padding: 4px 0;">Latest Note:</td><td>${note}</td></tr>` : ''}
          </table>
        </div>

        ${imageAfterUrl ? `
          <div style="margin: 16px 0;">
            <p style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">After-Repair Photo Verification:</p>
            <img src="${imageAfterUrl}" alt="After repair" style="width: 100%; max-height: 240px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;" />
          </div>
        ` : ''}

        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
          You can track live milestones anytime in your SPU portal. Thank you for helping keep Sripatum University safe and clean!
        </p>
      </div>
      <div style="background: #f8fafc; padding: 12px 24px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0;">
        SPU Facilities & Infrastructure Operations • Bang Khen Main Campus
      </div>
    </div>
  `

  const record: EmailDispatchRecord = {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ticketId,
    to,
    subject,
    template,
    previewText,
    timestamp: new Date().toISOString(),
    htmlBody
  }

  recentDispatches.unshift(record)
  if (recentDispatches.length > 50) recentDispatches.pop()

  console.log(`[Email Dispatched] To: ${to} | Subject: ${subject}`)
  return record
}

export function getRecentEmailDispatches() {
  return recentDispatches
}
