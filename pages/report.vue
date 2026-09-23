<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 pb-20">
    <div class="max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-slate-100 flex flex-col">
      
      <!-- Header -->
      <header class="p-4 px-5 border-b border-slate-100 bg-white/95 sticky top-0 z-20 backdrop-blur-md">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-1.5 text-xs font-semibold text-spu-pink hover:text-spu-purple transition-colors">
            <ChevronLeft class="w-4 h-4" />
            <span>Back to Hub</span>
          </NuxtLink>

          <span class="text-xs font-bold text-slate-800">New Issue Form</span>

          <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-spu-purple to-spu-pink p-0.5">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Praew" 
              class="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <!-- Stepper Bar -->
        <div class="mt-3 flex items-center justify-between text-[11px] mb-1.5">
          <span class="font-extrabold text-slate-900 text-sm">Report an Issue</span>
          <span class="text-[10px] font-bold text-spu-pink bg-spu-pink-50 px-2 py-0.5 rounded-full">Step 1 of 2</span>
        </div>
        <!-- Progress Bar -->
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-spu-purple to-spu-pink w-1/2 rounded-full"></div>
        </div>
      </header>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmitReport" class="p-5 space-y-5 flex-1">
        
        <!-- Estimated Time Badge -->
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <span>SPU Campus Care Operations</span>
          <span class="flex items-center gap-1 text-slate-500 font-medium">
            <Clock class="w-3.5 h-3.5" /> Estimated: 1 min
          </span>
        </div>

        <!-- Auto-Detected Location Card -->
        <div class="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-2xl bg-spu-pink-100/70 text-spu-pink flex items-center justify-center shrink-0">
                <MapPin class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Auto-Detected Location</span>
                  <span class="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified QR
                  </span>
                </div>
                <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">{{ form.building }}, Floor {{ form.floor }}</h3>
                <p class="text-xs text-slate-500 font-medium">{{ form.room }}</p>
              </div>
            </div>

            <button 
              type="button" 
              @click="showLocationPicker = !showLocationPicker"
              class="text-xs font-bold text-spu-pink hover:underline"
            >
              Change
            </button>
          </div>

          <!-- Location Picker Dropdown (Expandable) -->
          <div v-if="showLocationPicker" class="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 animate-fade-in">
            <button 
              v-for="loc in locationPresets" 
              :key="loc.room"
              type="button"
              @click="selectLocationPreset(loc)"
              class="p-2 text-left bg-white border border-slate-200 rounded-xl hover:border-spu-purple text-[11px]"
            >
              <p class="font-bold text-slate-800">{{ loc.building }}</p>
              <p class="text-[10px] text-slate-400 truncate">{{ loc.room }}</p>
            </button>
          </div>
        </div>

        <!-- Issue Category Selector (Button Chips) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-900">
              Issue Category <span class="text-spu-pink">*</span>
            </label>
            <span class="text-[10px] text-slate-400">Select the type of facility problem</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <button 
              v-for="cat in categories" 
              :key="cat.name"
              type="button"
              @click="form.category = cat.name"
              class="p-3 rounded-2xl border text-left flex items-center justify-between transition-all group"
              :class="form.category === cat.name 
                ? 'bg-spu-purple text-white border-spu-purple shadow-md shadow-spu-purple/20' 
                : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="text-base">{{ cat.icon }}</span>
                <span class="text-xs font-bold truncate">{{ cat.name }}</span>
              </div>
              <div 
                v-if="form.category === cat.name" 
                class="w-4 h-4 rounded-full bg-spu-pink text-white flex items-center justify-center shrink-0"
              >
                <Check class="w-3 h-3 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>

        <!-- Urgency Level Segmented Toggle -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-900">Urgency Level</label>
            <span class="text-[10px] text-slate-400">Response SLA</span>
          </div>

          <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button 
              type="button"
              @click="form.urgency = 'Normal'"
              class="py-2.5 px-3 rounded-xl text-center transition-all flex flex-col items-center justify-center"
              :class="form.urgency === 'Normal' 
                ? 'bg-white text-slate-900 shadow font-bold' 
                : 'text-slate-500 hover:text-slate-700'"
            >
              <div class="flex items-center gap-1.5 text-xs font-bold">
                <span class="w-2 h-2 rounded-full bg-spu-purple"></span>
                <span>Normal</span>
              </div>
              <span class="text-[9px] text-slate-400 mt-0.5">Routine fix (~24-48h)</span>
            </button>

            <button 
              type="button"
              @click="form.urgency = 'Urgent'"
              class="py-2.5 px-3 rounded-xl text-center transition-all flex flex-col items-center justify-center"
              :class="form.urgency === 'Urgent' 
                ? 'bg-white text-spu-pink shadow font-bold ring-1 ring-spu-pink/30' 
                : 'text-slate-500 hover:text-slate-700'"
            >
              <div class="flex items-center gap-1.5 text-xs font-bold text-spu-pink">
                <span class="w-2 h-2 rounded-full bg-spu-pink"></span>
                <span>Urgent</span>
              </div>
              <span class="text-[9px] text-spu-pink/80 mt-0.5">Hazard, water leak, class halt</span>
            </button>
          </div>
        </div>

        <!-- Attach Photos or Video -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-900">Attach Photos or Video</label>
            <span class="text-[10px] text-slate-400">Max 3 files ({{ attachedPhotos.length }} attached)</span>
          </div>

          <div class="flex items-center gap-2.5 overflow-x-auto pb-1">
            <!-- Attached Photos Thumbnails -->
            <div 
              v-for="(photo, index) in attachedPhotos" 
              :key="index"
              class="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 group"
            >
              <img :src="photo" alt="Attached photo" class="w-full h-full object-cover" />
              <button 
                type="button"
                @click="removePhoto(index)"
                class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-spu-pink transition-colors"
              >
                <X class="w-3 h-3" />
              </button>
              <span class="absolute bottom-1 left-1 bg-spu-purple/80 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                Photo {{ index + 1 }}
              </span>
            </div>

            <!-- Add Photo Button -->
            <label 
              v-if="attachedPhotos.length < 3"
              class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 hover:border-spu-pink/60 bg-slate-50 hover:bg-spu-pink-50/20 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 text-slate-400 hover:text-spu-pink"
            >
              <Camera class="w-5 h-5 mb-1" />
              <span class="text-[10px] font-bold">+ Add Photo</span>
              <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
            </label>

            <!-- Pro Tip Note Box -->
            <div class="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 leading-snug flex-1 min-w-[150px]">
              <div class="flex items-center gap-1 font-bold text-slate-700 text-[10px] mb-0.5">
                <Sparkles class="w-3 h-3 text-spu-pink" />
                <span>Pro Tip</span>
              </div>
              Capturing room number stickers or barcodes speeds up repairs!
            </div>
          </div>
        </div>

        <!-- Describe the Issue -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-900">
              Describe the Issue <span class="text-spu-pink">*</span>
            </label>
            <span class="text-[10px] text-slate-400">{{ form.description.length }} / 500</span>
          </div>
          <textarea 
            v-model="form.description"
            rows="3"
            maxlength="500"
            required
            placeholder="Water leaking from AC vent onto computer desk 14. Loud humming vibration sound since 9:00 AM lecture started."
            class="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-spu-purple rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none shadow-xs"
          ></textarea>
        </div>

        <!-- Reporter Email -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-900">
            Student / Staff SPU Email <span class="text-spu-pink">*</span>
          </label>
          <div class="relative">
            <Mail class="w-4 h-4 text-spu-pink absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="form.reporter_email"
              type="email"
              required
              placeholder="praew.suk@spu.ac.th"
              class="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-spu-purple rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none transition-all shadow-xs"
            />
          </div>
          <p class="text-[10px] text-slate-400 flex items-center gap-1">
            <BellRing class="w-3 h-3 text-spu-purple shrink-0" />
            <span>SMS and email tracking updates are dispatched automatically at every milestone.</span>
          </p>
        </div>

        <!-- Submit Button -->
        <div class="pt-2 space-y-2">
          <button 
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-spu-purple via-spu-purple-700 to-spu-pink text-white font-extrabold text-sm shadow-xl shadow-spu-purple/30 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span>{{ isSubmitting ? 'Submitting Report...' : 'Submit Report ▷' }}</span>
          </button>

          <p class="text-[10px] text-center text-slate-400 font-medium flex items-center justify-center gap-1">
            <Zap class="w-3 h-3 text-spu-pink" />
            <span>SPU Facility Team resolves urgent lab tickets within ~30 mins.</span>
          </p>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Check, 
  Camera, 
  X, 
  Sparkles, 
  Mail, 
  BellRing, 
  Loader2, 
  Zap 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const showLocationPicker = ref(false)
