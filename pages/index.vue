<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 pb-28">
    <!-- Mobile Frame Container (max-w-md mx-auto) -->
    <div class="max-w-md mx-auto min-h-screen bg-white/70 shadow-xl border-x border-slate-100 flex flex-col">
      
      <!-- Top Header -->
      <header class="p-4 px-5 flex items-center justify-between border-b border-slate-100 bg-white/90 sticky top-0 z-20 backdrop-blur-md">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-spu-purple text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
            SPU
          </div>
          <div>
            <h1 class="text-xs font-bold text-slate-900 leading-tight">Facility Fix & Report</h1>
            <p class="text-[10px] text-slate-400">Campus Maintenance Hub</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Notification Bell -->
          <button class="relative p-2 text-slate-500 hover:text-spu-purple rounded-full hover:bg-slate-100 transition-colors">
            <Bell class="w-4 h-4" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-spu-pink ring-2 ring-white"></span>
          </button>

          <!-- Admin Portal Quick Switch -->
          <NuxtLink 
            to="/admin" 
            class="text-[10px] bg-spu-purple/10 text-spu-purple hover:bg-spu-purple hover:text-white px-2 py-1 rounded-lg font-bold transition-all"
            title="Switch to Admin Portal"
          >
            Admin
          </NuxtLink>

          <!-- User Avatar -->
          <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-spu-purple to-spu-pink p-0.5 shadow-xs">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Praew" 
              class="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="p-5 space-y-5 flex-1">
        
        <!-- Welcome Greeting -->
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-1.5">
              <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Hello, Praew!</h2>
              <span class="text-lg">👋</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin class="w-3.5 h-3.5 text-spu-pink shrink-0" />
              <span>Sripatum University • Bangkhen</span>
            </div>
          </div>

          <NuxtLink 
            to="/tracking"
            class="inline-flex items-center gap-1.5 bg-spu-pink-50 border border-spu-pink-100 text-spu-pink text-xs font-bold px-2.5 py-1 rounded-full shadow-xs hover:bg-spu-pink-100 transition-colors"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-spu-pink animate-pulse"></span>
            <span>2 Active</span>
          </NuxtLink>
        </div>

        <!-- SPECIAL ROOM-SPECIFIC QR SCANNED HUB (When a room QR is scanned) -->
        <div v-if="isRoomScanned" class="spu-gradient-hero rounded-3xl p-5 text-white shadow-xl shadow-spu-purple-900/20 relative overflow-hidden space-y-4 animate-fade-in">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <QrCode class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[10px] font-black uppercase text-pink-200 tracking-wider flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Room QR Scanned & Verified
                </span>
                <h3 class="text-base font-black leading-tight">{{ currentRoom }}</h3>
              </div>
            </div>

            <!-- Exit room button -->
            <button 
              @click="clearRoomFilter"
              class="text-[10px] font-semibold bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-xl transition-colors"
            >
              All Campus
            </button>
          </div>

          <div class="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-white/80">Location:</span>
              <span class="font-bold">{{ currentBuilding }} • Floor {{ currentFloor || '1' }}</span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-white/80">Previous Reports:</span>
              <span class="font-bold text-pink-200">{{ roomReports.length }} items in this room</span>
            </div>
          </div>

          <!-- Primary Report in This Room Button -->
          <button 
            @click="reportInThisRoom"
            class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-spu-pink to-spu-pink-400 text-white font-black text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Camera class="w-4 h-4" />
            <span>Report an Issue in this Room ▷</span>
          </button>
        </div>

        <!-- Campus Alert Banner (Shown when not in room view) -->
        <div v-else-if="showAlert" class="relative bg-spu-pink-50 border border-spu-pink-200/80 rounded-2xl p-3.5 text-xs shadow-xs animate-fade-in">
          <button 
            @click="showAlert = false" 
            class="absolute top-2.5 right-2.5 text-spu-pink-600/70 hover:text-spu-pink-900 transition-colors"
          >
            <X class="w-3.5 h-3.5" />
          </button>
          
          <div class="flex items-start gap-2.5 pr-4">
            <div class="p-1.5 rounded-xl bg-spu-purple text-white shrink-0 mt-0.5">
              <Megaphone class="w-3.5 h-3.5" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-[10px] font-black uppercase text-spu-pink tracking-wider">Campus Alert</span>
                <span class="text-[10px] text-slate-400 font-medium">Oct 28</span>
              </div>
              <h4 class="font-bold text-slate-900 text-xs">AC Maintenance: Bldg 11 (Fl. 4-8)</h4>
              <p class="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Scheduled overhaul this Saturday. Please report pre-existing cooling leaks ahead of time.
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Report via Room QR (Shown when no room is scanned yet) -->
        <div v-if="!isRoomScanned" class="spu-gradient-hero rounded-3xl p-5 text-white shadow-xl shadow-spu-purple-900/20 relative overflow-hidden group">
          <div class="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-2xl"></div>
          <div class="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-spu-pink/30 blur-xl"></div>

          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mb-3 shadow-inner">
              <QrCode class="w-7 h-7 text-white" />
            </div>

            <h3 class="text-base font-extrabold tracking-tight">Quick Report via Room QR</h3>
            <p class="text-xs text-white/80 mt-1 max-w-[260px] leading-relaxed">
              Scan barcode stickers on lecture desks, projectors, or entrance doors to auto-fill location.
            </p>

            <button 
              @click="isQrModalOpen = true"
              type="button"
              class="mt-4 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-spu-pink to-spu-pink-400 text-white font-bold text-xs shadow-lg shadow-spu-pink-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Camera class="w-4 h-4" />
              <span>Open QR Scanner</span>
            </button>
          </div>
        </div>

        <!-- Search Location Input (Shown if not in room mode) -->
        <div v-if="!isRoomScanned" class="space-y-2">
          <div class="relative">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text" 
              placeholder="Search building, floor, or room..."
              class="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-spu-purple/30 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
            />
            <SlidersHorizontal class="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-slate-600" />
          </div>

          <!-- Quick Shortcuts Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick:</span>
            <button 
              v-for="bldg in quickBuildings" 
              :key="bldg.name"
              @click="quickSelectLocation(bldg.name, bldg.room)"
              class="px-2.5 py-1 bg-slate-100 hover:bg-spu-purple-50 hover:text-spu-purple border border-slate-200/60 rounded-xl text-slate-600 font-medium whitespace-nowrap transition-colors"
            >
              {{ bldg.name }}
            </button>
          </div>
        </div>

        <!-- Issue Categories Grid -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-slate-900">Issue Categories</h3>
            <NuxtLink :to="isRoomScanned ? `/report?building=${encodeURIComponent(currentBuilding || '')}&floor=${encodeURIComponent(currentFloor || '1')}&room=${encodeURIComponent(currentRoom || '')}` : '/report'" class="text-[11px] font-semibold text-spu-pink hover:underline">
              Browse all
            </NuxtLink>
          </div>

          <div class="grid grid-cols-4 gap-2.5">
            <button 
              v-for="cat in mainCategories" 
              :key="cat.name"
              @click="selectCategoryAndReport(cat.name)"
              class="p-2.5 bg-slate-50/80 hover:bg-spu-purple-50/60 border border-slate-200/70 hover:border-spu-purple/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
            >
              <div class="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform" :class="cat.colorClass">
                <component :is="cat.icon" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-semibold text-slate-700 group-hover:text-spu-purple">{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <!-- RECENT REPORTS / ROOM HISTORY (Filtered to this room if scanned!) -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <h3 class="text-xs font-bold text-slate-900">
                {{ isRoomScanned ? `Maintenance History for ${currentRoom}` : 'Recent Campus Reports' }}
              </h3>
              <span class="w-1.5 h-1.5 rounded-full bg-spu-pink"></span>
            </div>
            
            <button 
              v-if="isRoomScanned"
              @click="clearRoomFilter"
              class="text-[11px] font-semibold text-spu-purple hover:underline"
            >
              View All Campus &gt;
            </button>
            <NuxtLink v-else to="/tracking" class="text-[11px] font-semibold text-spu-pink hover:underline">
              See All ({{ reports.length }}) &gt;
            </NuxtLink>
          </div>

          <!-- Empty State if no reports for this room -->
          <div 
            v-if="roomReports.length === 0" 
            class="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-2"
          >
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 class="w-5 h-5" />
            </div>
            <h4 class="text-xs font-bold text-slate-800">No Active Issues in this Room</h4>
            <p class="text-[11px] text-slate-500 max-w-xs mx-auto">
              Everything in {{ currentRoom }} is currently in good order. If you notice any damage, tap the button above to report it!
            </p>
          </div>

          <!-- List of Reports (Filtered to room or campus-wide) -->
          <div v-else class="space-y-2.5">
            <div 
              v-for="ticket in roomReports" 
              :key="ticket.id"
              @click="goToTicket(ticket.id)"
              class="p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-spu-purple/40 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-start gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-600">
                    <component :is="getCategoryIcon(ticket.category)" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-slate-900 truncate">{{ ticket.description }}</h4>
                    <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin class="w-3 h-3 text-slate-400" />
                      <span class="truncate">{{ ticket.building }}, {{ ticket.room }}</span>
                    </p>
                  </div>
                </div>

                <!-- Status Badge -->
                <span 
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  :class="getStatusBadgeClass(ticket.status)"
                >
                  {{ formatStatus(ticket.status) }}
                </span>
              </div>

              <!-- Card Bottom Metadata -->
              <div class="flex items-center justify-between pt-1 border-t border-slate-50 text-[10px] text-slate-400">
                <div class="flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  <span>{{ formatTimestamp(ticket.created_at) }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="flex items-center gap-1 text-slate-600">
                    <ThumbsUp class="w-3 h-3 text-spu-pink" /> {{ ticket.likes || 12 }}
                  </span>
                  <span class="flex items-center gap-1 text-slate-600">
                    <MessageSquare class="w-3 h-3" /> {{ ticket.comments_count || 2 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <!-- Bottom Floating Nav -->
      <BottomNav :active-count="2" @open-qr="isQrModalOpen = true" />

      <!-- QR Scanner Modal -->
      <QrScannerModal :is-open="isQrModalOpen" @close="isQrModalOpen = false" />

      <!-- Global Email Toast Simulator -->
      <EmailNotificationToast />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, 
  MapPin, 
  X, 
  Megaphone, 
  QrCode, 
  Camera, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  ThumbsUp, 
  MessageSquare,
  CheckCircle2,
  Fan,
  Lightbulb,
  Wrench,
  Tv
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const showAlert = ref(true)
const isQrModalOpen = ref(false)
const searchQuery = ref('')
const reports = ref<any[]>([])

const currentBuilding = computed(() => (route.query.building as string) || '')
const currentFloor = computed(() => (route.query.floor as string) || '')
const currentRoom = computed(() => (route.query.room as string) || '')
const isRoomScanned = computed(() => !!currentRoom.value)

// Filter reports to ONLY this room if room is scanned!
const roomReports = computed(() => {
  if (!isRoomScanned.value) return reports.value.slice(0, 4)
  const rm = currentRoom.value.toLowerCase()
  return reports.value.filter(t => t.room.toLowerCase().includes(rm) || rm.includes(t.room.toLowerCase()))
})

const quickBuildings = [
  { name: 'Bldg 11', room: '11-502' },
  { name: 'Bldg 5', room: '5-301' },
  { name: 'Central Library', room: '3rd Floor' },
  { name: 'Cafeteria', room: 'Ground Floor' }
]

const mainCategories = [
  { name: 'Air Cond.', icon: Fan, colorClass: 'text-sky-500' },
  { name: 'Electrical', icon: Lightbulb, colorClass: 'text-amber-500' },
  { name: 'Sanitary', icon: Wrench, colorClass: 'text-blue-500' },
  { name: 'Class AV', icon: Tv, colorClass: 'text-spu-pink' }
]

function getCategoryIcon(cat: string) {
  if (cat.includes('Air')) return Fan
  if (cat.includes('Light') || cat.includes('Elec')) return Lightbulb
  if (cat.includes('Sanitary')) return Wrench
  return Tv
}

function getStatusBadgeClass(status: string) {
  if (status === 'IN_PROGRESS') return 'bg-spu-pink-100 text-spu-pink font-bold'
  if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-700 font-bold'
  return 'bg-amber-100 text-amber-700 font-bold'
}

function formatStatus(status: string) {
  if (status === 'IN_PROGRESS') return 'In Progress'
  if (status === 'RESOLVED') return 'Resolved'
  return 'Pending'
}

function formatTimestamp(ts: string) {
  if (!ts) return 'Today, 10:15 AM'
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function clearRoomFilter() {
  router.push('/')
}

function reportInThisRoom() {
  router.push({
    path: '/report',
    query: {
      building: currentBuilding.value,
      floor: currentFloor.value,
      room: currentRoom.value
    }
  })
}

function quickSelectLocation(bldg: string, room: string) {
  router.push({
    path: '/',
    query: {
      building: bldg,
      room: room
    }
  })
}

function selectCategoryAndReport(catName: string) {
  router.push({
    path: '/report',
    query: {
      building: currentBuilding.value || undefined,
      floor: currentFloor.value || undefined,
      room: currentRoom.value || undefined,
      category: catName
    }
  })
}

function handleSearch() {
  if (searchQuery.value) {
    router.push({
      path: '/report',
      query: {
        search: searchQuery.value
      }
    })
  }
}

function goToTicket(id: string) {
  router.push(`/tracking?id=${id}`)
}

async function fetchRecentReports() {
  try {
    const res = await $fetch<any>('/api/reports')
    if (res.success && res.data) {
      reports.value = res.data
    }
  } catch (err) {
    console.error('Failed to load reports', err)
  }
}

onMounted(() => {
  fetchRecentReports()
})
</script>
