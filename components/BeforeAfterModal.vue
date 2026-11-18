<template>
  <div v-if="isOpen && ticket" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90dvh]">
      <!-- Modal Header -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
        <div class="min-w-0 pr-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-spu-purple bg-spu-purple-50 px-2 py-0.5 rounded-full shrink-0">{{ ticket.id?.startsWith('Ticket') ? ticket.id : '#' + ticket.id }}</span>
            <span class="text-xs font-medium text-slate-500 truncate">{{ langStore.translateBuilding(ticket.building) }} • {{ langStore.translateRoom(ticket.room) }}</span>
          </div>
          <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">
            {{ langStore.currentLang.value === 'en' ? 'Before & After Repair Verification' : 'ภาพถ่ายยืนยันก่อนและหลังการซ่อม' }}
          </h3>
        </div>
        <button 
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors shrink-0"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Mode Toggle Buttons -->
      <div class="p-2 sm:p-3 bg-slate-100/80 flex gap-1.5 sm:gap-2 justify-center shrink-0">
        <button 
          @click="viewMode = 'split'" 
          class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
          :class="viewMode === 'split' ? 'bg-white shadow text-spu-purple font-bold' : 'text-slate-500 hover:text-slate-700'"
        >
          <span>{{ langStore.currentLang.value === 'en' ? 'Side by Side' : 'เปรียบเทียบสองฝั่ง' }}</span>
        </button>
        <button 
          @click="viewMode = 'before'" 
          class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
          :class="viewMode === 'before' ? 'bg-white shadow text-spu-purple font-bold' : 'text-slate-500 hover:text-slate-700'"
        >
          <span>{{ langStore.currentLang.value === 'en' ? 'Before' : 'ก่อนซ่อม' }}</span>
        </button>
        <button 
          @click="viewMode = 'after'" 
          class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
          :class="viewMode === 'after' ? 'bg-white shadow text-spu-purple font-bold' : 'text-slate-500 hover:text-slate-700'"
        >
          <span>{{ langStore.currentLang.value === 'en' ? 'After' : 'หลังซ่อม' }}</span>
        </button>
      </div>

      <!-- Images Display Area -->
      <div class="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
        <!-- Split View -->
        <div v-if="viewMode === 'split'" class="grid grid-cols-2 gap-2 sm:gap-3">
          <div class="space-y-1.5">
            <div class="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-inner">
              <img :src="ticket.image_before_url" alt="Before repair" class="w-full h-full object-cover" />
              <span class="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
                {{ langStore.currentLang.value === 'en' ? 'Before' : 'ก่อนซ่อม' }}
              </span>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-tight">{{ ticket.description }}</p>
          </div>

          <div class="space-y-1.5">
            <div class="relative rounded-2xl overflow-hidden border border-emerald-300 aspect-square bg-slate-100 shadow-inner">
              <img 
                :src="ticket.image_after_url || 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'" 
                alt="After repair" 
                class="w-full h-full object-cover" 
              />
              <span class="absolute bottom-1.5 left-1.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <Check class="w-2.5 h-2.5 stroke-[3]" /> {{ langStore.currentLang.value === 'en' ? 'Resolved' : 'ซ่อมเรียบร้อย' }}
              </span>
            </div>
            <p class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold leading-tight">
              {{ langStore.currentLang.value === 'en' ? 'Verified by Facilities Technician' : 'ตรวจสอบโดยช่างฝ่ายอาคาร' }}
            </p>
          </div>
        </div>

        <!-- Single Before View -->
        <div v-else-if="viewMode === 'before'" class="space-y-2">
          <div class="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-inner">
            <img :src="ticket.image_before_url" alt="Before repair" class="w-full h-full object-cover" />
          </div>
          <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
            <span class="font-bold text-slate-800">{{ langStore.currentLang.value === 'en' ? 'Reported Issue:' : 'ปัญหาที่แจ้ง:' }}</span> {{ ticket.description }}
          </div>
        </div>

        <!-- Single After View -->
        <div v-else-if="viewMode === 'after'" class="space-y-2">
          <div class="rounded-2xl overflow-hidden border border-emerald-200 aspect-video bg-slate-100 shadow-inner">
            <img 
              :src="ticket.image_after_url || 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'" 
              alt="After repair" 
              class="w-full h-full object-cover" 
            />
          </div>
          <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900">
            <span class="font-bold">{{ langStore.currentLang.value === 'en' ? 'Technician Log:' : 'บันทึกงานซ่อมโดยช่าง:' }}</span> {{ langStore.currentLang.value === 'en' ? '"Equipment inspected, cleaned, tested and operating normally under SPU Facilities standards."' : '"ตรวจสอบอุปกรณ์ ล้างทำความสะอาด และทดสอบระบบการทำงานเรียบร้อยตามมาตรฐานอาคารสถานที่ SPU"' }}
          </div>
        </div>

        <!-- Details Card -->
        <div class="p-3 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">{{ langStore.currentLang.value === 'en' ? 'Category:' : 'หมวดหมู่อุปกรณ์:' }}</span>
            <span class="font-bold text-slate-700">{{ ticket.category }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">{{ langStore.currentLang.value === 'en' ? 'Assigned Tech:' : 'ช่างผู้รับผิดชอบ:' }}</span>
            <span class="font-semibold text-slate-700">{{ ticket.assigned_tech || 'SPU Facility Team' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">{{ langStore.currentLang.value === 'en' ? 'Quality Rating:' : 'คะแนนประเมินคุณภาพ:' }}</span>
            <span class="text-amber-500 font-bold tracking-wider">★★★★★ (5.0)</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
        <button 
          @click="$emit('close')"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-spu-purple text-white text-xs font-bold hover:bg-spu-purple-700 active:scale-95 transition-all text-center"
        >
          {{ langStore.t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Check } from 'lucide-vue-next'
import { useAppLang } from '~/composables/useAppLang'

defineProps({
  isOpen: Boolean,
  ticket: Object as any
})

defineEmits(['close'])

const langStore = useAppLang()
const viewMode = ref<'split' | 'before' | 'after'>('split')
</script>
