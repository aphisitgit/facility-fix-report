<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/85 backdrop-blur-md animate-fade-in">
    <div class="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92dvh]">
      
      <!-- Modal Header -->
      <div class="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-spu-purple text-white flex items-center justify-center shadow-xs">
            <Camera class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">SPU Live Camera Scanner</h3>
            <p class="text-[10px] text-slate-400">สแกน QR Code ประจำห้องด้วยกล้อง</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Switch Camera Button (if multiple cameras available) -->
          <button 
            v-if="availableCameras.length > 1 && cameraActive"
            @click="switchCamera"
            type="button"
            class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-1 text-[10px] font-bold"
            title="Switch Camera (สลับกล้อง)"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isSwitchingCamera }" />
            <span class="hidden sm:inline">สลับกล้อง</span>
          </button>

          <!-- Close Modal Button -->
          <button 
            @click="closeModal" 
            type="button"
            class="w-8 h-8 rounded-full bg-slate-200/80 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Real Camera Viewfinder Container -->
      <div class="relative bg-black aspect-square flex flex-col items-center justify-center overflow-hidden shrink-0">
        
        <!-- Live Video Mount Element for Html5Qrcode -->
        <div id="html5-qr-scanner-element" class="w-full h-full"></div>

        <!-- Scanning Reticle Overlay (Active when camera is running) -->
        <div 
          v-if="cameraActive && !scannedSuccess"
          class="pointer-events-none absolute inset-0 flex items-center justify-center p-8 z-10"
        >
          <div class="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl border-2 border-spu-pink shadow-glow-pink flex items-center justify-center">
            <!-- Animated Laser Scan Line -->
            <div class="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-spu-pink to-transparent animate-laser top-1/2"></div>
            
            <!-- Corner Brackets -->
            <div class="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-spu-pink rounded-tl-sm"></div>
            <div class="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-spu-pink rounded-tr-sm"></div>
            <div class="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-spu-pink rounded-bl-sm"></div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-spu-pink rounded-br-sm"></div>
          </div>
        </div>

        <!-- Camera Status Indicator Badge -->
        <div v-if="cameraActive && !scannedSuccess" class="absolute bottom-3 inset-x-4 bg-black/75 backdrop-blur-md rounded-xl py-1.5 px-3 text-center z-10">
          <span class="text-[11px] text-pink-300 font-bold flex items-center justify-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            กล้องกำลังทำงาน • นำ QR Code มาส่องในกรอบ
          </span>
        </div>

        <!-- Success Animation Overlay -->
        <div 
          v-if="scannedSuccess" 
          class="absolute inset-0 bg-emerald-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in z-20"
        >
          <div class="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/40 animate-bounce">
            <Check class="w-8 h-8 stroke-[3]" />
          </div>
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">สแกนพิกัดห้องสำเร็จ</span>
          <h4 class="text-lg font-black text-white mt-1">{{ scannedSuccess.room }}</h4>
          <p class="text-xs text-emerald-200 mt-0.5">{{ scannedSuccess.building }} • ชั้น {{ scannedSuccess.floor }}</p>
          <p class="text-[10px] text-emerald-300/80 mt-3 animate-pulse">กำลังนำทางไปยังประวัติห้อง...</p>
        </div>

        <!-- Loading / Camera Requesting State -->
        <div 
          v-else-if="isStartingCamera" 
          class="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-10"
        >
          <Loader2 class="w-10 h-10 text-spu-pink animate-spin" />
          <p class="text-xs font-bold text-slate-100">กำลังเชื่อมต่อกล้อง...</p>
          <p class="text-[11px] text-slate-400">กรุณากด "อนุญาต (Allow)" บนหน้าจอเบราว์เซอร์หากมีข้อความแจ้งเตือน</p>
        </div>

        <!-- Camera Error / Permission Notice Overlay -->
        <div 
          v-else-if="cameraError" 
          class="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-5 text-center text-white space-y-3 z-10"
        >
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <AlertCircle class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-xs font-bold text-amber-300">แจ้งเตือนการเข้าถึงกล้อง</h4>
            <p class="text-[11px] text-slate-300 mt-1 max-w-xs leading-relaxed">{{ cameraError }}</p>
          </div>

          <div class="flex flex-col gap-2 w-full max-w-xs pt-1">
            <!-- Retry Button -->
            <button 
              @click="startCamera"
              type="button"
              class="w-full py-2.5 px-4 spu-gradient-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Camera class="w-4 h-4" />
              <span>ลองเปิดกล้องอีกครั้ง</span>
            </button>

            <!-- Native Phone Camera Capture Fallback (Works on mobile browsers even if WebRTC is blocked) -->
            <label class="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5">
              <Camera class="w-3.5 h-3.5 text-spu-pink" />
              <span>ถ่ายภาพสแกนด้วยกล้องมือถือ</span>
              <input type="file" accept="image/*" capture="environment" class="hidden" @change="handleFileUploadScan" />
            </label>
          </div>
        </div>

      </div>

      <!-- Controls & Quick Navigation -->
      <div class="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3 shrink-0">
        <!-- Direct Mobile Snap Button & Prominent Manual Coordinate Button -->
        <div class="flex items-center justify-between gap-2 text-xs">
          <label class="text-xs font-bold text-slate-700 hover:text-spu-purple flex items-center gap-1.5 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200/90 shadow-xs transition-colors shrink-0">
            <Camera class="w-4 h-4 text-spu-pink" />
            <span class="text-[11px] sm:text-xs">ถ่ายรูปผ่านกล้อง</span>
            <input type="file" accept="image/*" capture="environment" class="hidden" @change="handleFileUploadScan" />
          </label>

          <!-- Prominent 'กรอกพิกัดเอง' Button -->
          <button 
            @click="openEmptyForm"
            type="button"
            class="py-2 px-3.5 bg-gradient-to-r from-spu-purple to-spu-pink text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-spu-purple/25 hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            title="ระบุพิกัดห้องด้วยตนเอง"
          >
            <Edit3 class="w-3.5 h-3.5" />
            <span>กรอกพิกัดเอง</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Dedicated High-Visibility Manual Coordinate Card Banner -->
        <button 
          @click="openEmptyForm"
          type="button"
          class="w-full py-2.5 px-3.5 bg-white hover:bg-spu-purple-50/50 border-2 border-spu-purple/30 hover:border-spu-purple rounded-2xl flex items-center justify-between transition-all group shadow-xs text-left"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-spu-purple/10 text-spu-purple group-hover:bg-spu-purple group-hover:text-white flex items-center justify-center transition-colors shrink-0">
              <MapPin class="w-4 h-4" />
            </div>
            <div>
              <p class="text-xs font-extrabold text-slate-900 group-hover:text-spu-purple transition-colors">
                ไม่มี QR Code ประจำห้อง?
              </p>
              <p class="text-[11px] text-slate-500">
                แตะเพื่อ <strong class="text-spu-pink font-bold">พิมพ์ระบุพิกัดอาคารและห้องเอง</strong>
              </p>
            </div>
          </div>
          <span class="text-xs font-black text-spu-purple bg-spu-purple/10 group-hover:bg-spu-purple group-hover:text-white px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1 shrink-0">
            <span>ระบุพิกัด</span>
            <ArrowRight class="w-3 h-3" />
          </span>
        </button>

        <!-- Collapsible Developer / Quick Preset Test Drawer -->
        <details class="text-[10px] text-slate-400 bg-white rounded-xl border border-slate-200/80 p-2 group">
          <summary class="font-bold text-slate-600 cursor-pointer select-none flex items-center justify-between">
            <span>⚙️ สำหรับทดสอบระบบ (เลือกห้องจำลอง)</span>
            <span class="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="grid grid-cols-2 gap-1.5 pt-2 mt-1 border-t border-slate-100">
            <button 
              v-for="preset in presets" 
              :key="preset.room"
              @click="selectPreset(preset)"
              type="button"
              class="p-1.5 bg-slate-50 hover:bg-spu-purple-50 hover:text-spu-purple rounded-lg border border-slate-200 text-left font-medium transition-all"
            >
              <p class="font-bold text-slate-800 truncate">{{ langStore.translateBuilding(preset.building) }} • {{ langStore.translateFloor(preset.floor) }}</p>
              <p class="text-[9px] text-slate-500 truncate">{{ langStore.translateRoom(preset.room) }}</p>
            </button>
          </div>
        </details>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { Camera, X, Check, Loader2, AlertCircle, RefreshCw, Edit3, ArrowRight, MapPin } from 'lucide-vue-next'
