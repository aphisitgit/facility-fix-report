import { sendTrackingEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const targetEmail = body?.to || process.env.GMAIL_USER || 'axhtttm22@gmail.com'
  const lang = body?.lang || 'th'
  const status = body?.status || 'RESOLVED'
  const imageAfterUrl = body?.image_after_url || undefined
  const imageBeforeUrl = body?.image_before_url || undefined

  try {
    const record = await sendTrackingEmail({
      ticketId: body?.ticketId || 'TEST-VERIFY',
      to: targetEmail,
      reporterName: 'SPU Tester',
      status: status as any,
      building: 'Building 11 - Multimedia & Tech',
      room: '11-502 (Multimedia Lab)',
      category: 'Electrical & Lighting',
      description: lang === 'en' ? 'Facility Fix & Report Email Notification Test' : 'ระบบทดสอบการส่งอีเมลแจ้งเตือน Facility Fix & Report',
      imageBeforeUrl,
      imageAfterUrl,
      assignedTech: lang === 'en' ? 'SPU Facilities Engineer' : 'ฝ่ายอาคารและสถานที่ SPU',
      note: body?.note || (lang === 'en' 
        ? 'Email system connection successful and ready to dispatch live updates to reporters.' 
        : 'การเชื่อมต่อระบบอีเมลสำเร็จเรียบร้อย พร้อมส่งการแจ้งเตือนหาผู้แจ้งทุกคน'),
      lang
    })

    const smtpActive = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    const resendActive = !!process.env.RESEND_API_KEY

    return {
      success: true,
      message: `ส่งอีเมลทดสอบไปยัง ${targetEmail} เรียบร้อยแล้ว`,
      channel: smtpActive ? 'Gmail SMTP' : (resendActive ? 'Resend API' : 'Simulator'),
      target: targetEmail,
      record
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to send test email'
    }
  }
})
