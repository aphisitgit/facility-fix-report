<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 pb-28">
    <div class="max-w-md mx-auto min-h-screen bg-white/70 shadow-xl border-x border-slate-100 flex flex-col">
      
      <!-- Top Header -->
      <header class="p-4 px-5 flex items-center justify-between border-b border-slate-100 bg-white/90 sticky top-0 z-20 backdrop-blur-md">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-spu-purple text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
            SPU
          </div>
          <div>
            <h1 class="text-xs font-bold text-slate-900 leading-tight">Facility Fix & Report</h1>
            <p class="text-[10px] text-slate-400">My Reports & Tracking</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="relative p-2 text-slate-500 hover:text-spu-purple rounded-full hover:bg-slate-100 transition-colors">
            <Bell class="w-4 h-4" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-spu-pink ring-2 ring-white"></span>
          </button>

          <NuxtLink to="/admin" class="text-[10px] bg-spu-purple/10 text-spu-purple px-2 py-1 rounded-lg font-bold">
            Admin
          </NuxtLink>

          <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-spu-purple to-spu-pink p-0.5">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Praew" 
              class="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="p-5 space-y-4 flex-1">
        
        <!-- Page Title & Subtitle -->
        <div>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">My Reports & Tracking</h2>
            <span class="text-xs font-bold text-spu-pink bg-spu-pink-50 border border-spu-pink-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FileCheck class="w-3.5 h-3.5" /> {{ filteredTickets.length }} Total
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1 leading-snug">
            Track real-time maintenance status and technician dispatches across Sripatum University.
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <button 
            @click="activeFilter = 'ALL'"
            class="px-3.5 py-1.5 rounded-full transition-all"
            :class="activeFilter === 'ALL' 
              ? 'bg-spu-purple text-white shadow-sm' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            All <span class="ml-1 opacity-75 text-[10px]">{{ tickets.length }}</span>
          </button>

          <button 
            @click="activeFilter = 'IN_PROGRESS'"
            class="px-3.5 py-1.5 rounded-full transition-all"
            :class="activeFilter === 'IN_PROGRESS' 
              ? 'bg-spu-purple text-white shadow-sm ring-2 ring-spu-pink/40' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            In Progress <span class="ml-1 opacity-75 text-[10px]">{{ inProgressCount }}</span>
          </button>

          <button 
            @click="activeFilter = 'PENDING'"
            class="px-3.5 py-1.5 rounded-full transition-all"
            :class="activeFilter === 'PENDING' 
              ? 'bg-spu-purple text-white shadow-sm' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            Pending <span class="ml-1 opacity-75 text-[10px]">{{ pendingCount }}</span>
          </button>

          <button 
            @click="activeFilter = 'RESOLVED'"
            class="px-3.5 py-1.5 rounded-full transition-all"
            :class="activeFilter === 'RESOLVED' 
              ? 'bg-spu-purple text-white shadow-sm' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            Resolved <span class="ml-1 opacity-75 text-[10px]">{{ resolvedCount }}</span>
          </button>
        </div>

        <!-- Tickets List -->
        <div class="space-y-4">
          <div 
            v-for="ticket in filteredTickets" 
            :key="ticket.id"
            class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-3.5 relative overflow-hidden transition-all hover:shadow-md"
          >
            <!-- Top Gradient Accent line -->
            <div 
              class="absolute top-0 left-0 right-0 h-1.5"
              :class="ticket.status === 'IN_PROGRESS' ? 'spu-gradient-hero' : (ticket.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-400')"
            ></div>

            <!-- Card Header -->
            <div class="flex items-start justify-between gap-2 pt-0.5">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-extrabold text-slate-900">#{{ ticket.id }}</span>
                  <span class="text-slate-300">•</span>
                  <span class="text-[11px] text-slate-400 font-medium">{{ formatRelativeTime(ticket.created_at) }}</span>
                </div>
                <p class="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin class="w-3.5 h-3.5 text-spu-pink shrink-0" />
                  <span>{{ ticket.building }}, Floor {{ ticket.floor }}, {{ ticket.room }}</span>
                </p>
              </div>

              <!-- Status Badge -->
              <span 
                class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                :class="getStatusBadgeClass(ticket.status)"
              >
                {{ formatStatus(ticket.status) }}
              </span>
            </div>

            <!-- Content Thumbnail + Description -->
            <div class="flex items-start gap-3 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
              <div class="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img :src="ticket.image_before_url" alt="Ticket" class="w-full h-full object-cover" />
                <span class="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center font-bold py-0.5">
                  Original
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1 text-[11px] font-bold text-spu-purple mb-0.5">
                  <span>{{ getCategoryEmoji(ticket.category) }}</span>
                  <span>{{ ticket.category }}</span>
                </div>
                <p class="text-xs text-slate-700 font-medium line-clamp-2 leading-snug">
                  {{ ticket.description }}
                </p>
                <div v-if="ticket.assigned_tech" class="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 font-medium">
                  <Wrench class="w-3 h-3 text-spu-pink" />
                  <span>Tech {{ ticket.assigned_tech }} on site</span>
                </div>
              </div>
            </div>

            <!-- Workflow Progress Stepper (Step 1 to 4) -->
            <div class="space-y-1.5 px-1">
              <div class="flex items-center justify-between text-[11px] font-bold">
                <span class="text-slate-800">Workflow Progress</span>
                <span class="text-spu-pink font-extrabold text-[10px]">{{ getStepLabel(ticket.status) }}</span>
              </div>

              <!-- Visual Stepper Progress Line & Dots -->
              <div class="relative flex items-center justify-between pt-2 pb-1">
                <!-- Background Connection Line -->
                <div class="absolute left-3 right-3 top-4 h-0.5 bg-slate-200 -z-0"></div>
                <!-- Active Progress Line -->
                <div 
                  class="absolute left-3 top-4 h-0.5 bg-spu-purple -z-0 transition-all duration-500"
                  :style="{ width: getStepLineWidth(ticket.status) }"
                ></div>

                <!-- Step 1: Received -->
                <div class="flex flex-col items-center gap-1 z-10">
                  <div class="w-5 h-5 rounded-full bg-spu-purple text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                    <Check class="w-3 h-3 stroke-[3]" />
                  </div>
                  <span class="text-[9px] font-bold text-slate-700">Received</span>
                </div>

                <!-- Step 2: Assigned -->
                <div class="flex flex-col items-center gap-1 z-10">
                  <div 
                    class="w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white"
                    :class="ticket.status !== 'PENDING' ? 'bg-spu-purple text-white' : 'bg-slate-200 text-slate-400'"
                  >
                    <Check v-if="ticket.status !== 'PENDING'" class="w-3 h-3 stroke-[3]" />
                    <Clock v-else class="w-3 h-3" />
                  </div>
                  <span class="text-[9px] font-bold" :class="ticket.status !== 'PENDING' ? 'text-slate-700' : 'text-slate-400'">
                    Assigned
                  </span>
                </div>

                <!-- Step 3: Working -->
                <div class="flex flex-col items-center gap-1 z-10">
                  <div 
                    class="w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white"
                    :class="ticket.status === 'RESOLVED' 
                      ? 'bg-spu-purple text-white' 
                      : (ticket.status === 'IN_PROGRESS' ? 'bg-spu-pink text-white ring-spu-pink/30' : 'bg-slate-200 text-slate-400')"
                  >
                    <Check v-if="ticket.status === 'RESOLVED'" class="w-3 h-3 stroke-[3]" />
                    <Wrench v-else-if="ticket.status === 'IN_PROGRESS'" class="w-3 h-3" />
                    <span v-else class="text-[9px] font-bold">3</span>
                  </div>
                  <span class="text-[9px] font-bold" :class="ticket.status === 'IN_PROGRESS' ? 'text-spu-pink font-extrabold' : (ticket.status === 'RESOLVED' ? 'text-slate-700' : 'text-slate-400')">
                    Working
                  </span>
                </div>

                <!-- Step 4: Resolved -->
                <div class="flex flex-col items-center gap-1 z-10">
                  <div 
                    class="w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white"
                    :class="ticket.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'"
                  >
                    <Check v-if="ticket.status === 'RESOLVED'" class="w-3 h-3 stroke-[3]" />
                    <span v-else class="text-[9px] font-bold">4</span>
                  </div>
                  <span class="text-[9px] font-bold" :class="ticket.status === 'RESOLVED' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'">
                    Resolved
                  </span>
                </div>
              </div>
            </div>

            <!-- Technician Update Callout (For In Progress) -->
            <div 
              v-if="ticket.status === 'IN_PROGRESS'" 
              class="p-2.5 bg-spu-pink-50 border border-spu-pink-100 rounded-2xl flex items-start gap-2 text-xs text-spu-pink-900"
            >
              <Info class="w-4 h-4 text-spu-pink shrink-0 mt-0.5" />
              <p class="text-[11px] leading-snug">
                <span class="font-bold">Technician update:</span> Working on drainage pipe flush & clearing drip tray.
              </p>
            </div>

            <!-- Card Bottom Action Buttons -->
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <!-- When Resolved: Show View Before / After button and Rating -->
              <template v-if="ticket.status === 'RESOLVED'">
                <button 
                  @click="openBeforeAfter(ticket)"
                  class="px-3.5 py-2 bg-spu-purple-50 hover:bg-spu-purple text-spu-purple hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Eye class="w-3.5 h-3.5" />
                  <span>View Before / After</span>
                </button>
                <div class="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                  <span>Rated</span>
                  <span>★★★★★</span>
                </div>
              </template>

              <!-- When In Progress: Show Photos and Contact Tech -->
              <template v-else-if="ticket.status === 'IN_PROGRESS'">
                <button 
                  @click="openBeforeAfter(ticket)"
                  class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Camera class="w-3.5 h-3.5" />
                  <span>Photos (2)</span>
                </button>
                <button 
                  @click="contactTech(ticket)"
                  class="px-4 py-2 spu-gradient-primary text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare class="w-3.5 h-3.5" />
                  <span>Contact Tech</span>
                </button>
              </template>

              <!-- When Pending: Estimated review notice -->
              <template v-else>
                <span class="text-[11px] text-slate-400 font-medium">Estimated review: ~30 mins</span>
                <button 
                  @click="addDetails(ticket)"
                  class="text-xs font-bold text-spu-purple hover:underline"
                >
                  Add Details &gt;
                </button>
              </template>
            </div>

          </div>
        </div>

      </main>

      <!-- Bottom Nav -->
      <BottomNav :active-count="inProgressCount + pendingCount" @open-qr="isQrModalOpen = true" />

      <!-- Before/After Modal -->
      <BeforeAfterModal 
        :is-open="isBeforeAfterOpen" 
        :ticket="selectedTicket" 
        @close="isBeforeAfterOpen = false" 
      />

      <!-- QR Modal -->
      <QrScannerModal :is-open="isQrModalOpen" @close="isQrModalOpen = false" />

      <!-- Email Toast Simulator -->
      <EmailNotificationToast />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, 
  MapPin, 
  FileCheck, 
  Wrench, 
  Check, 
  Clock, 
  Info, 
  Eye, 
  Camera, 
  MessageSquare 
} from 'lucide-vue-next'

