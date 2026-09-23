<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-6 pb-5 pt-2 pointer-events-none">
    <nav class="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl rounded-full px-6 py-2.5 flex items-center justify-between">
      <!-- Home Link -->
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center gap-1 transition-all group"
        :class="route.path === '/' ? 'text-spu-purple font-semibold' : 'text-slate-400 hover:text-slate-600'"
      >
        <div class="relative p-1 rounded-full group-hover:bg-spu-purple-50 transition-colors">
          <Home class="w-5 h-5" :class="route.path === '/' ? 'stroke-[2.5]' : 'stroke-2'" />
        </div>
        <span class="text-[11px] font-medium tracking-tight">Home</span>
      </NuxtLink>

      <!-- Center Floating QR Action Button -->
      <div class="-mt-8 relative">
        <button 
          @click="$emit('open-qr')"
          type="button"
          class="w-14 h-14 rounded-full spu-gradient-hero text-white flex items-center justify-center shadow-lg shadow-spu-purple-600/30 hover:scale-105 active:scale-95 transition-all ring-4 ring-white"
          title="Quick Scan Room QR Code"
        >
          <QrCode class="w-6 h-6 stroke-[2.2]" />
        </button>
      </div>

      <!-- My Reports Link -->
      <NuxtLink 
        to="/tracking" 
        class="flex flex-col items-center gap-1 transition-all group relative"
        :class="route.path === '/tracking' ? 'text-spu-purple font-semibold' : 'text-slate-400 hover:text-slate-600'"
      >
        <div class="relative p-1 rounded-full group-hover:bg-spu-purple-50 transition-colors">
          <FileText class="w-5 h-5" :class="route.path === '/tracking' ? 'stroke-[2.5]' : 'stroke-2'" />
          <span class="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-spu-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
            {{ activeCount }}
          </span>
        </div>
        <span class="text-[11px] font-medium tracking-tight">My Reports</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Home, QrCode, FileText } from 'lucide-vue-next'

const route = useRoute()

defineProps({
  activeCount: {
    type: Number,
    default: 2
  }
})

defineEmits(['open-qr'])
</script>
