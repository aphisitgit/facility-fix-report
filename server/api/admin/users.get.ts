import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        phone: true,
        avatar_url: true,
        created_at: true
      },
      orderBy: {
        created_at: 'asc'
      }
    })

    return {
      success: true,
      data: users
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Failed to fetch admin users: ${err.message}`
    })
  }
})
