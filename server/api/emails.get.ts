import { getRecentEmailDispatches } from '~/server/utils/email'

export default defineEventHandler(() => {
  const emails = getRecentEmailDispatches()
  return {
    success: true,
    data: emails
  }
})
