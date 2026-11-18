<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Left Sidebar -->
    <AdminSidebar 
      :active-tickets-count="tickets.length"
      :is-open="adminSidebar.isSidebarOpen.value"
      @close="adminSidebar.close()"
      @logout="adminAuth.logout()"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 flex flex-col transition-all duration-300">
      <!-- Top Header -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <!-- Navigation Drawer Toggle Button -->
          <button 
            @click="adminSidebar.toggle()" 
            type="button"
            class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center"
            :title="adminSidebar.isSidebarOpen.value ? 'Slide out / Hide Drawer' : 'Open Navigation Drawer'"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu class="w-5 h-5" />
          </button>

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <Database class="w-4 h-4 sm:w-5 sm:h-5 text-spu-purple shrink-0" />
              <h1 class="text-base sm:text-lg font-bold text-slate-900">สำรวจและจัดการฐานข้อมูล (Database Explorer)</h1>
              <span class="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                SQLite: prisma/dev.db
              </span>
            </div>
            <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5">ตรวจสอบและเรียกดูข้อมูลดิบในฐานข้อมูล SQLite แบบเรียลไทม์</p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button 
            @click="fetchDbRaw"
            class="px-3 sm:px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="isLoading ? 'animate-spin' : ''" />
            <span>รีเฟรชข้อมูล</span>
          </button>

          <button 
            @click="showPrismaStudioGuide = true"
            class="px-3 sm:px-4 py-2 spu-gradient-hero text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-sm transition-all flex items-center gap-1.5"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>Prisma Studio</span>
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

      <!-- Main Database Inspector -->
      <main class="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        
        <!-- Database Guide Cards (3 Methods to inspect the Database) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Method 1: Web Explorer (This page) -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div class="flex items-center gap-2 text-spu-purple">
              <Eye class="w-4 h-4" />
              <h3 class="text-xs font-bold uppercase tracking-wider">วิธีที่ 1: In-App Web Explorer</h3>
            </div>
            <p class="text-xs text-slate-600 leading-snug">
              ดูตารางและข้อมูลสดได้ทันทีบนหน้านี้ ไม่ต้องพิมพ์คำสั่งใดๆ ใน Terminal
            </p>
            <span class="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Active Now
            </span>
          </div>

          <!-- Method 2: Prisma Studio -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div class="flex items-center gap-2 text-spu-pink">
              <Terminal class="w-4 h-4" />
              <h3 class="text-xs font-bold uppercase tracking-wider">วิธีที่ 2: Prisma Studio GUI</h3>
            </div>
            <p class="text-xs text-slate-600 leading-snug">
              เปิด Terminal แล้วพิมพ์ <code class="bg-slate-100 text-spu-purple px-1 py-0.5 rounded font-mono font-bold">npx prisma studio</code> จะเปิดเว็บที่พอร์ต 5555
            </p>
            <span class="inline-block text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
              Visual Editor & Admin
            </span>
          </div>

          <!-- Method 3: SQLite File -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div class="flex items-center gap-2 text-slate-700">
              <HardDrive class="w-4 h-4" />
              <h3 class="text-xs font-bold uppercase tracking-wider">วิธีที่ 3: ไฟล์ SQLite ตรง</h3>
            </div>
            <p class="text-xs text-slate-600 leading-snug">
              ไฟล์ฐานข้อมูลอยู่ที่ <code class="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">prisma/dev.db</code> เปิดด้วย VS Code SQLite Extension หรือ DB Browser
            </p>
            <span class="inline-block text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
              File-based
            </span>
          </div>
        </div>

        <!-- Table Selector Tabs -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div class="flex items-center gap-2">
              <button 
                @click="selectedTable = 'tickets'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                :class="selectedTable === 'tickets' ? 'bg-spu-purple text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
              >
                <span>Table: Ticket</span>
                <span class="text-[10px] opacity-80 bg-black/20 px-1.5 py-0.2 rounded-full">{{ tickets.length }} rows</span>
              </button>

              <button 
                @click="selectedTable = 'status_logs'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                :class="selectedTable === 'status_logs' ? 'bg-spu-purple text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
              >
                <span>Table: StatusLog</span>
                <span class="text-[10px] opacity-80 bg-black/20 px-1.5 py-0.2 rounded-full">{{ statusLogs.length }} rows</span>
              </button>

              <button 
                @click="selectedTable = 'admin_users'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                :class="selectedTable === 'admin_users' ? 'bg-spu-purple text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
              >
                <span>Table: AdminUser</span>
                <span class="text-[10px] opacity-80 bg-black/20 px-1.5 py-0.2 rounded-full">{{ adminUsers.length }} rows</span>
              </button>
            </div>

            <!-- View format toggle -->
            <div class="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-[11px] font-bold">
              <button 
                @click="viewFormat = 'table'"
                class="px-2.5 py-1 rounded-lg transition-all"
                :class="viewFormat === 'table' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'"
              >
                มุมมองตาราง (Table)
              </button>
              <button 
                @click="viewFormat = 'json'"
                class="px-2.5 py-1 rounded-lg transition-all"
                :class="viewFormat === 'json' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'"
              >
                ข้อมูลดิบ JSON (Raw)
              </button>
            </div>
          </div>

          <!-- Table View for Tickets -->
          <div v-if="selectedTable === 'tickets' && viewFormat === 'table'" class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 font-mono">
                <tr>
                  <th class="p-3 pl-5">id</th>
                  <th class="p-3">building</th>
                  <th class="p-3">room</th>
                  <th class="p-3">category</th>
                  <th class="p-3">urgency</th>
                  <th class="p-3">status</th>
                  <th class="p-3">reporter_email</th>
                  <th class="p-3">assigned_tech</th>
                  <th class="p-3 pr-5">created_at</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr v-for="t in tickets" :key="t.id" class="hover:bg-slate-50/80 transition-colors">
                  <td class="p-3 pl-5 font-mono font-bold text-spu-purple">{{ t.id }}</td>
                  <td class="p-3">{{ t.building }}</td>
                  <td class="p-3 font-semibold">{{ t.room }}</td>
                  <td class="p-3">{{ t.category }}</td>
                  <td class="p-3">
                    <span :class="t.urgency === 'Urgent' ? 'text-spu-pink font-bold' : 'text-slate-600'">{{ t.urgency }}</span>
                  </td>
                  <td class="p-3">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          :class="t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : (t.status === 'IN_PROGRESS' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700')">
                      {{ t.status }}
                    </span>
                  </td>
                  <td class="p-3 font-mono text-[11px] text-slate-500">{{ t.reporter_email }}</td>
                  <td class="p-3 text-slate-600">{{ t.assigned_tech || '-' }}</td>
                  <td class="p-3 pr-5 text-[11px] text-slate-400 font-mono">{{ formatDate(t.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table View for StatusLogs -->
          <div v-else-if="selectedTable === 'status_logs' && viewFormat === 'table'" class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 font-mono">
                <tr>
                  <th class="p-3 pl-5">id</th>
                  <th class="p-3">ticket_id</th>
                  <th class="p-3">status_step</th>
                  <th class="p-3">note</th>
                  <th class="p-3 pr-5">created_at</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr v-for="log in statusLogs" :key="log.id" class="hover:bg-slate-50/80 transition-colors">
                  <td class="p-3 pl-5 font-mono text-slate-400">{{ log.id }}</td>
                  <td class="p-3 font-mono font-bold text-spu-purple">{{ log.ticket_id }}</td>
                  <td class="p-3 font-semibold text-slate-800">{{ log.status_step }}</td>
                  <td class="p-3 text-slate-600">{{ log.note || '-' }}</td>
                  <td class="p-3 pr-5 text-[11px] text-slate-400 font-mono">{{ formatDate(log.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table View for Admin Users -->
          <div v-else-if="selectedTable === 'admin_users' && viewFormat === 'table'" class="overflow-x-auto">
            <table class="w-full text-left text-xs whitespace-nowrap">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 font-mono">
                <tr>
                  <th class="p-3 pl-5">id</th>
                  <th class="p-3">username</th>
                  <th class="p-3">name</th>
                  <th class="p-3">role</th>
                  <th class="p-3">phone</th>
                  <th class="p-3 pr-5">created_at</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr v-for="user in adminUsers" :key="user.id" class="hover:bg-slate-50/80 transition-colors">
                  <td class="p-3 pl-5 font-mono text-slate-400">{{ user.id }}</td>
                  <td class="p-3 font-mono font-bold text-spu-purple">{{ user.username }}</td>
                  <td class="p-3 font-semibold text-slate-800">{{ user.name }}</td>
                  <td class="p-3 text-spu-pink font-semibold">{{ user.role }}</td>
                  <td class="p-3 text-slate-600">{{ user.phone || '-' }}</td>
                  <td class="p-3 pr-5 text-[11px] text-slate-400 font-mono">{{ formatDate(user.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- JSON View -->
          <div v-else class="p-5 bg-slate-900 text-pink-400 font-mono text-xs overflow-x-auto max-h-[500px]">
            <pre>{{ JSON.stringify(selectedTable === 'tickets' ? tickets : (selectedTable === 'status_logs' ? statusLogs : adminUsers), null, 2) }}</pre>
          </div>
        </div>

      </main>

      <!-- Prisma Studio Guide Modal -->
      <div v-if="showPrismaStudioGuide" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal class="w-4 h-4 text-spu-purple" />
              <span>ขั้นตอนการเปิด Prisma Studio ในเครื่องของคุณ</span>
            </h3>
            <button @click="showPrismaStudioGuide = false" class="text-slate-400 hover:text-slate-600">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>1. เปิด Terminal หรือ PowerShell ในโฟลเดอร์โปรเจกต์ (<code class="bg-slate-100 px-1 py-0.5 rounded font-mono">f:\Dara</code>)</p>
            <p>2. รันคำสั่งด้านล่างนี้:</p>
            <div class="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs flex items-center justify-between">
              <span>npx prisma studio</span>
              <button @click="copyCommand" class="text-slate-400 hover:text-white text-[10px]">Copy</button>
            </div>
            <p>3. ระบบจะเปิดหน้าต่างเบราว์เซอร์อัตโนมัติที่:</p>
            <div class="p-2 bg-purple-50 text-spu-purple font-mono font-bold rounded-lg text-center">
              http://localhost:5555
            </div>
            <p>4. คุณสามารถเพิ่ม (Add record), แก้ไข (Edit), ลบ (Delete), หรือค้นหาฟิลด์ต่างๆ ในฐานข้อมูลได้ทันทีผ่านหน้าต่างกราฟิกที่สวยงาม</p>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              @click="showPrismaStudioGuide = false"
              class="px-4 py-2 bg-spu-purple text-white text-xs font-bold rounded-xl"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Database, RefreshCw, ExternalLink, Eye, Terminal, HardDrive, X, Menu, Bell } from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAdminSidebar } from '~/composables/useAdminSidebar'

const router = useRouter()
const adminAuth = useAdminAuth()
const notif = useAdminNotifications()
const adminSidebar = useAdminSidebar()
const isLoading = ref(false)
const selectedTable = ref<'tickets' | 'status_logs' | 'admin_users'>('tickets')
const viewFormat = ref<'table' | 'json'>('table')
const showPrismaStudioGuide = ref(false)

const tickets = ref<any[]>([])
const statusLogs = ref<any[]>([])
const adminUsers = ref<any[]>([])

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString()
}

function copyCommand() {
  navigator.clipboard.writeText('npx prisma studio')
  alert('Copied "npx prisma studio" to clipboard!')
}

async function fetchDbRaw() {
  isLoading.value = true
  try {
    const res = await $fetch<any>('/api/db-raw')
    if (res.success && res.tables) {
      tickets.value = res.tables.tickets.rows
      statusLogs.value = res.tables.status_logs.rows
      adminUsers.value = res.tables.admin_users?.rows || []
    }
  } catch (err: any) {
    alert(`Failed to query database: ${err.message}`)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  adminSidebar.initSidebar()
  fetchDbRaw()
})
</script>
