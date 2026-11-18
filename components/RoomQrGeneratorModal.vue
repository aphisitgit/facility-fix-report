<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90dvh]">
      
      <!-- Modal Header -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <div class="flex items-center gap-2.5 min-w-0 pr-2">
          <div class="w-9 h-9 rounded-2xl bg-spu-purple text-white flex items-center justify-center shadow-xs shrink-0">
            <QrCode class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-slate-900 truncate">
              {{ langStore.currentLang.value === 'en' ? 'Room QR Code Sticker Generator' : 'ระบบสร้างสติกเกอร์ QR Code ประจำห้อง' }}
            </h3>
            <p class="text-[11px] text-slate-400 truncate">
              {{ langStore.currentLang.value === 'en' ? 'Generate and print room-specific QR stickers for campus doors & desks' : 'สร้างและพิมพ์สติกเกอร์ QR Code ประจำห้องสำหรับติดหน้าประตูหรือโต๊ะเรียน' }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-200/80 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors shrink-0"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content Form & Preview -->
      <div class="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
        
        <!-- Selection Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ langStore.t('qrBuildingField') }}</label>
            <select 
              v-model="selectedBuilding"
              class="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
            >
              <option value="Building 11">{{ langStore.translateBuilding('Building 11') }}</option>
              <option value="Building 5">{{ langStore.translateBuilding('Building 5') }}</option>
              <option value="Building 9">{{ langStore.translateBuilding('Building 9') }}</option>
              <option value="Central Library">{{ langStore.translateBuilding('Central Library') }}</option>
              <option value="Cafeteria">{{ langStore.translateBuilding('Cafeteria') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ langStore.t('qrFloorField') }}</label>
            <select 
              v-model="selectedFloor"
              class="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
            >
              <option v-for="f in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']" :key="f" :value="f">
                {{ langStore.translateFloor(f) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ langStore.t('qrRoomField') }}</label>
            <input 
              v-model="roomName"
              type="text"
              :placeholder="langStore.t('qrRoomPlaceholder')"
              class="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
            />
          </div>
        </div>

        <!-- Printable Sticker Preview (This section is designed to be printed!) -->
        <div class="border-2 border-dashed border-slate-300 rounded-3xl p-6 bg-slate-50/50 flex flex-col items-center">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{{ langStore.t('qrPreviewBadge') }}</p>

          <div id="printable-sticker" class="w-72 bg-white rounded-2xl border-2 border-spu-purple shadow-lg p-5 text-center flex flex-col items-center space-y-3 relative overflow-hidden">
            <!-- Top SPU Brand Strip -->
            <div class="w-full spu-gradient-primary text-white py-1.5 px-3 rounded-lg flex items-center justify-between">
              <span class="text-[10px] font-extrabold tracking-wider">SRIPATUM UNIVERSITY</span>
              <span class="text-[9px] opacity-80">FACILITY FIX</span>
            </div>

            <!-- Room Headline -->
            <div>
              <span class="text-[10px] font-bold text-spu-pink uppercase tracking-wider">{{ langStore.translateBuilding(selectedBuilding) }} • {{ langStore.translateFloor(selectedFloor) }}</span>
              <h4 class="text-sm font-black text-slate-900 leading-tight mt-0.5">{{ langStore.translateRoom(roomName) }}</h4>
            </div>

            <!-- QR Code Image -->
            <div class="p-2 bg-white border border-slate-200 rounded-xl shadow-inner relative group">
              <img :src="qrCodeUrl" alt="Room QR Code" class="w-40 h-40 object-contain mx-auto" />
              <div class="w-6 h-6 rounded-full bg-spu-purple text-white text-[9px] font-bold absolute inset-0 m-auto flex items-center justify-center border-2 border-white shadow">
                SPU
              </div>
            </div>

            <!-- Instruction Tag -->
            <div class="bg-spu-pink-50 text-spu-pink-700 text-[10px] font-bold py-1 px-3 rounded-full border border-spu-pink-100">
              {{ langStore.t('qrStickerScanTag') }}
            </div>

            <p class="text-[9px] text-slate-400">{{ langStore.t('qrStickerScanHint') }}</p>
          </div>
        </div>

        <!-- Generated URL Display -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div class="truncate mr-3">
            <span class="font-bold text-slate-500">URL ปลายทางของ QR: </span>
            <span class="font-mono text-spu-purple text-[11px] truncate">{{ targetUrl }}</span>
          </div>
          <button 
            @click="copyUrl" 
            class="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] shrink-0"
          >
            คัดลอก URL
          </button>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button 
          @click="testScanRoom"
          type="button"
          class="text-xs font-bold text-spu-purple hover:text-spu-pink transition-colors flex items-center gap-1.5"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>ทดสอบเปิดหน้าพิกัดห้องนี้</span>
        </button>

        <div class="flex items-center gap-2">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ปิด
          </button>

          <button 
            type="button" 
            @click="printSticker"
            class="px-5 py-2.5 spu-gradient-primary text-white text-xs font-bold rounded-xl shadow-md shadow-spu-purple/20 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Printer class="w-4 h-4" />
            <span>พิมพ์สติกเกอร์ QR</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { QrCode, X, Printer, ExternalLink } from 'lucide-vue-next'
import { useAppLang } from '~/composables/useAppLang'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])
const router = useRouter()
const langStore = useAppLang()

const selectedBuilding = ref('Building 11')
const selectedFloor = ref('5')
const roomName = ref('11-502 (Multimedia Lab)')

const targetUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/?building=${encodeURIComponent(selectedBuilding.value)}&floor=${encodeURIComponent(selectedFloor.value)}&room=${encodeURIComponent(roomName.value)}`
  }
  return `/?building=${encodeURIComponent(selectedBuilding.value)}&floor=${encodeURIComponent(selectedFloor.value)}&room=${encodeURIComponent(roomName.value)}`
})

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl.value)}`
})

function copyUrl() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(targetUrl.value)
    alert('คัดลอก URL เรียบร้อยแล้ว!')
  }
}

function testScanRoom() {
  emit('close')
  router.push({
    path: '/',
    query: {
      building: selectedBuilding.value,
      floor: selectedFloor.value,
      room: roomName.value
    }
  })
}

function printSticker() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Room QR - ${roomName.value}</title>
        <style>
          body { font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; }
          .sticker { width: 300px; border: 3px solid #4A154B; border-radius: 16px; padding: 20px; text-align: center; }
          .header { background: #4A154B; color: white; padding: 6px; border-radius: 6px; font-weight: bold; font-size: 12px; margin-bottom: 12px; }
          .room { font-size: 18px; font-weight: 900; color: #1e293b; margin: 6px 0; }
          .building { font-size: 12px; font-weight: bold; color: #D63384; }
          .qr { width: 180px; height: 180px; margin: 10px auto; }
          .footer { font-size: 11px; font-weight: bold; color: #4A154B; background: #fdf2f8; padding: 6px; border-radius: 9999px; }
        </style>
      </head>
      <body>
        <div class="sticker">
          <div class="header">SRIPATUM UNIVERSITY • FACILITY FIX</div>
          <div class="building">${selectedBuilding.value} • Floor ${selectedFloor.value}</div>
          <div class="room">${roomName.value}</div>
          <img src="${qrCodeUrl.value}" class="qr" />
          <div class="footer">Scan to Report or View Room History</div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        <\/script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
</script>
