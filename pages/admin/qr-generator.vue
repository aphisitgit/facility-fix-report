<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Left Sidebar -->
    <AdminSidebar 
      :active-tickets-count="activeTicketsCount" 
      :is-open="adminSidebar.isSidebarOpen.value"
      @close="adminSidebar.close()"
      @logout="adminAuth.logout()"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 flex flex-col transition-all duration-300">
      
      <!-- Top Navigation Header -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <!-- Navigation Drawer Toggle Button -->
          <button 
            @click="adminSidebar.toggle()" 
            type="button"
            class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center"
            :title="adminSidebar.isSidebarOpen.value ? 'ปิดแถบเมนูด้านข้าง' : 'เปิดแถบเมนูด้านข้าง'"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu class="w-5 h-5" />
          </button>

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <QrCode class="w-5 h-5 text-spu-purple shrink-0" />
              <h1 class="text-base sm:text-lg font-bold text-slate-900">{{ langStore.t('qrPageTitle') }}</h1>
              <span class="text-[10px] sm:text-xs bg-spu-purple-50 text-spu-purple font-bold px-2 py-0.5 rounded-full border border-spu-purple-100">
                {{ langStore.t('qrDept') }}
              </span>
            </div>
            <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {{ langStore.t('qrPageSubtitle') }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink 
            to="/admin" 
            class="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LayoutDashboard class="w-3.5 h-3.5 text-slate-500" />
            <span class="hidden sm:inline">{{ langStore.t('qrBackDashboard') }}</span>
          </NuxtLink>

          <button 
            @click="printCurrentSticker"
            class="px-4 py-2 spu-gradient-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-spu-purple/20 hover:opacity-95 transition-all"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>{{ langStore.t('qrPrintCurrent') }}</span>
          </button>

          <!-- Language Switcher (ไทย / ENG) -->
          <LanguageSwitcher />

          <button 
            @click="notif.openNotificationCenter()"
            class="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            title="ศูนย์แจ้งเตือน Admin"
            aria-label="Admin Notifications"
          >
            <Bell class="w-4 h-4" />
            <span 
              v-if="notif.unreadCount.value > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-spu-pink text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse"
            >
              {{ notif.unreadCount.value }}
            </span>
          </button>
        </div>
      </header>

      <!-- Main Body -->
      <main class="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        
        <!-- Top Section: Generator Form & Live SPU Sticker Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Generator Form Controls (7 cols on desktop) -->
          <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders class="w-4 h-4 text-spu-purple" />
                  <span>{{ langStore.t('qrConfigTitle') }}</span>
                </h2>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ langStore.t('qrConfigSubtitle') }}</p>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {{ langStore.t('qrLiveSyncBadge') }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Building Selector -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ langStore.t('qrBuildingField') }}</label>
                <select 
                  v-model="selectedBuilding"
                  class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
                >
                  <option v-for="b in buildingOptions" :key="b.value" :value="b.value">
                    {{ b.label }}
                  </option>
                </select>
              </div>

              <!-- Floor Selector -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ langStore.t('qrFloorField') }}</label>
                <select 
                  v-model="selectedFloor"
                  class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
                >
                  <option v-for="f in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']" :key="f" :value="f">
                    {{ langStore.translateFloor(f) }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Room / Zone Name -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                {{ langStore.t('qrRoomField') }}
              </label>
              <input 
                v-model="roomName"
                type="text"
                :placeholder="langStore.t('qrRoomPlaceholder')"
                class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
              />
            </div>

            <!-- Optional Sub-location / Desk Note -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                {{ langStore.t('qrNoteField') }}
              </label>
              <input 
                v-model="subLocation"
                type="text"
                :placeholder="langStore.t('qrNotePlaceholder')"
                class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
              />
            </div>

            <!-- Target Web URL Encoded -->
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-slate-700">{{ langStore.t('qrEncodedUrl') }}</span>
                <button 
                  type="button" 
                  @click="copyUrl" 
                  class="font-bold text-spu-purple hover:text-spu-pink transition-colors flex items-center gap-1"
                >
                  <Copy class="w-3 h-3" />
                  <span>{{ copiedUrl ? langStore.t('qrCopied') : langStore.t('qrCopyUrl') }}</span>
                </button>
              </div>
              <p class="text-[10px] font-mono text-slate-500 break-all bg-white p-2 rounded-xl border border-slate-200">
                {{ targetUrl }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button 
                type="button"
                @click="saveRoomToDirectory"
                class="px-4 py-2 bg-spu-purple-50 hover:bg-spu-purple text-spu-purple hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <BookmarkPlus class="w-3.5 h-3.5" />
                <span>{{ langStore.t('qrSaveDirectory') }}</span>
              </button>

              <button 
                type="button"
                @click="testOpenRoomHub"
                class="px-4 py-2 border border-slate-200 hover:border-spu-purple text-slate-700 hover:text-spu-purple rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <ExternalLink class="w-3.5 h-3.5" />
                <span>{{ langStore.t('qrTestOpen') }}</span>
              </button>
            </div>
          </div>

          <!-- Printable SPU Sticker Live Preview (5 cols on desktop) -->
          <div class="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col items-center justify-between space-y-4">
            <div class="w-full text-center">
              <span class="text-[10px] font-black uppercase text-spu-pink tracking-widest bg-spu-pink-50 px-2.5 py-0.5 rounded-full border border-spu-pink-100">
                {{ langStore.t('qrPreviewBadge') }}
              </span>
              <p class="text-[11px] text-slate-400 mt-1">{{ langStore.t('qrPreviewSizeNote') }}</p>
            </div>

            <!-- Printable Sticker Card (Responsive on Mobile, fixed max-w on Desktop) -->
            <div id="spu-printable-sticker" class="w-full max-w-[288px] bg-white rounded-2xl border-2 border-spu-purple shadow-xl p-4 sm:p-5 text-center flex flex-col items-center space-y-3 relative overflow-hidden">
              <!-- Top SPU Brand Strip -->
              <div class="w-full spu-gradient-primary text-white py-1.5 px-3 rounded-lg flex items-center justify-between shadow-xs">
                <span class="text-[10px] font-black tracking-wider">SRIPATUM UNIVERSITY</span>
                <span class="text-[9px] opacity-80 font-mono">FACILITY FIX</span>
              </div>

              <!-- Location Details -->
              <div>
                <span class="text-[10px] font-bold text-spu-pink uppercase tracking-wider">
                  {{ langStore.translateBuilding(selectedBuilding) }} • {{ langStore.translateFloor(selectedFloor) }}
                </span>
                <h3 class="text-sm font-black text-slate-900 leading-tight mt-0.5">{{ langStore.translateRoom(roomName) }}</h3>
                <p v-if="subLocation" class="text-[10px] text-slate-500 font-medium mt-0.5">{{ subLocation }}</p>
              </div>

              <!-- Real QR Code Image -->
              <div class="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-inner relative group">
                <img :src="qrCodeUrl" alt="Room QR Code" class="w-40 h-40 object-contain mx-auto" />
                <div class="w-7 h-7 rounded-full bg-spu-purple text-white text-[10px] font-black absolute inset-0 m-auto flex items-center justify-center border-2 border-white shadow">
                  SPU
                </div>
              </div>

              <!-- Instruction Tag -->
              <div class="bg-spu-pink-50 text-spu-pink-700 text-[10px] font-extrabold py-1 px-3 rounded-full border border-spu-pink-100 flex items-center gap-1.5">
                <Camera class="w-3.5 h-3.5 text-spu-pink" />
                <span>{{ langStore.t('qrStickerScanTag') }}</span>
              </div>

              <p class="text-[9px] text-slate-400">{{ langStore.t('qrStickerScanHint') }}</p>
            </div>

            <!-- Print Actions -->
            <div class="w-full flex items-center gap-2 pt-2">
              <button 
                type="button"
                @click="printCurrentSticker"
                class="flex-1 py-2.5 spu-gradient-primary text-white text-xs font-bold rounded-xl shadow-md shadow-spu-purple/20 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Printer class="w-4 h-4" />
                <span>{{ langStore.t('qrPrintNow') }}</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Section 2: Campus Room QR Directory -->
        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <FolderOpen class="w-4 h-4 text-spu-purple" />
                <h3 class="text-sm font-bold text-slate-900">{{ langStore.t('qrDirectoryTitle') }}</h3>
                <span class="text-xs bg-spu-pink-50 text-spu-pink font-bold px-2 py-0.5 rounded-full border border-spu-pink-100">
                  {{ langStore.t('qrRegisteredRooms', { count: filteredDirectory.length }) }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ langStore.t('qrDirectoryDesc') }}</p>
            </div>

            <!-- Search and Filter -->
            <div class="flex items-center gap-2">
              <div class="relative">
                <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  v-model="directorySearch"
                  type="text" 
                  :placeholder="langStore.t('qrSearchPlaceholder')"
                  class="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20"
                />
              </div>

              <select 
                v-model="directoryBuildingFilter"
                class="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option v-for="b in directoryBuildingOptions" :key="b.value" :value="b.value">
                  {{ b.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Directory Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div 
              v-for="room in filteredDirectory" 
              :key="room.room"
              class="p-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3 transition-all hover:border-spu-purple/40 group"
            >
              <div class="min-w-0 flex-1 space-y-1">
                <span class="text-[10px] font-bold text-spu-pink uppercase tracking-wider block">
                  {{ langStore.translateBuilding(room.building) }} • {{ langStore.translateFloor(room.floor) }}
                </span>
                <h4 class="text-xs font-extrabold text-slate-800 truncate group-hover:text-spu-purple">
                  {{ langStore.translateRoom(room.room) }}
                </h4>
                <p v-if="room.subLocation" class="text-[10px] text-slate-400 truncate">
                  {{ room.subLocation }}
                </p>

                <div class="pt-2 flex items-center gap-2">
                  <button 
                    @click="loadRoomIntoGenerator(room)"
                    class="px-2.5 py-1 bg-white hover:bg-spu-purple hover:text-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-colors shadow-2xs"
                  >
                    {{ langStore.t('qrSelectAndEdit') }}
                  </button>
                  <button 
                    @click="printSpecificSticker(room)"
                    class="px-2.5 py-1 bg-spu-purple-50 hover:bg-spu-purple-100 text-spu-purple rounded-lg text-[10px] font-bold transition-colors"
                  >
                    {{ langStore.t('qrQuickPrint') }}
                  </button>
                </div>
              </div>

              <!-- Mini QR Preview -->
              <div class="w-14 h-14 rounded-xl bg-white p-1 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
                <img :src="getRoomQrUrl(room)" alt="QR" class="w-full h-full object-contain" />
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  QrCode, 
  Menu, 
  LayoutDashboard, 
  Printer, 
  Sliders, 
  Copy, 
  BookmarkPlus, 
  ExternalLink, 
  Camera, 
  FolderOpen, 
  Search,
  Bell
} from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAdminSidebar } from '~/composables/useAdminSidebar'
import { useAppLang } from '~/composables/useAppLang'

const router = useRouter()
const adminAuth = useAdminAuth()
const notif = useAdminNotifications()
const adminSidebar = useAdminSidebar()
const langStore = useAppLang()
const activeTicketsCount = ref(8)

// Generator Form State
const selectedBuilding = ref('Building 11')
const selectedFloor = ref('5')
const roomName = ref('11-502 (Multimedia Lab)')
const subLocation = ref('Door Entrance & Desk Area')
const copiedUrl = ref(false)

const directorySearch = ref('')
const directoryBuildingFilter = ref('ALL')

const buildingOptions = computed(() => {
  const isEn = langStore.currentLang.value === 'en'
  return [
    { value: 'Building 11', label: isEn ? 'Building 11 - Multimedia & Tech' : 'อาคาร 11 - Multimedia & Tech' },
    { value: 'Building 5', label: isEn ? 'Building 5 - Communication Arts' : 'อาคาร 5 - นิเทศศาสตร์ (Comm Arts)' },
    { value: 'Building 9', label: isEn ? 'Building 9 - Engineering' : 'อาคาร 9 - วิศวกรรมศาสตร์ (Engineering)' },
    { value: 'Central Library', label: isEn ? 'Central Library' : 'หอสมุดกลาง (Central Library)' },
    { value: 'Cafeteria', label: isEn ? 'Student Center & Cafeteria' : 'อาคารกิจกรรม & ศูนย์อาหารกลาง' },
    { value: 'Building 1', label: isEn ? "Building 1 - President's Office" : 'อาคาร 1 - สำนักงานอธิการบดี' },
    { value: 'Sport Complex', label: isEn ? 'Sports Complex & Gymnasium' : 'ศูนย์กีฬาและโรงยิมเนเซียม' }
  ]
})

const directoryBuildingOptions = computed(() => {
  const isEn = langStore.currentLang.value === 'en'
  return [
    { value: 'ALL', label: isEn ? 'All Buildings' : 'ทุกอาคาร' },
    { value: 'Building 11', label: isEn ? 'Building 11' : 'อาคาร 11' },
    { value: 'Building 5', label: isEn ? 'Building 5' : 'อาคาร 5' },
    { value: 'Building 9', label: isEn ? 'Building 9' : 'อาคาร 9' },
    { value: 'Central Library', label: isEn ? 'Central Library' : 'หอสมุดกลาง' },
    { value: 'Cafeteria', label: isEn ? 'Cafeteria' : 'ศูนย์อาหารกลาง' }
  ]
})

// Preset Campus Room Directory
const roomDirectory = ref([
  { building: 'Building 11', floor: '5', room: '11-502 (Multimedia Lab)', subLocation: 'Multimedia Production Lab' },
  { building: 'Building 11', floor: '4', room: '11-401 (Computer Center)', subLocation: 'PC Workstation 1-30' },
  { building: 'Building 5', floor: '3', room: '5-301 (Smart Seminar Hall)', subLocation: 'Stage & Projection Area' },
  { building: 'Building 5', floor: '2', room: '5-204 (Comm Arts Studio)', subLocation: 'Recording Booth 1' },
  { building: 'Building 9', floor: '4', room: 'Lab 9-401 (Robotics Lab)', subLocation: 'Mechatronics Workbench' },
  { building: 'Building 9', floor: '2', room: '9-203 (Engineering Lecture)', subLocation: 'Tiered Lecture Hall' },
  { building: 'Central Library', floor: '3', room: '3rd Floor Quiet Zone', subLocation: 'Study Pods & Carrels' },
  { building: 'Central Library', floor: '1', room: 'Ground Floor Reading Hall', subLocation: 'Central Help Desk' },
  { building: 'Cafeteria', floor: '1', room: 'Main Dining Commons', subLocation: 'Student Union Food Court' }
])

const filteredDirectory = computed(() => {
  return roomDirectory.value.filter(r => {
    if (directoryBuildingFilter.value !== 'ALL' && r.building !== directoryBuildingFilter.value) {
      return false
    }
    if (directorySearch.value.trim() !== '') {
      const q = directorySearch.value.toLowerCase()
      const bldg = langStore.translateBuilding(r.building).toLowerCase()
      const rm = langStore.translateRoom(r.room).toLowerCase()
      return rm.includes(q) || bldg.includes(q) || r.room.toLowerCase().includes(q) || r.building.toLowerCase().includes(q)
    }
    return true
  })
})

const targetUrl = computed(() => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  return `${origin}/?building=${encodeURIComponent(selectedBuilding.value)}&floor=${encodeURIComponent(selectedFloor.value)}&room=${encodeURIComponent(roomName.value)}`
})

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl.value)}`
})

function getRoomQrUrl(room: { building: string; floor: string; room: string }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const url = `${origin}/?building=${encodeURIComponent(room.building)}&floor=${encodeURIComponent(room.floor)}&room=${encodeURIComponent(room.room)}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`
}

function copyUrl() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(targetUrl.value)
    copiedUrl.value = true
    setTimeout(() => { copiedUrl.value = false }, 2000)
  }
}

function loadRoomIntoGenerator(room: any) {
  selectedBuilding.value = room.building
  selectedFloor.value = room.floor
  roomName.value = room.room
  subLocation.value = room.subLocation || ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function saveRoomToDirectory() {
  const isEn = langStore.currentLang.value === 'en'
  const existing = roomDirectory.value.find(r => r.room === roomName.value && r.building === selectedBuilding.value)
  if (existing) {
    alert(isEn ? 'This room is already registered in the directory!' : 'ห้องนี้ได้รับการลงทะเบียนในสารบบแล้ว!')
    return
  }

  roomDirectory.value.unshift({
    building: selectedBuilding.value,
    floor: selectedFloor.value,
    room: roomName.value,
    subLocation: subLocation.value
  })

  alert(isEn ? `Room "${roomName.value}" has been saved to the campus directory!` : `บันทึกห้อง "${roomName.value}" เข้าสู่สารบบวิทยาเขตเรียบร้อยแล้ว!`)
}

function testOpenRoomHub() {
  window.open(targetUrl.value, '_blank')
}

function printCurrentSticker() {
  printSpecificSticker({
    building: selectedBuilding.value,
    floor: selectedFloor.value,
    room: roomName.value,
    subLocation: subLocation.value
  })
}

function printSpecificSticker(room: { building: string; floor: string; room: string; subLocation?: string }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const roomUrl = `${origin}/?building=${encodeURIComponent(room.building)}&floor=${encodeURIComponent(room.floor)}&room=${encodeURIComponent(room.room)}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(roomUrl)}`

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const isEn = langStore.currentLang.value === 'en'
  const translatedBldg = langStore.translateBuilding(room.building)
  const translatedFloor = langStore.translateFloor(room.floor)
  const translatedRoom = langStore.translateRoom(room.room)

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${isEn ? 'SPU Room QR Sticker' : 'สติกเกอร์ QR ประจำห้อง SPU'} - ${translatedRoom}</title>
        <style>
          @page { size: auto; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 90vh; margin: 0; background: #fff; }
          .sticker-card { width: 320px; border: 3px solid #4A154B; border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 4px 12px rgba(74, 21, 75, 0.1); }
          .brand-header { background: #4A154B; color: white; padding: 8px 12px; border-radius: 8px; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .location-pill { font-size: 11px; font-weight: 800; color: #D63384; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .room-title { font-size: 18px; font-weight: 900; color: #0f172a; line-height: 1.2; margin: 4px 0; }
          .sub-loc { font-size: 11px; color: #64748b; margin-top: 2px; }
          .qr-wrapper { width: 200px; height: 200px; margin: 12px auto; padding: 10px; border: 1px solid #e2e8f0; border-radius: 16px; position: relative; }
          .qr-img { width: 100%; height: 100%; object-fit: contain; }
          .footer-badge { background: #FCE7F3; color: #9D174D; padding: 8px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; border: 1px solid #FBCFE8; margin-top: 8px; display: inline-block; }
          .instructions { font-size: 9px; color: #94a3b8; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="sticker-card">
          <div class="brand-header">
            <span>SRIPATUM UNIVERSITY</span>
            <span>FACILITY FIX</span>
          </div>
          <div class="location-pill">${translatedBldg} • ${translatedFloor}</div>
          <div class="room-title">${translatedRoom}</div>
          ${room.subLocation ? `<div class="sub-loc">${room.subLocation}</div>` : ''}
          <div class="qr-wrapper">
            <img src="${qrUrl}" class="qr-img" />
          </div>
          <div class="footer-badge">${langStore.t('qrStickerScanTag')}</div>
          <div class="instructions">${langStore.t('qrStickerScanHint')}</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        <\/script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

onMounted(async () => {
  adminSidebar.initSidebar()
  try {
    const res = await $fetch<any>('/api/reports')
    if (res.success && res.data) {
      activeTicketsCount.value = res.data.filter((t: any) => t.status !== 'RESOLVED').length
    }
  } catch (e) {}
})
</script>
