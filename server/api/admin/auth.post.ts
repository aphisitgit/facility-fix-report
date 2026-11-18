import { prisma, ensureDbReady } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await ensureDbReady()
  const body = await readBody(event)
  const username = body?.username?.trim()
  const password = body?.password?.trim()

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'กรุณากรอกรหัสผ่าน'
    })
  }

  try {
    // If username is provided, query specific user
    if (username) {
      const user = await prisma.adminUser.findUnique({
        where: { username }
      })

      if (user && user.password === password) {
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            phone: user.phone,
            avatar_url: user.avatar_url
          },
          message: `เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ ${user.name}`
        }
      }
    } else {
      // Legacy / master password fallback
      const validMasterPasswords = [
        process.env.ADMIN_PASSWORD || 'admin1234',
        'spuadmin',
        'admin1234',
        '1234'
      ]

      if (validMasterPasswords.includes(password)) {
        // Find default admin or return Praew
        const defaultAdmin = await prisma.adminUser.findFirst({
          where: { username: 'admin' }
        })

        return {
          success: true,
          user: defaultAdmin ? {
            id: defaultAdmin.id,
            username: defaultAdmin.username,
            name: defaultAdmin.name,
            role: defaultAdmin.role,
            phone: defaultAdmin.phone,
            avatar_url: defaultAdmin.avatar_url
          } : {
            id: 'admin-01',
            username: 'admin',
            name: 'Praew Suksom',
            role: 'Operations Director',
            phone: '02-555-5555 ต่อ 101'
          },
          message: 'เข้าสู่ระบบผู้ดูแลระบบสำเร็จ'
        }
      }
    }

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
    })
  } catch (err: any) {
    if (err.statusCode === 401 || err.statusCode === 400) {
      throw err
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `เข้าสู่ระบบล้มเหลว: ${err.message}`
    })
  }
})
