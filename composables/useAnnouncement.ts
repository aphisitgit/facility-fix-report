export interface AnnouncementData {
  enabled: boolean
  department: string
  title: string
  message: string
  updatedAt?: string
}

export function useAnnouncement() {
  const announcement = useState<AnnouncementData>('spu_campus_announcement', () => ({
    enabled: true,
    department: 'ฝ่ายอาคารและสถานที่',
    title: 'กำหนดการบำรุงรักษาเครื่องปรับอากาศ: อาคาร 11 (ชั้น 4-8)',
    message: 'มีแผนการบำรุงรักษาเชิงป้องกันในวันเสาร์นี้ หากพบแอร์ไม่เย็นหรือน้ำรั่วซึม กรุณาแจ้งล่วงหน้าผ่านระบบ',
    updatedAt: new Date().toISOString()
  }))

  function initAnnouncement() {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('spu_campus_announcement_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed.title === 'string') {
          announcement.value = parsed
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  function updateAnnouncement(data: Partial<AnnouncementData>) {
    announcement.value = {
      ...announcement.value,
      ...data,
      updatedAt: new Date().toISOString()
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('spu_campus_announcement_data', JSON.stringify(announcement.value))
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  return {
    announcement,
    initAnnouncement,
    updateAnnouncement
  }
}