const isSubmitting = ref(false)

const form = ref({
  building: 'Building 11',
  floor: '5',
  room: 'Room 11-502 (Multimedia Lab)',
  category: 'Air Conditioner',
  urgency: 'Urgent',
  description: 'Water leaking from AC vent onto computer desk 14. Loud humming vibration sound since 9:00 AM lecture started.',
  reporter_email: 'praew.suk@spu.ac.th',
  reporter_name: 'Praew Suksom'
})

const attachedPhotos = ref<string[]>([
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
])

const categories = [
  { name: 'Air Conditioner', icon: '❄️' },
  { name: 'Lights / Elec...', icon: '💡' },
  { name: 'Sanitary / Toilet', icon: '🚰' },
  { name: 'Desk & Chair', icon: '🪑' },
  { name: 'Projector / PC', icon: '📽️' },
  { name: 'Other Issue', icon: '🔧' }
]

const locationPresets = [
  { building: 'Building 11', floor: '5', room: 'Room 11-502 (Multimedia Lab)' },
  { building: 'Building 5', floor: '3', room: 'Room 5-301 (Smart Seminar Hall)' },
  { building: 'Central Library', floor: '3', room: '3rd Floor Quiet Zone' },
  { building: 'Building 9', floor: '4', room: 'Lab 9-401 (Robotics Prototyping)' }
]

function selectLocationPreset(preset: any) {
  form.value.building = preset.building
  form.value.floor = preset.floor
  form.value.room = preset.room
  showLocationPicker.value = false
}

function handlePhotoUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        attachedPhotos.value.push(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
}

function removePhoto(index: number) {
  attachedPhotos.value.splice(index, 1)
}

onMounted(() => {
  // Populate from query params if passed
  if (route.query.building) form.value.building = String(route.query.building)
  if (route.query.floor) form.value.floor = String(route.query.floor)
  if (route.query.room) form.value.room = String(route.query.room)
  if (route.query.category) form.value.category = String(route.query.category)
})

async function handleSubmitReport() {
  isSubmitting.value = true
  try {
    const payload = {
      ...form.value,
      image_before_url: attachedPhotos.value[0] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
    }

    const res = await $fetch<any>('/api/reports', {
      method: 'POST',
      body: payload
    })

    if (res.success) {
      router.push({
        path: '/tracking',
        query: { newId: res.data.id }
      })
    }
  } catch (err: any) {
    alert(`Submission failed: ${err.message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
