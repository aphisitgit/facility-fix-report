export interface AdminNotification {
  id: string
  ticketId: string
  title: string
  building: string
  floor: string
  room: string
  category: string
  urgency: string
  status: string
  description: string
  reporterEmail: string
  reporterName?: string
  createdAt: string
  read: boolean
}

export const useAdminNotifications = () => {
  const adminAuth = useAdminAuth()

  const notifications = useState<AdminNotification[]>('spu_admin_notifications', () => [])
  const isNotificationOpen = useState<boolean>('spu_admin_notification_open', () => false)
  const isPermissionModalOpen = useState<boolean>('spu_admin_permission_modal_open', () => false)
  const incomingToast = useState<AdminNotification | null>('spu_admin_incoming_toast', () => null)
  const soundEnabled = useState<boolean>('spu_admin_sound_enabled', () => true)
  const lastKnownTicketIds = useState<string[]>('spu_last_ticket_ids', () => [])
  const isFirstLoad = useState<boolean>('spu_notif_first_load', () => true)

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  // Play subtle high-quality chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled.value || typeof window === 'undefined') return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime

      // First pleasant note (F5: 698.46 Hz)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(698.46, now)
      gain1.gain.setValueAtTime(0.12, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.3)

      // Second higher chime note (A5: 880 Hz)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(880, now + 0.1)
      gain2.gain.setValueAtTime(0.18, now + 0.1)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.1)
      osc2.stop(now + 0.45)
    } catch {
      // Audio playback fails gracefully if user hasn't interacted with page yet
    }
  }

  // Load read status from localStorage
  const getReadIds = (): string[] => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('spu_read_notification_ids')
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  }

  const saveReadIds = (ids: string[]) => {
    if (import.meta.client) {
      try {
        localStorage.setItem('spu_read_notification_ids', JSON.stringify(ids))
      } catch {
        // ignore
      }
    }
  }

  // Fetch tickets and format them into notification items
  const fetchNotifications = async () => {
    try {
      const res = await $fetch<any>('/api/reports')
      if (res && res.success && Array.isArray(res.data)) {
        const readIds = getReadIds()
        const currentIds = res.data.map((t: any) => t.id)

        // Check for brand new tickets incoming
        if (!isFirstLoad.value && lastKnownTicketIds.value.length > 0) {
          const brandNewTickets = res.data.filter((t: any) => !lastKnownTicketIds.value.includes(t.id))
          
          if (brandNewTickets.length > 0) {
            const latest = brandNewTickets[0]
            const notifItem: AdminNotification = {
              id: `notif-${latest.id}`,
              ticketId: latest.id,
              title: latest.urgency === 'Urgent' 
                ? `🚨 แจ้งซ่อมด่วน: [${latest.room}] ${latest.building}`
                : `📋 แจ้งซ่อมใหม่: [${latest.room}] ${latest.building}`,
              building: latest.building,
              floor: latest.floor,
              room: latest.room,
              category: latest.category,
              urgency: latest.urgency,
              status: latest.status,
              description: latest.description,
              reporterEmail: latest.reporter_email,
              reporterName: latest.reporter_name,
              createdAt: latest.created_at,
              read: false
            }

            // ONLY alert if user is authenticated as Admin!
            if (adminAuth.isAdmin.value) {
              incomingToast.value = notifItem
              playChime()
            }
          }
        }

        lastKnownTicketIds.value = currentIds
        isFirstLoad.value = false

        // Map all tickets to notifications list
        notifications.value = res.data.map((t: any) => {
          const isUrgent = t.urgency === 'Urgent'
          const prefix = isUrgent ? '🚨 แจ้งซ่อมด่วน' : (t.status === 'RESOLVED' ? '✅ ซ่อมเสร็จสิ้น' : '📋 แจ้งซ่อมใหม่')
          
          return {
            id: `notif-${t.id}`,
            ticketId: t.id,
            title: `${prefix}: [${t.room}] ${t.building}`,
            building: t.building,
            floor: t.floor,
            room: t.room,
            category: t.category,
            urgency: t.urgency,
            status: t.status,
            description: t.description,
            reporterEmail: t.reporter_email,
            reporterName: t.reporter_name,
            createdAt: t.created_at,
            read: readIds.includes(t.id)
          }
        })
      }
    } catch {
      // Quiet fail on network blips
    }
  }

  // Open notification action: ONLY ADMIN can view!
  const openNotificationCenter = () => {
    if (adminAuth.isAdmin.value) {
      isNotificationOpen.value = true
    } else {
      isPermissionModalOpen.value = true
    }
  }

  const markAsRead = (ticketId: string) => {
    const readIds = getReadIds()
    if (!readIds.includes(ticketId)) {
      readIds.push(ticketId)
      saveReadIds(readIds)
    }
    const target = notifications.value.find(n => n.ticketId === ticketId)
    if (target) {
      target.read = true
    }
  }

  const markAllAsRead = () => {
    const allIds = notifications.value.map(n => n.ticketId)
    saveReadIds(allIds)
    notifications.value.forEach(n => {
      n.read = true
    })
  }

  const dismissToast = () => {
    incomingToast.value = null
  }

  return {
    notifications,
    unreadCount,
    isNotificationOpen,
    isPermissionModalOpen,
    incomingToast,
    soundEnabled,
    playChime,
    fetchNotifications,
    openNotificationCenter,
    markAsRead,
    markAllAsRead,
    dismissToast
  }
}
