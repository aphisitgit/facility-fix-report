<template>
  <div v-if="isOpen && ticket" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-spu-purple bg-spu-purple-50 px-2 py-0.5 rounded-full">#{{ ticket.id }}</span>
            <span class="text-xs font-medium text-slate-500">{{ ticket.building }} • {{ ticket.room }}</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 mt-1">Before & After Repair Verification</h3>
        </div>
        <button 
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Mode Toggle Buttons -->
      <div class="p-3 bg-slate-100/70 flex gap-2 justify-center">
        <button 
          @click="viewMode = 'split'" 
          class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          :class="viewMode === 'split' ? 'bg-white shadow text-spu-purple' : 'text-slate-500 hover:text-slate-700'"
        >
          Side-by-Side
        </button>
        <button 
          @click="viewMode = 'before'" 
          class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          :class="viewMode === 'before' ? 'bg-white shadow text-spu-purple' : 'text-slate-500 hover:text-slate-700'"
        >
          Original (Before)
        </button>
        <button 
          @click="viewMode = 'after'" 
          class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          :class="viewMode === 'after' ? 'bg-white shadow text-spu-purple' : 'text-slate-500 hover:text-slate-700'"
        >
          Fixed (After)
        </button>
      </div>

      <!-- Images Display Area -->
      <div class="p-5 overflow-y-auto max-h-[60vh] space-y-4">
        <!-- Split View -->
        <div v-if="viewMode === 'split'" class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <div class="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
              <img :src="ticket.image_before_url" alt="Before repair" class="w-full h-full object-cover" />
              <span class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Original (Before)
              </span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-2">{{ ticket.description }}</p>
          </div>

          <div class="space-y-1.5">
            <div class="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
              <img 
                :src="ticket.image_after_url || 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'" 
                alt="After repair" 
                class="w-full h-full object-cover" 
              />
              <span class="absolute bottom-2 left-2 bg-emerald-600/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Check class="w-3 h-3" /> Repaired & Verified
              </span>
            </div>
            <p class="text-[11px] text-emerald-600 font-medium">Technician verified resolution</p>
          </div>
        </div>

        <!-- Single Before View -->
        <div v-else-if="viewMode === 'before'" class="space-y-2">
          <div class="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
            <img :src="ticket.image_before_url" alt="Before repair" class="w-full h-full object-cover" />
          </div>
          <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            <span class="font-semibold text-slate-800">Initial Issue:</span> {{ ticket.description }}
          </div>
        </div>

        <!-- Single After View -->
        <div v-else-if="viewMode === 'after'" class="space-y-2">
          <div class="rounded-2xl overflow-hidden border border-emerald-200 aspect-video bg-slate-100">
            <img 
              :src="ticket.image_after_url || 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'" 
              alt="After repair" 
              class="w-full h-full object-cover" 
            />
          </div>
          <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800">
            <span class="font-semibold">Technician Somchai K.:</span> "Component inspected, lubricated, and certified working under SPU campus SLA specifications."
          </div>
        </div>

        <!-- Details Card -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Category:</span>
            <span class="font-semibold text-slate-700">{{ ticket.category }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Assigned Tech:</span>
            <span class="font-semibold text-slate-700">{{ ticket.assigned_tech || 'SPU Facility Team' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Quality Rating:</span>
            <span class="text-amber-500 font-bold tracking-wider">★★★★★ (5.0)</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button 
          @click="$emit('close')"
          class="px-5 py-2 rounded-xl bg-spu-purple text-white text-xs font-semibold hover:bg-spu-purple-700 transition-colors"
        >
          Close Preview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Check } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  ticket: Object as any
})

defineEmits(['close'])

const viewMode = ref<'split' | 'before' | 'after'>('split')
</script>
