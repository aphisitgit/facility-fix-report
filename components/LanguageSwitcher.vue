<template>
  <button 
    @click="langStore.toggleLang()"
    type="button"
    class="inline-flex items-center gap-1 bg-slate-100/90 hover:bg-slate-200/80 p-1 rounded-xl border border-slate-200/90 text-[11px] font-bold text-slate-600 transition-all shadow-2xs select-none"
    :title="langStore.currentLang.value === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'"
    aria-label="Switch Language"
  >
    <Globe class="w-3.5 h-3.5 text-spu-purple ml-0.5 shrink-0" />
    <span 
      class="px-1.5 py-0.5 rounded-lg transition-all text-[10px] sm:text-[11px]"
      :class="langStore.currentLang.value === 'th' ? 'bg-white text-spu-purple shadow-xs font-extrabold' : 'text-slate-400 hover:text-slate-600'"
    >
      ไทย
    </span>
    <span class="text-slate-300 text-[10px]">/</span>
    <span 
      class="px-1.5 py-0.5 rounded-lg transition-all text-[10px] sm:text-[11px]"
      :class="langStore.currentLang.value === 'en' ? 'bg-white text-spu-purple shadow-xs font-extrabold' : 'text-slate-400 hover:text-slate-600'"
    >
      ENG
    </span>
  </button>
</template>

<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { useAppLang } from '~/composables/useAppLang'

const langStore = useAppLang()
</script>
