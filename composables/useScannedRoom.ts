export interface ScannedRoom {
  building: string
  floor: string
  room: string
}

export function useScannedRoom() {
  const route = useRoute()
  const router = useRouter()

  const currentBuilding = useState<string>('spu_scanned_building', () => (route.query.building as string) || '')
  const currentFloor = useState<string>('spu_scanned_floor', () => (route.query.floor as string) || '')
  const currentRoom = useState<string>('spu_scanned_room', () => (route.query.room as string) || '')

  const isRoomScanned = computed(() => !!currentRoom.value && currentRoom.value.trim() !== '')

  // Initialize from URL query params or localStorage on client
  function initRoom() {
    const qBuilding = route.query.building as string
    const qFloor = route.query.floor as string
    const qRoom = route.query.room as string

    if (qRoom) {
      setScannedRoom(qBuilding || currentBuilding.value || 'Building 11', qFloor || currentFloor.value || '1', qRoom)
      return
    }

    if (typeof window === 'undefined') return

    // Otherwise check localStorage
    try {
      const saved = localStorage.getItem('spu_scanned_room_data')
      if (saved) {
        const parsed = JSON.parse(saved) as ScannedRoom
        if (parsed && parsed.room) {
          currentBuilding.value = parsed.building || ''
          currentFloor.value = parsed.floor || ''
          currentRoom.value = parsed.room || ''
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  function setScannedRoom(building: string, floor: string, room: string) {
    currentBuilding.value = building || ''
    currentFloor.value = floor || '1'
    currentRoom.value = room || ''

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'spu_scanned_room_data',
          JSON.stringify({
            building: currentBuilding.value,
            floor: currentFloor.value,
            room: currentRoom.value
          })
        )
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  function clearScannedRoom() {
    currentBuilding.value = ''
    currentFloor.value = ''
    currentRoom.value = ''

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('spu_scanned_room_data')
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  return {
    currentBuilding,
    currentFloor,
    currentRoom,
    isRoomScanned,
    initRoom,
    setScannedRoom,
    clearScannedRoom
  }
}
