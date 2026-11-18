import { ensureDbReady } from '../utils/prisma'

export default defineNitroPlugin(async () => {
  try {
    await ensureDbReady()
    console.log('[Nitro Plugin] Database self-healing check complete.')
  } catch (err: any) {
    console.error('[Nitro Plugin] Database init error:', err?.message || err)
  }
})
