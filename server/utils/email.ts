// Email tracking notification utility
import nodemailer from 'nodemailer'

export interface EmailDispatchRecord {
  id: string
  ticketId: string
  to: string
  subject: string
  template: 'TICKET_RECEIVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'REPAIR_COMPLETED'
  previewText: string
  timestamp: string
  htmlBody: string
}

const recentDispatches: EmailDispatchRecord[] = []

// SMTP Transporter Helper (supports Gmail SMTP and Custom SMTP)
let smtpTransporter: nodemailer.Transporter | null = null
let cachedSmtpUser = ''
let cachedSmtpPass = ''

function getSmtpTransporter() {
  const smtpUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim()
  const smtpPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').trim()

  if (!smtpUser || !smtpPass) return null

  const cleanPass = smtpPass.replace(/\s+/g, '') // remove spaces from Google 16-character App Password
  if (smtpTransporter && cachedSmtpUser === smtpUser && cachedSmtpPass === cleanPass) {
    return smtpTransporter
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT) || 465
  const isSecure = port === 465 || process.env.SMTP_SECURE === 'true'

  smtpTransporter = nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user: smtpUser,
      pass: cleanPass
    }
  })

  cachedSmtpUser = smtpUser
  cachedSmtpPass = cleanPass

  return smtpTransporter
}

interface ParsedImageData {
  contentType: string
  extension: string
  buffer: Buffer
  base64String: string
}

function parseBase64DataUri(dataUri?: string | null): ParsedImageData | null {
  if (!dataUri || typeof dataUri !== 'string') return null
  const match = dataUri.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/)
  if (!match) return null

  const rawType = match[1].toLowerCase()
  const base64Data = match[2].trim()

  let contentType = `image/${rawType}`
  let extension = rawType
  if (rawType === 'jpeg' || rawType === 'jpg') {
    contentType = 'image/jpeg'
    extension = 'jpg'
  } else if (rawType === 'png') {
    contentType = 'image/png'
    extension = 'png'
  } else if (rawType === 'webp') {
    contentType = 'image/webp'
    extension = 'webp'
  } else if (rawType === 'gif') {
    contentType = 'image/gif'
    extension = 'gif'
  }

  try {
    const buffer = Buffer.from(base64Data, 'base64')
    return {
      contentType,
      extension,
      buffer,
      base64String: base64Data
    }
  } catch {
    return null
  }
}