const tickets = ref<any[]>([])
const activeFilter = ref<'ALL' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED'>('ALL')
const isBeforeAfterOpen = ref(false)
const selectedTicket = ref<any>(null)
const isQrModalOpen = ref(false)

const inProgressCount = computed(() => tickets.value.filter(t => t.status === 'IN_PROGRESS').length)
const pendingCount = computed(() => tickets.value.filter(t => t.status === 'PENDING').length)
const resolvedCount = computed(() => tickets.value.filter(t => t.status === 'RESOLVED').length)

const filteredTickets = computed(() => {
  if (activeFilter.value === 'ALL') return tickets.value
  return tickets.value.filter(t => t.status === activeFilter.value)
})

function getStatusBadgeClass(status: string) {
  if (status === 'IN_PROGRESS') return 'bg-spu-pink-100 text-spu-pink font-black'
  if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-700 font-black'
  return 'bg-amber-100 text-amber-800 font-black'
}

function formatStatus(status: string) {
  if (status === 'IN_PROGRESS') return 'In Progress'
  if (status === 'RESOLVED') return 'Resolved'
  return 'Pending Review'
}

function getCategoryEmoji(cat: string) {
  if (cat.includes('Air')) return '❄️'
  if (cat.includes('Light') || cat.includes('Power')) return '💡'
  if (cat.includes('Sanitary')) return '🚰'
  if (cat.includes('Desk') || cat.includes('Chair')) return '🪑'
  if (cat.includes('Projector') || cat.includes('PC')) return '📽️'
  return '🔧'
}

function getStepLabel(status: string) {
  if (status === 'RESOLVED') return 'Step 4 of 4'
  if (status === 'IN_PROGRESS') return 'Step 3 of 4'
  return 'Step 1 of 4'
}

function getStepLineWidth(status: string) {
  if (status === 'RESOLVED') return '100%'
  if (status === 'IN_PROGRESS') return '66%'
  return '25%'
}

function formatRelativeTime(ts: string) {
  if (!ts) return 'Today, 10:15 AM'
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function openBeforeAfter(ticket: any) {
  selectedTicket.value = ticket
  isBeforeAfterOpen.value = true
}

function contactTech(ticket: any) {
  alert(`Connecting to lead technician (${ticket.assigned_tech || 'Somchai K.'}) via SPU campus radio/direct message.`)
}

function addDetails(ticket: any) {
  alert(`Opening comment thread for ticket #${ticket.id}.`)
}

async function loadTickets() {
  try {
    const res = await $fetch<any>('/api/reports')
    if (res.success && res.data) {
      tickets.value = res.data
    }
  } catch (err) {
    console.error('Failed to load tickets', err)
  }
}

onMounted(() => {
  loadTickets()
})
</script>