import { Html5Qrcode } from 'html5-qrcode'
import { useScannedRoom } from '~/composables/useScannedRoom'
import { useAppLang } from '~/composables/useAppLang'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'scanned'])
const router = useRouter()
const { setScannedRoom } = useScannedRoom()
const langStore = useAppLang()

let html5QrCode: Html5Qrcode | null = null
const isStartingCamera = ref(false)
const cameraActive = ref(false)
const cameraError = ref<string | null>(null)
const scannedSuccess = ref<{ building: string; floor: string; room: string } | null>(null)
const availableCameras = ref<Array<{ id: string; label: string }>>([])
const currentCameraIndex = ref(0)
const isSwitchingCamera = ref(false)

const presets = [
  { building: 'Building 11', floor: '5', room: '11-502 (Multimedia Lab)' },
  { building: 'Building 5', floor: '3', room: '5-301 (Smart Seminar Hall)' },
  { building: 'Central Library', floor: '3', room: '3rd Floor Quiet Zone' },
  { building: 'Building 9', floor: '4', room: 'Lab 9-401 (Robotics Lab)' }
]

function closeModal() {
  stopCamera()
  emit('close')
}

function openEmptyForm() {
  closeModal()
  router.push('/report?manual=true')
}

// Synthesized audio chime upon successful scan
function playSuccessBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15) // E6
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  } catch (e) {
    // Audio gesture restriction fallback
  }
}

