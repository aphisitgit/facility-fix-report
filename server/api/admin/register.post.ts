import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = body?.username?.trim()?.toLowerCase()
  const password = body?.password?.trim()
  const name = body?.name?.trim()
  const role = body?.role?.trim() || 'ช่างซ่อมบำรุงทั่วไป (General Maintenance)'
  const phone = body?.phone?.trim() || ''
  const inviteCode = body?.inviteCode?.trim()

  // Basic validation
  if (!username || !password || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน: ชื่อผู้ใช้ (Username), รหัสผ่าน และชื่อ-นามสกุล'
    })
  }

  if (username.length < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'ชื่อผู้ใช้ (Username) ต้องมีความยาวอย่างน้อย 3 ตัวอักษร'
    })
  }

  if (password.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร'
    })
  }

  // Security code check if provided
  if (inviteCode && inviteCode !== 'SPU2025' && inviteCode !== 'admin1234' && inviteCode !== 'spuadmin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'รหัสยืนยันเจ้าหน้าที่ (Staff Passcode) ไม่ถูกต้อง กรุณาติดต่อหัวหน้างาน'
    })
  }

  try {
    // Check if username exists
    const existing = await prisma.adminUser.findUnique({
      where: { username }
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: `ชื่อผู้ใช้ "${username}" มีผู้ใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้อื่น`
      })
    }

    const newUser = await prisma.adminUser.create({
      data: {
        username,
        password,
        name,
        role,
        phone,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      }
    })

    return {
      success: true,
      message: `ลงทะเบียนเจ้าหน้าที่สำเร็จ ยินดีต้อนรับคุณ ${newUser.name}`,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        avatar_url: newUser.avatar_url
      }
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `ไม่สามารถลงทะเบียนได้: ${err.message}`
    })
  }
})