function renderEmailTemplate(params: {
  isEn: boolean
  ticketTitle: string
  statusBadgeText: string
  previewText: string
  building: string
  room: string
  category: string
  assignedTech?: string | null
  note?: string
  afterImgSrc?: string | null
  beforeImgSrc?: string | null
}) {
  const {
    isEn,
    ticketTitle,
    statusBadgeText,
    previewText,
    building,
    room,
    category,
    assignedTech,
    note,
    afterImgSrc,
    beforeImgSrc
  } = params

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #4A154B 0%, #2E0D2F 100%); padding: 24px; color: white;">
        <h2 style="margin: 0; font-size: 20px;">Facility Fix & Report</h2>
        <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 13px;">${isEn ? 'Sripatum University Campus Facilities' : 'ระบบรับแจ้งซ่อมและรายงานปัญหาสิ่งอำนวยความสะดวก อาคารสถานที่ มหาวิทยาลัยศรีปทุม'}</p>
      </div>
      <div style="padding: 24px;">
        <div style="display: inline-block; background: #FCE7F3; color: #D63384; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
          ${statusBadgeText}
        </div>
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 18px;">${isEn ? 'Hello' : 'สวัสดี'}</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">${previewText}</p>
        
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <table style="width: 100%; font-size: 13px; color: #334155; border-collapse: collapse;">
            <tr>
              <td style="font-weight: 600; width: 140px; padding: 6px 0; color: #64748b;">${isEn ? 'Ticket ID:' : 'รหัสแจ้งซ่อม:'}</td>
              <td style="font-weight: bold; color: #1e293b; padding: 6px 0;">${ticketTitle}</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 6px 0; color: #64748b;">${isEn ? 'Location:' : 'พิกัดสถานที่:'}</td>
              <td style="padding: 6px 0;">${building}, ${room}</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 6px 0; color: #64748b;">${isEn ? 'Category:' : 'หมวดหมู่ปัญหา:'}</td>
              <td style="padding: 6px 0;">${category}</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 6px 0; color: #64748b;">${isEn ? 'Technician:' : 'ช่างผู้รับผิดชอบ:'}</td>
              <td style="padding: 6px 0; font-weight: 500;">${assignedTech || (isEn ? 'Pending Dispatch' : 'อยู่ระหว่างจัดสรรช่าง')}</td>
            </tr>
            ${note ? `
            <tr>
              <td style="font-weight: 600; padding: 6px 0; color: #64748b;">${isEn ? 'Latest Note:' : 'บันทึกความคืบหน้า:'}</td>
              <td style="padding: 6px 0; color: #0284c7;">${note}</td>
            </tr>` : ''}
          </table>
        </div>

        ${afterImgSrc ? `
          <div style="margin: 18px 0; padding: 14px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px;">
            <p style="font-size: 13px; font-weight: 700; color: #166534; margin: 0 0 8px 0;">
              📸 ${isEn ? 'After-Repair Photo Verification:' : 'รูปถ่ายยืนยันหลังการซ่อมบำรุงเสร็จสิ้น:'}
            </p>
            <div style="text-align: center; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
              <img src="${afterImgSrc}" alt="After repair" style="width: 100%; max-width: 550px; height: auto; max-height: 380px; object-fit: cover; display: block; margin: 0 auto;" />
            </div>
          </div>
        ` : (beforeImgSrc ? `
          <div style="margin: 18px 0; padding: 14px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px;">
            <p style="font-size: 13px; font-weight: 700; color: #334155; margin: 0 0 8px 0;">
              📸 ${isEn ? 'Reported Issue Photo:' : 'รูปภาพปัญหาที่แจ้ง:'}
            </p>
            <div style="text-align: center; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
              <img src="${beforeImgSrc}" alt="Reported issue" style="width: 100%; max-width: 550px; height: auto; max-height: 380px; object-fit: cover; display: block; margin: 0 auto;" />
            </div>
          </div>
        ` : '')}

        <p style="color: #64748b; font-size: 12px; margin-top: 20px; line-height: 1.5;">
          ${isEn 
            ? 'You can track live milestones anytime in your SPU portal. Thank you for helping keep Sripatum University safe and clean!' 
            : 'ท่านสามารถติดตามสถานะการซ่อมบำรุงแบบเรียลไทม์ได้ตลอดเวลาผ่านทางระบบ SPU Facility Portal ขอบคุณที่ร่วมเป็นส่วนหนึ่งในการดูแลมหาวิทยาลัยศรีปทุม'}
        </p>
      </div>
      <div style="background: #f8fafc; padding: 12px 24px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0;">
        ${isEn 
          ? 'SPU Facilities & Infrastructure Operations • Sripatum University' 
          : 'ฝ่ายบริหารจัดการอาคารสถานที่และระบบสาธารณูปโภค • Sripatum University'}
      </div>
    </div>
  `
}

export async function sendTrackingEmail(params: {
  ticketId: string
  to: string
  reporterName?: string
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'
  building: string
  room: string
  category: string
  description: string
  imageBeforeUrl?: string | null
  imageAfterUrl?: string | null
  assignedTech?: string | null
  note?: string
  lang?: 'th' | 'en' | string
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
    note,
    lang = 'th'
  } = params

  const isEn = lang?.toLowerCase() === 'en'

  let subject = ''
  let template: 'TICKET_RECEIVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'REPAIR_COMPLETED' = 'TICKET_RECEIVED'
  let previewText = ''
  let statusBadgeText = ''

  const ticketTitle = ticketId?.startsWith('Ticket') ? ticketId : `Ticket #${ticketId}`

  if (isEn) {
    if (status === 'PENDING') {
      template = 'TICKET_RECEIVED'
      subject = `[Facility Fix & Report] ${ticketTitle} Received: ${category} at ${building}`
      previewText = `Your maintenance report for ${room} (${building}) has been received by SPU Facilities Team.`
      statusBadgeText = 'RECEIVED'
    } else if (status === 'ASSIGNED') {
      template = 'ASSIGNED'
      subject = `[Facility Fix & Report] ${ticketTitle} Assigned: Technician Designated`
      previewText = `Your maintenance report for ${room} (${building}) has been assigned to ${assignedTech || 'Lead Technician'}.`
      statusBadgeText = 'ASSIGNED'
    } else if (status === 'IN_PROGRESS') {
      template = 'IN_PROGRESS'
      subject = `[Facility Fix & Report] ${ticketTitle} In Progress: Technician Working On-Site`
      previewText = `${assignedTech || 'Facility Team'} is actively working on your report at ${building}, ${room}.`
      statusBadgeText = 'IN PROGRESS'
    } else if (status === 'RESOLVED') {
      template = 'REPAIR_COMPLETED'
      subject = `[Facility Fix & Report] ${ticketTitle} Resolved: Repair Completed`
      previewText = `Maintenance at ${room} (${building}) has been completed. Check out the after-repair photo.`
      statusBadgeText = 'RESOLVED'
    }
  } else {
    // Thai (Default)
    if (status === 'PENDING') {
      template = 'TICKET_RECEIVED'
      subject = `[Facility Fix & Report] ${ticketTitle} รับเรื่องแล้ว: ${category} (${building})`
      previewText = `ฝ่ายอาคารและสถานที่ได้รับข้อมูลแจ้งซ่อมสำหรับ ${room} (${building}) เรียบร้อยแล้ว ทีมงานกำลังเร่งประสานงานช่างที่เกี่ยวข้อง`
      statusBadgeText = 'รับเรื่องแล้ว'
    } else if (status === 'ASSIGNED') {
      template = 'ASSIGNED'
      subject = `[Facility Fix & Report] ${ticketTitle} มอบหมายช่างแล้ว: ${assignedTech || 'ช่างประจำจุด'}`
      previewText = `รายการแจ้งซ่อมสำหรับ ${room} (${building}) ได้รับการมอบหมายให้ ${assignedTech || 'ช่างเทคนิคประจำจุด'} เรียบร้อยแล้ว กำลังเตรียมความพร้อมเข้าตรวจสอบพื้นที่`
      statusBadgeText = 'มอบหมายช่างแล้ว'
    } else if (status === 'IN_PROGRESS') {
      template = 'IN_PROGRESS'
      subject = `[Facility Fix & Report] ${ticketTitle} กำลังดำเนินการซ่อม: ${building}, ${room}`
      previewText = `${assignedTech || 'ทีมช่างอาคารและสถานที่'} กำลังดำเนินการแก้ไขปัญหาในพื้นที่ ณ ${building}, ${room}`
      statusBadgeText = 'กำลังเร่งซ่อมบำรุง'
    } else if (status === 'RESOLVED') {
      template = 'REPAIR_COMPLETED'
      subject = `[Facility Fix & Report] ${ticketTitle} ซ่อมเสร็จสิ้นแล้ว: ${room} (${building})`
      previewText = `การซ่อมบำรุงและแก้ไขปัญหา ณ ${room} (${building}) เสร็จสิ้นเรียบร้อยแล้ว ท่านสามารถตรวจสอบรูปถ่ายยืนยันหลังการซ่อมได้ด้านล่างนี้`
      statusBadgeText = 'ซ่อมเสร็จสิ้นเรียบร้อย'
    }
  }

  // Parse any base64 images so that Gmail can render them inline via RFC 2822 CID attachment
  // (Gmail's Google Image Proxy requires addr-spec format e.g. <name@domain> to resolve inline images)
  const parsedAfter = parseBase64DataUri(imageAfterUrl)
  const parsedBefore = parseBase64DataUri(imageBeforeUrl)

  const nodemailerAttachments: any[] = []
  let emailAfterSrc = imageAfterUrl
  let emailBeforeSrc = imageBeforeUrl

  const afterCid = `after-repair-photo@spu-facilities`
  const beforeCid = `reported-issue-photo@spu-facilities`

  if (parsedAfter) {
    nodemailerAttachments.push({
      filename: `after-repair-verification.${parsedAfter.extension}`,
      content: parsedAfter.buffer,
      cid: afterCid,
      contentType: parsedAfter.contentType,
      contentDisposition: 'inline',
      headers: {
        'Content-ID': `<${afterCid}>`
      }
    })
    emailAfterSrc = `cid:${afterCid}`
  }

  if (parsedBefore) {
    nodemailerAttachments.push({
      filename: `reported-issue.${parsedBefore.extension}`,
      content: parsedBefore.buffer,
      cid: beforeCid,
      contentType: parsedBefore.contentType,
      contentDisposition: 'inline',
      headers: {
        'Content-ID': `<${beforeCid}>`
      }
    })
    emailBeforeSrc = `cid:${beforeCid}`
  }

  // HTML for browser toast / in-app preview simulator (renders base64 data URIs directly)
  const browserHtmlBody = renderEmailTemplate({
    isEn,
    ticketTitle,
    statusBadgeText,
    previewText,
    building,
    room,
    category,
    assignedTech,
    note,
    afterImgSrc: imageAfterUrl,
    beforeImgSrc: imageBeforeUrl
  })

  // HTML for actual email delivery (uses cid: references so Gmail displays inline attachments)
  const emailHtmlBody = renderEmailTemplate({
    isEn,
    ticketTitle,
    statusBadgeText,
    previewText,
    building,
    room,
    category,
    assignedTech,
    note,
    afterImgSrc: emailAfterSrc,
    beforeImgSrc: emailBeforeSrc
  })

  const record: EmailDispatchRecord = {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ticketId,
    to,
    subject,
    template,
    previewText,
    timestamp: new Date().toISOString(),
    htmlBody: browserHtmlBody
  }

  recentDispatches.unshift(record)
  if (recentDispatches.length > 50) recentDispatches.pop()

  console.log(`[Email Dispatched] To: ${to} | Subject: ${subject} | Attachments: ${nodemailerAttachments.length}`)

  // 1. Real Email Delivery via Gmail SMTP (Priority: Sends to ANY email address, no custom domain required)
  const smtp = getSmtpTransporter()
  if (smtp) {
    try {
      const smtpUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim()
      let from = process.env.EMAIL_FROM || `SPU Facility Fix & Report <${smtpUser}>`
      if (from.includes('resend.dev') && smtpUser) {
        from = `SPU Facility Fix & Report <${smtpUser}>`
      }
      const info = await smtp.sendMail({
        from,
        to,
        subject,
        html: emailHtmlBody,
        attachments: nodemailerAttachments
      })
      console.log(`[Real Email Delivered via Gmail SMTP] MessageId: ${info.messageId} to ${to}`)
      return record
    } catch (err: any) {
      console.error(`[Gmail SMTP Delivery Error] ${err.message}`)
    }
  }

  // Real Email Delivery via Resend API (if configured in .env)
  if (process.env.RESEND_API_KEY) {
    try {
      const resendAttachments: any[] = []
      if (parsedAfter) {
        resendAttachments.push({
          filename: `after-repair-verification.${parsedAfter.extension}`,
          content: parsedAfter.base64String
        })
      }
      if (parsedBefore) {
        resendAttachments.push({
          filename: `reported-issue.${parsedBefore.extension}`,
          content: parsedBefore.base64String
        })
      }

      const resendFrom = process.env.EMAIL_FROM || 'SPU Facility Report <onboarding@resend.dev>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [to],
          subject: subject,
          html: emailHtmlBody,
          attachments: resendAttachments.length > 0 ? resendAttachments : undefined
        })
      })
      let resData = await res.json()

      // If testing on onboarding@resend.dev and recipient is not account owner, forward test copy to account owner
      if (!res.ok && res.status === 403 && resData.message?.includes('only send testing emails')) {
        const ownerEmailMatch = resData.message.match(/\(([^)]+)\)/)
        const ownerEmail = ownerEmailMatch ? ownerEmailMatch[1] : 'axhtttm22@gmail.com'
        console.warn(`[Resend Notice] Free onboarding domain can only deliver to ${ownerEmail}. Forwarding test email...`)

        const fallbackRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [ownerEmail],
            subject: `[Test for ${to}] ${subject}`,
            html: `<div style="background:#fef3c7;padding:12px;margin-bottom:16px;border-radius:8px;font-family:sans-serif;font-size:12px;color:#92400e;">
              <strong>ℹ️ Resend Testing Notice:</strong> อีเมลนี้ถูกส่งมายังบัญชีของคุณ (<code>${ownerEmail}</code>) เนื่องจากส่งถึงผู้แจ้ง <code>${to}</code> ระหว่างใช้โดเมนทดสอบ <code>onboarding@resend.dev</code> (หากต้องการส่งถึงอีเมลภายนอกทุกคน สามารถยืนยันโดเมนได้ที่ resend.com/domains)
            </div>` + emailHtmlBody,
            attachments: resendAttachments.length > 0 ? resendAttachments : undefined
          })
        })
        resData = await fallbackRes.json()
        if (fallbackRes.ok) {
          console.log(`[Real Email Delivered to Tester Inbox via Resend] ID: ${resData.id} (Intended for ${to})`)
        }
      } else if (res.ok) {
        console.log(`[Real Email Delivered via Resend] ID: ${resData.id} to ${to}`)
      } else {
        console.warn(`[Resend Delivery Warning] ${JSON.stringify(resData)}`)
      }
    } catch (err: any) {
      console.error(`[Resend Network Error] ${err.message}`)
    }
  }

  // Real Email Delivery via Brevo API (if configured in .env)
  if (process.env.BREVO_API_KEY) {
    try {
      const brevoFrom = process.env.EMAIL_FROM || 'admin@spu.ac.th'
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'SPU Facility Fix & Report', email: brevoFrom },
          to: [{ email: to, name: reporterName }],
          subject: subject,
          htmlContent: emailHtmlBody
        })
      })
      const resData = await res.json()
      if (res.ok) {
        console.log(`[Real Email Delivered via Brevo] MessageId: ${resData.messageId} to ${to}`)
      } else {
        console.warn(`[Brevo Delivery Warning] ${JSON.stringify(resData)}`)
      }
    } catch (err: any) {
      console.error(`[Brevo Network Error] ${err.message}`)
    }
  }

  return record
}

export function getRecentEmailDispatches() {
  return recentDispatches
}
