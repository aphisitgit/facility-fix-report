<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
      <!-- Modal Header -->
      <div class="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-spu-purple/10 text-spu-purple flex items-center justify-center">
            <QrCode class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">SPU Room QR Scanner</h3>
            <p class="text-[11px] text-slate-400">Scan desk sticker or room doorway</p>
          </div>
        </div>
        <button 
          @click="$emit('close')" 
          class="w-7 h-7 rounded-full bg-slate-200/80 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Viewfinder Area -->
      <div class="relative bg-slate-950 aspect-square flex flex-col items-center justify-center overflow-hidden">
        <!-- Live Camera Simulation Canvas -->
        <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#d63384_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <!-- Viewfinder Corners Box -->
        <div class="relative w-56 h-56 rounded-2xl border-2 border-dashed border-spu-pink/80 flex items-center justify-center">
          <!-- Laser Scan Line Animation -->
          <div class="absolute left-2 right-2 h-0.5 bg-spu-pink shadow-glow-pink animate-pulse top-1/2 -translate-y-1/2"></div>
          
          <div class="text-center p-4">
            <Scan class="w-12 h-12 text-spu-pink/70 mx-auto animate-pulse" />
            <p class="text-xs text-white/80 mt-2 font-medium">Align QR code inside box</p>
          </div>
        </div>

        <div class="absolute bottom-3 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl py-1.5 px-3 text-center">
          <span class="text-[11px] text-pink-300 font-medium flex items-center justify-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Camera Active • Ready to Detect
          </span>
        </div>
      </div>

      <!-- Quick Room QR Simulation Selection -->
      <div class="p-4 bg-slate-50">
        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Simulate Room QR Detection:</p>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="preset in presets" 
            :key="preset.room"
            @click="selectPreset(preset)"
            class="p-2 bg-white rounded-xl border border-slate-200 hover:border-spu-purple hover:bg-spu-purple-50 text-left transition-all group"
          >
            <p class="text-xs font-bold text-slate-800 group-hover:text-spu-purple truncate">{{ preset.building }}</p>
            <p class="text-[10px] text-slate-500 truncate">{{ preset.room }}</p>
          </button>
        </div>
      </div>

      <div class="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
        <span class="text-slate-400">or enter room manually</span>
        <button 
          @click="selectPreset(null)"
          class="font-semibold text-spu-purple hover:text-spu-pink transition-colors"
        >
          Open Empty Form &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QrCode, X, Scan } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])
const router = useRouter()

const presets = [
  { building: 'Building 11', floor: '5', room: '11-502 (Multimedia Lab)' },
  { building: 'Building 5', floor: '3', room: '5-301 (Smart Seminar Hall)' },
  { building: 'Central Library', floor: '3', room: '3rd Floor Quiet Zone' },
  { building: 'Building 9', floor: '4', room: 'Lab 9-401 (Robotics Lab)' }
]

function selectPreset(preset: any) {
  emit('close')
  if (preset) {
    router.push({
      path: '/',
      query: {
        building: preset.building,
        floor: preset.floor,
        room: preset.room
      }
    })
  } else {
    router.push('/report')
  }
}
</script>
