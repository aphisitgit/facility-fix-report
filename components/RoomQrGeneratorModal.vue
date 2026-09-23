<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
      
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-2xl bg-spu-purple text-white flex items-center justify-center shadow-xs">
            <QrCode class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Room QR Code Sticker Generator</h3>
            <p class="text-[11px] text-slate-400">Generate and print room-specific QR stickers for campus doors & desks</p>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-200/80 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content Form & Preview -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1">
        
        <!-- Selection Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Building</label>
            <select 
              v-model="selectedBuilding"
              class="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
            >
              <option value="Building 11">Building 11 (Multimedia & Tech)</option>
              <option value="Building 5">Building 5 (Comm Arts Studio)</option>
              <option value="Building 9">Building 9 (Engineering Complex)</option>
              <option value="Central Library">Central Library</option>
              <option value="Cafeteria">Student Union & Cafeteria</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Floor</label>
            <select 
              v-model="selectedFloor"
              class="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
            >
              <option v-for="f in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']" :key="f" :value="f">
                Floor {{ f }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Room / Zone</label>
            <input 
              v-model="roomName"
              type="text"
              placeholder="e.g. 11-502 (Multimedia Lab)"
              class="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spu-purple/30"
            />
          </div>
        </div>

        <!-- Printable Sticker Preview (This section is designed to be printed!) -->
        <div class="border-2 border-dashed border-slate-300 rounded-3xl p-6 bg-slate-50/50 flex flex-col items-center">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Live Sticker Print Preview (SPU Standard)</p>

          <div id="printable-sticker" class="w-72 bg-white rounded-2xl border-2 border-spu-purple shadow-lg p-5 text-center flex flex-col items-center space-y-3 relative overflow-hidden">
            <!-- Top SPU Brand Strip -->
            <div class="w-full spu-gradient-primary text-white py-1.5 px-3 rounded-lg flex items-center justify-between">
              <span class="text-[10px] font-extrabold tracking-wider">SRIPATUM UNIVERSITY</span>
              <span class="text-[9px] opacity-80">FACILITY FIX</span>
            </div>

            <!-- Room Headline -->
            <div>
              <span class="text-[10px] font-bold text-spu-pink uppercase tracking-wider">{{ selectedBuilding }} • Floor {{ selectedFloor }}</span>
              <h4 class="text-sm font-black text-slate-900 leading-tight mt-0.5">{{ roomName }}</h4>
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
              📷 Scan to Report or View Room History
            </div>

            <p class="text-[9px] text-slate-400">Scan using mobile camera or SPU Web Portal</p>
          </div>
        </div>

        <!-- Generated URL Display -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div class="truncate mr-3">
            <span class="font-bold text-slate-500">QR Target URL: </span>
            <span class="font-mono text-spu-purple text-[11px] truncate">{{ targetUrl }}</span>
          </div>
          <button 
            @click="copyUrl" 
            class="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] shrink-0"
          >
            Copy URL
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
          <span>Test Open This Room Hub</span>
        </button>

        <div class="flex items-center gap-2">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <button 
            type="button" 
            @click="printSticker"
            class="px-5 py-2.5 spu-gradient-primary text-white text-xs font-bold rounded-xl shadow-md shadow-spu-purple/20 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Printer class="w-4 h-4" />
            <span>Print QR Sticker</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { QrCode, X, Printer, ExternalLink } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])
const router = useRouter()

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
    alert('Target URL copied to clipboard!')
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
