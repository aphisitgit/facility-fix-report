<template>
  <div 
    v-if="notif.isNotificationOpen.value" 
    class="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in"
    @click.self="notif.isNotificationOpen.value = false"
  >
    <div class="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 transform transition-all animate-slide-left">
      
      <!-- Drawer Header -->
      <div class="p-4 sm:p-5 bg-gradient-to-r from-spu-purple to-spu-purple/95 text-white flex items-center justify-between border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="relative p-2 rounded-xl bg-white/15 border border-white/20">
            <Bell class="w-5 h-5 text-white" />
            <span 
              v-if="notif.unreadCount.value > 0" 
              class="absolute -top-1 -right-1 w-4 h-4 bg-spu-pink text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-spu-purple"
            >
              {{ notif.unreadCount.value }}
            </span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-extrabold text-sm sm:text-base leading-tight">Admin Notifications</h3>
              <span class="text-[9px] bg-spu-pink text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                Live
              </span>
            </div>
            <p class="text-[11px] text-pink-100">ศูนย์แจ้งเตือนงานซ่อมและเหตุขัดข้อง</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Audio Toggle -->
          <button 
            @click="notif.soundEnabled.value = !notif.soundEnabled.value" 
            :title="notif.soundEnabled.value ? 'ปิดเสียงแจ้งเตือน' : 'เปิดเสียงแจ้งเตือน'"
            class="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Volume2 v-if="notif.soundEnabled.value" class="w-4 h-4 text-emerald-300" />
            <VolumeX v-else class="w-4 h-4 text-slate-300" />
          </button>

          <!-- Close Drawer -->
          <button 
            @click="notif.isNotificationOpen.value = false" 
            class="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Action Bar & Filter Tabs -->
      <div class="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-1">
          <button 
            @click="filterTab = 'ALL'"
            class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all"
            :class="filterTab === 'ALL' ? 'bg-spu-purple text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'"
          >
            ทั้งหมด ({{ notif.notifications.value.length }})
          </button>
          <button 
            @click="filterTab = 'UNREAD'"
            class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1"
            :class="filterTab === 'UNREAD' ? 'bg-spu-pink text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'"
          >
            <span>ยังไม่อ่าน</span>
            <span v-if="notif.unreadCount.value > 0" class="px-1 rounded-full bg-white/20 text-[9px]">
              {{ notif.unreadCount.value }}
            </span>
          </button>
          <button 
            @click="filterTab = 'URGENT'"
            class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all"
            :class="filterTab === 'URGENT' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'"
          >
            เร่งด่วน
          </button>
        </div>

        <button 
          v-if="notif.unreadCount.value > 0"
          @click="notif.markAllAsRead()"
          class="text-[11px] font-semibold text-spu-purple hover:text-spu-pink flex items-center gap-1 transition-colors"
        >
          <CheckCheck class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">อ่านทั้งหมด</span>
        </button>
      </div>

      <!-- Notification List -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
        
        <div 
          v-if="filteredList.length === 0" 
          class="py-16 text-center space-y-3"
        >
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-700">ไม่มีการแจ้งเตือนค้าง</p>
            <p class="text-[11px] text-slate-400 mt-0.5">ระบบจัดการและติดตามงานซ่อมเป็นปัจจุบันแล้ว</p>
          </div>
        </div>

        <div 
          v-for="item in filteredList" 
          :key="item.id"
          @click="handleSelectTicket(item)"
          class="p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group"
          :class="item.read 
            ? 'bg-white border-slate-200/70 hover:bg-slate-50' 
            : 'bg-spu-pink-50/30 border-spu-pink/30 hover:bg-spu-pink-50/60 shadow-xs'"
        >
          <!-- Unread Dot Badge -->
          <div 
            v-if="!item.read" 
            class="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-spu-pink ring-2 ring-white"
          ></div>

          <div class="flex items-start gap-3">
            <!-- Category/Urgency Icon Badge -->
            <div 
              class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
              :class="item.urgency === 'Urgent' 
                ? 'bg-red-100 text-red-600' 
                : (item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-spu-purple/10 text-spu-purple')"
            >
              <AlertTriangle v-if="item.urgency === 'Urgent'" class="w-5 h-5 animate-pulse" />
              <CheckCircle v-else-if="item.status === 'RESOLVED'" class="w-5 h-5" />
              <Wrench v-else class="w-5 h-5" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pr-3">
              <div class="flex items-center gap-1.5 flex-wrap mb-1">
                <span 
                  v-if="item.urgency === 'Urgent'"
                  class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-mono"
                >
                  Urgent SLA
                </span>
                <span class="text-[10px] font-bold text-spu-purple bg-spu-purple-50 px-1.5 py-0.5 rounded">
                  ห้อง {{ item.room }}
                </span>
                <span class="text-[10px] font-medium text-slate-500 truncate">
                  {{ item.building }}
                </span>
              </div>

              <h4 class="text-xs font-bold text-slate-900 group-hover:text-spu-purple transition-colors truncate">
                {{ item.category }}: {{ item.description }}
              </h4>

              <div class="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400 border-t border-slate-100/60">
                <span class="flex items-center gap-1">
                  <Clock class="w-3 h-3 text-slate-400" />
                  {{ formatElapsed(item.createdAt) }}
                </span>
                <span class="font-mono text-slate-500 font-semibold">{{ item.ticketId }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <span class="text-[11px] text-slate-500">
          SPU Admin Incident Hub
        </span>
        <NuxtLink 
          to="/admin" 
          @click="notif.isNotificationOpen.value = false"
          class="text-xs font-bold text-spu-purple hover:text-spu-pink flex items-center gap-1 transition-colors"
        >
          <span>เปิดแดชบอร์ดหลัก</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Bell, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCheck, 
  CheckCircle2, 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  Clock, 
  ArrowRight 
} from 'lucide-vue-next'
import { useAdminNotifications, type AdminNotification } from '~/composables/useAdminNotifications'

const router = useRouter()
const notif = useAdminNotifications()
const filterTab = ref<'ALL' | 'UNREAD' | 'URGENT'>('ALL')

const filteredList = computed(() => {
  if (filterTab.value === 'UNREAD') {
    return notif.notifications.value.filter(n => !n.read)
  }
  if (filterTab.value === 'URGENT') {
    return notif.notifications.value.filter(n => n.urgency === 'Urgent')
  }
  return notif.notifications.value
})

const handleSelectTicket = (item: AdminNotification) => {
  notif.markAsRead(item.ticketId)
  notif.isNotificationOpen.value = false
  router.push('/admin#tickets')
}

const formatElapsed = (iso: string) => {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'เมื่อสักครู่'
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`
  return new Date(iso).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
@keyframes slideLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-left {
  animation: slideLeft 0.22s ease-out forwards;
}
</style>
