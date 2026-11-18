<template>
  <!-- ONLY display for Admin (never for regular users) -->
  <div 
    v-if="activeEmail && adminAuth.isAdmin.value" 
    class="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-auto sm:right-4 z-50 sm:max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-spu-pink/40 overflow-hidden animate-slide-in group"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Header -->
    <div class="p-3 sm:p-3.5 bg-gradient-to-r from-spu-purple to-spu-pink text-white flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Mail class="w-4 h-4 text-pink-200" />
        <span class="text-xs font-bold tracking-tight">Admin Live Notice: Email Dispatched</span>
      </div>
      <button 
        @click="closeToast" 
        class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        title="ปิดการแจ้งเตือน"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Body -->
    <div class="p-3 sm:p-3.5 space-y-1.5 text-xs">
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-800 truncate pr-2">To: {{ activeEmail.to }}</span>
        <span class="text-[10px] text-slate-400 font-mono shrink-0">{{ formatTime(activeEmail.timestamp) }}</span>
      </div>
      <p class="font-semibold text-spu-purple text-[11px] truncate">{{ activeEmail.subject }}</p>
      <p class="text-[11px] text-slate-500 line-clamp-2">{{ activeEmail.previewText }}</p>
      <div class="pt-1.5 flex items-center justify-between">
        <span class="text-[10px] text-slate-400">ปิดอัตโนมัติใน 3.5 วิ</span>
        <button 
          @click="openFullEmail" 
          class="text-[11px] text-spu-pink font-bold hover:underline"
        >
          View Full HTML Email &rarr;
        </button>
      </div>
    </div>

    <!-- 3.5s Auto-dismiss Countdown Progress Bar -->
    <div class="h-1 bg-slate-100 w-full overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-spu-purple to-spu-pink toast-progress"
        :class="{ 'paused': isHovered }"
      ></div>
    </div>

    <!-- Full HTML Email Preview Modal -->
    <div v-if="showFullEmail" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-lg w-full max-h-[85dvh] overflow-hidden flex flex-col shadow-2xl">
        <div class="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span class="text-xs font-bold text-slate-700">Email Preview Simulator (Admin Only)</span>
          <button @click="showFullEmail = false" class="text-slate-400 hover:text-slate-600 p-1">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1 bg-slate-100">
          <div v-html="activeEmail.htmlBody"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Mail, X } from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'

const adminAuth = useAdminAuth()
const activeEmail = ref<any>(null)
const showFullEmail = ref(false)
const isHovered = ref(false)

let interval: any = null
let dismissTimer: any = null
let lastSeenId = ''

const AUTO_DISMISS_MS = 3500 // เด้งไม่นาน (3.5 วินาที) แล้วหายไปเอง ไม่ค้าง

function startDismissTimer() {
  if (dismissTimer) clearTimeout(dismissTimer)
  dismissTimer = setTimeout(() => {
    if (!showFullEmail.value) {
      activeEmail.value = null
    }
  }, AUTO_DISMISS_MS)
}

function handleMouseEnter() {
  isHovered.value = true
  if (dismissTimer) clearTimeout(dismissTimer)
}

function handleMouseLeave() {
  isHovered.value = false
  startDismissTimer()
}

function closeToast() {
  if (dismissTimer) clearTimeout(dismissTimer)
  activeEmail.value = null
  showFullEmail.value = false
}

function openFullEmail() {
  if (dismissTimer) clearTimeout(dismissTimer)
  showFullEmail.value = true
}

async function checkEmails() {
  // ข้อกำหนด: เตือนเฉพาะแอดมินเท่านั้น หากไม่ใช่ Admin ห้ามแจ้งเตือนเด็ดขาด
  if (!adminAuth.isAdmin.value) {
    if (activeEmail.value) activeEmail.value = null
    return
  }

  try {
    const res = await $fetch<any>('/api/emails')
    if (res.success && res.data && res.data.length > 0) {
      const latest = res.data[0]
      if (lastSeenId && latest.id !== lastSeenId) {
        activeEmail.value = latest
        startDismissTimer()
      }
      lastSeenId = latest.id
    }
  } catch (e) {
    // Ignore network polling hiccups
  }
}

function formatTime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  checkEmails()
  interval = setInterval(checkEmails, 4000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
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
