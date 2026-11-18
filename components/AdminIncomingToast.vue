<template>
  <div 
    v-if="notif.incomingToast.value && adminAuth.isAdmin.value"
    class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-2 border-spu-pink overflow-hidden animate-slide-in group"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="p-3 bg-gradient-to-r from-spu-purple to-spu-pink text-white flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Bell class="w-4 h-4 text-pink-200 animate-bounce" />
        <span class="text-xs font-bold tracking-tight">Admin Live Notification</span>
      </div>
      <button 
        @click="notif.dismissToast()" 
        class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <div class="p-3.5 space-y-2 text-xs">
      <div class="flex items-center justify-between">
        <span 
          class="text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono"
          :class="notif.incomingToast.value.urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-spu-purple/10 text-spu-purple'"
        >
          {{ notif.incomingToast.value.urgency === 'Urgent' ? '⚠️ ด่วนพิเศษ' : '📋 แจ้งซ่อมใหม่' }}
        </span>
        <span class="text-[10px] text-slate-400 font-mono">{{ notif.incomingToast.value.ticketId }}</span>
      </div>

      <p class="font-bold text-slate-800 text-xs">
        [ห้อง {{ notif.incomingToast.value.room }}] {{ notif.incomingToast.value.building }}
      </p>

      <p class="text-[11px] text-slate-500 line-clamp-2">
        {{ notif.incomingToast.value.category }}: {{ notif.incomingToast.value.description }}
      </p>

      <div class="pt-1 flex items-center justify-between border-t border-slate-100">
        <span class="text-[10px] text-slate-400">ปิดอัตโนมัติใน 3.5 วิ</span>
        <div class="flex items-center gap-2">
          <button 
            @click="notif.dismissToast()"
            class="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            รับทราบ
          </button>
          <button 
            @click="handleViewTicket"
            class="px-3 py-1 text-[11px] font-bold bg-spu-purple text-white hover:bg-spu-purple/90 rounded-lg shadow-sm transition-colors flex items-center gap-1"
          >
            <span>ตรวจสอบงาน</span>
            <ArrowRight class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- 3.5s Countdown Progress Line -->
    <div class="h-1 bg-slate-100 w-full overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-spu-purple to-spu-pink toast-progress" 
        :class="{ 'paused': isHovered }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, X, ArrowRight } from 'lucide-vue-next'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAdminAuth } from '~/composables/useAdminAuth'

const router = useRouter()
const notif = useAdminNotifications()
const adminAuth = useAdminAuth()

const isHovered = ref(false)
let dismissTimer: any = null
const AUTO_DISMISS_MS = 3500 // เด้งไม่นาน (3.5 วินาที) แล้วหายไปเอง ไม่ค้าง

const startTimer = () => {
  if (dismissTimer) clearTimeout(dismissTimer)
  dismissTimer = setTimeout(() => {
    notif.dismissToast()
  }, AUTO_DISMISS_MS)
}

const handleMouseEnter = () => {
  isHovered.value = true
  if (dismissTimer) clearTimeout(dismissTimer)
}

const handleMouseLeave = () => {
  isHovered.value = false
  startTimer()
}

const handleViewTicket = () => {
  if (dismissTimer) clearTimeout(dismissTimer)
  if (notif.incomingToast.value) {
    notif.markAsRead(notif.incomingToast.value.ticketId)
  }
  notif.dismissToast()
  router.push('/admin#tickets')
}

watch(() => notif.incomingToast.value, (newVal) => {
  if (dismissTimer) clearTimeout(dismissTimer)
  if (newVal) {
    isHovered.value = false
    startTimer()
  }
})

onUnmounted(() => {
  if (dismissTimer) clearTimeout(dismissTimer)
})
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes toastCountdown {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.toast-progress {
  animation: toastCountdown 3.5s linear forwards;
}

.paused {
  animation-play-state: paused;
}
</style>