// Parse scanned QR code text or URL
function parseQrText(decodedText: string): { building: string; floor: string; room: string } {
  try {
    if (decodedText.includes('?') && decodedText.includes('room=')) {
      const url = new URL(decodedText, window.location.origin)
      const b = url.searchParams.get('building') || 'Building 11'
      const f = url.searchParams.get('floor') || '1'
      const r = url.searchParams.get('room') || 'Campus Room'
      return { building: b, floor: f, room: r }
    }
    
    if (decodedText.startsWith('SPU:')) {
      const parts = decodedText.split(':')
      return {
        building: parts[1] || 'Building 11',
        floor: parts[2] || '1',
        room: parts[3] || 'Campus Room'
      }
    }
  } catch (e) {
    // Fall through
  }

  return {
    building: 'Building 11',
    floor: '1',
    room: decodedText.slice(0, 30)
  }
}

async function handleScannedResult(decodedText: string) {
  if (scannedSuccess.value) return // Prevent multiple firings

  const roomData = parseQrText(decodedText)
  scannedSuccess.value = roomData
  playSuccessBeep()

  // Save into composable & localStorage
  setScannedRoom(roomData.building, roomData.floor, roomData.room)
  emit('scanned', roomData)

  // Stop camera feed
  await stopCamera()

  // Brief celebration delay then navigate to tracking
  setTimeout(() => {
    closeModal()
    router.push({
      path: '/tracking',
      query: {
        building: roomData.building,
        floor: roomData.floor,
        room: roomData.room
      }
    })
  }, 1000)
}

async function startCamera() {
  await nextTick()
  // Wait a small delay to ensure DOM is painted and has dimensions
  await new Promise(r => setTimeout(r, 120))

  const mountEl = document.getElementById('html5-qr-scanner-element')
  if (!mountEl) return

  isStartingCamera.value = true
  cameraError.value = null
  cameraActive.value = false

  try {
    // 1. Proactively test getUserMedia to trigger the browser's native permission prompt
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(t => t.stop())
      } catch (permErr: any) {
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          throw new Error('กรุณากด "อนุญาต (Allow)" ในเบราว์เซอร์ เพื่อให้ระบบเปิดกล้องสแกนได้')
        }
      }
    }

    // 2. Clean up any existing Html5Qrcode instance
    if (html5QrCode) {
      try {
        if (html5QrCode.isScanning) {
          await html5QrCode.stop()
        }
        await html5QrCode.clear()
      } catch (e) {}
      html5QrCode = null
    }

    html5QrCode = new Html5Qrcode('html5-qr-scanner-element')

    // 3. Query all available video cameras
    let cameras: Array<{ id: string; label: string }> = []
    try {
      cameras = await Html5Qrcode.getCameras()
      availableCameras.value = cameras
    } catch (e) {
      console.warn('getCameras error:', e)
    }

    const config = {
      fps: 20,
      qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight)
        const qrboxEdge = Math.max(180, Math.floor(minEdge * 0.72))
        return {
          width: qrboxEdge,
          height: qrboxEdge
        }
      },
      aspectRatio: 1.0
    }

    // 4. Select the best camera:
    // If multiple cameras exist (mobile phone), prioritize back/rear camera.
    // If desktop/laptop, use the primary webcam id.
    let targetCameraIdOrConfig: any = null
    if (cameras && cameras.length > 0) {
      const backCamIndex = cameras.findIndex(c => 
        c.label.toLowerCase().includes('back') || 
        c.label.toLowerCase().includes('rear') || 
        c.label.toLowerCase().includes('environment') ||
        c.label.toLowerCase().includes('0, facing back')
      )

      if (backCamIndex >= 0) {
        currentCameraIndex.value = backCamIndex
        targetCameraIdOrConfig = cameras[backCamIndex].id
      } else {
        currentCameraIndex.value = 0
        targetCameraIdOrConfig = cameras[0].id
      }
    }

    // 5. Start camera with multi-tier graceful fallback
    let started = false

    // Strategy 1: Specific camera ID from device list
    if (targetCameraIdOrConfig) {
      try {
        await html5QrCode.start(
          targetCameraIdOrConfig,
          config,
          (decodedText) => handleScannedResult(decodedText),
          () => {}
        )
        started = true
        cameraActive.value = true
      } catch (e1) {
        console.warn('Strategy 1 (Specific Camera ID) failed:', e1)
      }
    }

    // Strategy 2: facingMode with ideal environment (not strict!)
    if (!started) {
      try {
        await html5QrCode.start(
          { facingMode: { ideal: 'environment' } },
          config,
          (decodedText) => handleScannedResult(decodedText),
          () => {}
        )
        started = true
        cameraActive.value = true
      } catch (e2) {
        console.warn('Strategy 2 (ideal environment) failed:', e2)
      }
    }

    // Strategy 3: user camera / webcam
    if (!started) {
      try {
        await html5QrCode.start(
          { facingMode: 'user' },
          config,
          (decodedText) => handleScannedResult(decodedText),
          () => {}
        )
        started = true
        cameraActive.value = true
      } catch (e3) {
        console.warn('Strategy 3 (user webcam) failed:', e3)
      }
    }

    // Strategy 4: fallback to first camera device
    if (!started && cameras && cameras.length > 0) {
      try {
        await html5QrCode.start(
          cameras[0].id,
          config,
          (decodedText) => handleScannedResult(decodedText),
          () => {}
        )
        started = true
        cameraActive.value = true
      } catch (e4) {
        console.warn('Strategy 4 (cameras[0]) failed:', e4)
      }
    }

    if (!started) {
      throw new Error('ไม่สามารถเชื่อมต่อกล้องได้ หรืออุปกรณ์ไม่รองรับการสตรีมวิดีโอสดในเบราว์เซอร์นี้')
    }

  } catch (err: any) {
    console.error('Camera startup failed:', err)
    cameraError.value = err.message || 'ไม่สามารถเปิดกล้องได้ กรุณากดปุ่มเปิดกล้องอีกครั้ง หรืออนุญาตการเข้าถึงกล้อง'
    cameraActive.value = false
  } finally {
    isStartingCamera.value = false
  }
}

