<template>
  <div v-if="activeEmail" class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-2 border-spu-pink/30 overflow-hidden animate-slide-in">
    <div class="p-3.5 bg-gradient-to-r from-spu-purple to-spu-pink text-white flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Mail class="w-4 h-4 text-pink-200" />
        <span class="text-xs font-bold tracking-tight">Automated SPU Email Dispatched</span>
      </div>
      <button @click="activeEmail = null" class="text-white/80 hover:text-white">
        <X class="w-4 h-4" />
      </button>
    </div>
    <div class="p-3.5 space-y-1.5 text-xs">
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-800">To: {{ activeEmail.to }}</span>
        <span class="text-[10px] text-slate-400 font-mono">{{ formatTime(activeEmail.timestamp) }}</span>
      </div>
      <p class="font-semibold text-spu-purple text-[11px]">{{ activeEmail.subject }}</p>
      <p class="text-[11px] text-slate-500 line-clamp-2">{{ activeEmail.previewText }}</p>
      <div class="pt-2 flex justify-end">
        <button 
          @click="showFullEmail = true" 
          class="text-[10px] text-spu-pink font-bold hover:underline"
        >
          View Full HTML Email &rarr;
        </button>
      </div>
    </div>

    <!-- Full HTML Email Preview Modal -->
    <div v-if="showFullEmail" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div class="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span class="text-xs font-bold text-slate-700">Email Preview Simulator</span>
          <button @click="showFullEmail = false" class="text-slate-400 hover:text-slate-600">
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

const activeEmail = ref<any>(null)
const showFullEmail = ref(false)
let interval: any = null
let lastSeenId = ''

async function checkEmails() {
  try {
    const res = await $fetch<any>('/api/emails')
    if (res.success && res.data && res.data.length > 0) {
      const latest = res.data[0]
      if (lastSeenId && latest.id !== lastSeenId) {
        activeEmail.value = latest
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
})
</script>