async function switchCamera() {
  if (availableCameras.value.length < 2 || !html5QrCode) return
  isSwitchingCamera.value = true

  try {
    currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length
    const nextCamera = availableCameras.value[currentCameraIndex.value]

    if (html5QrCode.isScanning) {
      await html5QrCode.stop()
    }

    const config = {
      fps: 20,
      qrbox: { width: 220, height: 220 },
      aspectRatio: 1.0
    }

    await html5QrCode.start(
      nextCamera.id,
      config,
      (decodedText) => handleScannedResult(decodedText),
      () => {}
    )
    cameraActive.value = true
  } catch (e) {
    console.error('Failed to switch camera:', e)
  } finally {
    isSwitchingCamera.value = false
  }
}

async function stopCamera() {
  if (html5QrCode) {
    try {
      if (html5QrCode.isScanning) {
        await html5QrCode.stop()
      }
      await html5QrCode.clear()
    } catch (e) {
      // Ignore cleanup error
    }
    html5QrCode = null
    cameraActive.value = false
  }
}

async function handleFileUploadScan(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]

  try {
    isStartingCamera.value = true
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode('html5-qr-scanner-element')
    }
    const result = await html5QrCode.scanFile(file, true)
    handleScannedResult(result)
  } catch (err) {
    alert('ไม่สามารถอ่าน QR Code จากภาพถ่ายนี้ได้ กรุณาลองถ่ายใหม่อีกครั้งให้ภาพชัดเจน')
  } finally {
    isStartingCamera.value = false
  }
}

function selectPreset(preset: { building: string; floor: string; room: string }) {
  setScannedRoom(preset.building, preset.floor, preset.room)
  emit('scanned', preset)
  closeModal()
  router.push({
    path: '/tracking',
    query: {
      building: preset.building,
      floor: preset.floor,
      room: preset.room
    }
  })
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      scannedSuccess.value = null
      cameraError.value = null
      startCamera()
    } else {
      stopCamera()
    }
  }
)

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
:deep(#html5-qr-scanner-element) {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  border: none !important;
}

:deep(#html5-qr-scanner-element video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

:deep(#html5-qr-scanner-element img) {
  display: none !important;
}

@keyframes laser {
  0% {
    top: 15%;
    opacity: 0.8;
  }
  50% {
    top: 85%;
    opacity: 1;
  }
  100% {
    top: 15%;
    opacity: 0.8;
  }
}

.animate-laser {
  animation: laser 2.2s infinite ease-in-out;
}
</style>
