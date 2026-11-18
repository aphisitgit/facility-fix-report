<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 pb-20 md:pb-12">
    <!-- Responsive Main Wrapper -->
    <div class="w-full max-w-md sm:max-w-xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto min-h-screen bg-white md:shadow-lg md:rounded-3xl md:my-6 md:border md:border-slate-200/80 flex flex-col overflow-hidden">
      
      <!-- Header -->
      <header class="p-4 px-5 sm:px-6 lg:px-8 border-b border-slate-100 bg-white/95 sticky top-0 z-20 backdrop-blur-md">
        <div class="relative flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-1.5 text-xs font-semibold text-spu-pink hover:text-spu-purple transition-colors z-10">
            <ChevronLeft class="w-4 h-4" />
            <span>{{ langStore.t('backToHome') }}</span>
          </NuxtLink>

          <!-- Truly Centered Header Title -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="flex items-center gap-2 pointer-events-auto">
              <div class="w-6 h-6 rounded-lg bg-spu-purple text-white flex items-center justify-center font-extrabold text-[10px]">SPU</div>
              <span class="text-xs sm:text-sm font-bold text-slate-800">{{ langStore.t('newIssueForm') }}</span>
            </div>
          </div>

          <!-- Language Switcher on Right -->
          <div class="z-10 flex items-center justify-end">
            <LanguageSwitcher />
          </div>
        </div>

        <!-- Stepper Bar -->
        <div class="mt-3 flex items-center justify-between text-[11px] mb-1.5">
          <span class="font-extrabold text-slate-900 text-sm">{{ langStore.t('formHeader') }}</span>
          <span class="text-[10px] font-bold text-spu-pink bg-spu-pink-50 px-2 py-0.5 rounded-full">{{ langStore.t('step1of2') }}</span>
        </div>
        <!-- Progress Bar -->
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-spu-purple to-spu-pink w-1/2 rounded-full"></div>
        </div>
      </header>

      <!-- Form Content (Responsive 2-column on iPad/Desktop) -->
      <form @submit.prevent="handleSubmitReport" class="p-4 sm:p-6 lg:p-8 flex-1">
        
        <!-- Estimated Time Badge -->
        <div class="flex items-center justify-between text-[11px] text-slate-400 mb-5">
          <span class="font-bold text-slate-600">Facility Fix & Report</span>
          <span class="flex items-center gap-1 text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
            <Clock class="w-3.5 h-3.5 text-spu-pink" /> {{ langStore.t('estTime') }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <!-- LEFT COLUMN (Location & Media & Urgency) -->
          <div class="md:col-span-5 space-y-6">
            
            <!-- Location Card (Auto-Detected / Manual Typed / Blank) -->
            <div 
              class="p-4 sm:p-5 rounded-3xl bg-slate-50 border shadow-xs relative overflow-hidden transition-all"
              :class="!hasLocation ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20' : 'border-slate-200/90'"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-start gap-3 min-w-0 flex-1 pr-1">
                  <div 
                    class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    :class="!hasLocation ? 'bg-amber-100 text-amber-600' : 'bg-spu-pink-100/70 text-spu-pink'"
                  >
                    <MapPin class="w-5 h-5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <template v-if="hasLocation">
                        <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          {{ isManualLocation ? langStore.t('manualLocation') : langStore.t('autoLocation') }}
                        </span>
                        <span 
                          v-if="isVerifiedLocation" 
                          class="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                        >
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {{ langStore.t('verifiedQrBadge') }}
                        </span>
                        <span 
                          v-else 
                          class="text-[9px] font-bold text-spu-purple bg-spu-purple-50 border border-spu-purple/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                        >
                          <Edit3 class="w-3 h-3 text-spu-pink" /> {{ langStore.t('locationSetBadge') }}
                        </span>
                      </template>
                      <template v-else>
                        <span class="text-[9px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <AlertCircle class="w-3 h-3" /> {{ langStore.t('noLocationBadge') }}
                        </span>
                      </template>
                    </div>

                    <h3 v-if="hasLocation" class="text-sm sm:text-base font-extrabold text-slate-900 mt-1 break-words">
                      {{ form.building }}, {{ langStore.currentLang.value === 'en' ? `Floor ${form.floor || '1'}` : `ชั้น ${form.floor || '1'}` }}
                    </h3>
                    <h3 v-else class="text-sm sm:text-base font-extrabold text-slate-700 mt-1 break-words">
                      {{ langStore.t('pleaseSpecifyLocation') }}
                    </h3>

                    <p v-if="hasLocation" class="text-xs text-slate-500 font-medium break-words mt-0.5">
                      {{ form.room }}
                    </p>
                    <p v-else class="text-xs text-rose-600 font-medium break-words mt-0.5">
                      {{ langStore.t('selectRecommendedOrType') }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0 pt-0.5">
                  <button 
                    type="button" 
                    @click="showLocationPicker = true; locationTab = 'MANUAL'"
                    class="text-[11px] font-extrabold text-spu-purple bg-spu-purple/10 hover:bg-spu-purple hover:text-white px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shadow-2xs whitespace-nowrap"
                    :title="langStore.t('typeCustomLocation')"
                  >
                    <Edit3 class="w-3 h-3 text-spu-pink" />
                    <span class="hidden sm:inline">{{ langStore.t('typeCustomLocation') }}</span>
                  </button>

                  <button 
                    v-if="hasLocation"
                    type="button" 
                    @click="showLocationPicker = !showLocationPicker"
                    class="text-xs font-bold text-spu-pink hover:underline px-1 py-1 whitespace-nowrap"
                  >
                    {{ showLocationPicker ? langStore.t('hideLocationPicker') : langStore.t('changeLocationBtn') }}
                  </button>
                </div>
              </div>

              <!-- Location Picker Dropdown & Custom Typing Form (Expandable) -->
              <div v-if="showLocationPicker" class="mt-3.5 pt-3.5 border-t border-slate-200 space-y-3 animate-fade-in">
                
                <!-- Mode Switcher Tabs -->
                <div class="flex items-center p-1 bg-slate-200/70 rounded-xl gap-1 text-xs">
                  <button 
                    type="button"
                    @click="locationTab = 'PRESET'"
                    class="flex-1 py-1.5 font-bold rounded-lg transition-all text-center"
                    :class="locationTab === 'PRESET' ? 'bg-white text-spu-purple shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  >
                    {{ langStore.t('recommendedRoomsTab') }}
                  </button>
                  <button 
                    type="button"
                    @click="locationTab = 'MANUAL'"
                    class="flex-1 py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                    :class="locationTab === 'MANUAL' ? 'bg-white text-spu-purple shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  >
                    <Edit3 class="w-3.5 h-3.5 text-spu-pink" />
                    <span>{{ langStore.t('typeLocationTab') }}</span>
                  </button>
                </div>

                <!-- Tab 1: Preset Buttons -->
                <div v-if="locationTab === 'PRESET'" class="grid grid-cols-2 gap-2">
                  <button 
                    v-for="loc in locationPresets" 
                    :key="loc.room"
                    type="button"
                    @click="selectLocationPreset(loc)"
                    class="p-2.5 text-left bg-white border border-slate-200 rounded-2xl hover:border-spu-purple text-[11px] transition-all shadow-xs"
                    :class="(form.building === loc.building && form.room === loc.room && !isManualLocation) ? 'border-spu-purple ring-2 ring-spu-purple/20 bg-spu-purple-50/20' : ''"
                  >
                    <p class="font-bold text-slate-800">{{ loc.building }}</p>
                    <p class="text-[10px] text-slate-400 truncate">{{ loc.room }}</p>
                  </button>
                </div>

                <!-- Tab 2: Manual Typing Inputs -->
                <div v-else class="space-y-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Edit3 class="w-3.5 h-3.5 text-spu-pink" />
                      <span>{{ langStore.t('typeLocationTab') }}</span>
                    </span>
                  </div>

                  <!-- Building Input -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      {{ langStore.t('buildingLabel') }} <span class="text-spu-pink">*</span>
                    </label>
                    <input 
                      v-model="form.building"
                      type="text"
                      required
                      :placeholder="langStore.t('buildingPlaceholder')"
                      class="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-spu-purple rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                      @input="isManualLocation = true"
                    />

                    <!-- Quick Building Suggestion Chips -->
                    <div class="mt-1.5 flex flex-wrap gap-1">
                      <button 
                        v-for="b in suggestedBuildingsList" 
                        :key="b.value"
                        type="button"
                        @click="form.building = b.label; isManualLocation = true"
                        class="text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-spu-purple-50 hover:text-spu-purple hover:border-spu-purple/40 font-medium transition-colors"
                      >
                        {{ b.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Floor & Room Inputs -->
                  <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-1">
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">
                        {{ langStore.t('floorLabel') }} <span class="text-spu-pink">*</span>
                      </label>
                      <input 
                        v-model="form.floor"
                        type="text"
                        required
                        :placeholder="langStore.t('floorPlaceholder')"
                        class="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-spu-purple rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                        @input="isManualLocation = true"
                      />
                    </div>

                    <div class="col-span-2">
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">
                        {{ langStore.t('roomLabel') }} <span class="text-spu-pink">*</span>
                      </label>
                      <input 
                        v-model="form.room"
                        type="text"
                        required
                        :placeholder="langStore.t('roomPlaceholder')"
                        class="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-spu-purple rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                        @input="isManualLocation = true"
                      />
                    </div>
                  </div>

                  <!-- Confirm Button -->
                  <button 
                    type="button"
                    @click="confirmManualLocation"
                    class="w-full py-2 bg-spu-purple hover:bg-spu-purple/90 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check class="w-3.5 h-3.5" />
                    <span>{{ langStore.t('confirmManualLocationBtn') }}</span>
                  </button>
                </div>

              </div>
            </div>

            <!-- Attach Photos or Video -->
            <div class="space-y-2 p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-900">{{ langStore.t('attachPhotoLabel') }}</label>
                <span class="text-[10px] text-slate-400">{{ langStore.t('photoCountMax', { count: attachedPhotos.length }) }}</span>
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
                    #{{ index + 1 }}
                  </span>
                </div>

                <!-- Camera Button -->
                <label 
                  v-if="attachedPhotos.length < 3"
                  class="w-20 h-20 rounded-2xl border-2 border-dashed border-spu-pink/50 hover:border-spu-pink bg-spu-pink-50/40 hover:bg-spu-pink-50/70 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 text-spu-pink"
                  :title="langStore.t('takePhotoBtn')"
                >
                  <Camera class="w-5 h-5 mb-0.5" />
                  <span class="text-[10px] font-bold">{{ langStore.t('takePhotoBtn') }}</span>
                  <input type="file" accept="image/*" capture="environment" class="hidden" @change="handlePhotoUpload" />
                </label>

                <!-- Gallery Upload Button -->
                <label 
                  v-if="attachedPhotos.length < 3"
                  class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 hover:border-spu-purple/60 bg-slate-50 hover:bg-spu-purple-50/20 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 text-slate-400 hover:text-spu-purple"
                  :title="langStore.t('galleryBtn')"
                >
                  <Upload class="w-5 h-5 mb-0.5" />
                  <span class="text-[10px] font-bold">{{ langStore.t('galleryBtn') }}</span>
                  <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
                </label>

                <!-- Pro Tip Note Box -->
                <div class="p-3 bg-white border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 leading-snug flex-1 min-w-[150px]">
                  <div class="flex items-center gap-1 font-bold text-slate-700 text-[10px] mb-0.5">
                    <Sparkles class="w-3 h-3 text-spu-pink" />
                    <span>{{ langStore.t('proTipTitle') }}</span>
                  </div>
                  {{ langStore.t('proTipDesc') }}
                </div>
              </div>
            </div>

            <!-- Urgency Level Segmented Toggle -->
            <div class="space-y-1.5 p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-900">{{ langStore.t('urgencySection') }}</label>
                <span class="text-[10px] text-slate-400">{{ langStore.t('urgencyDurationLabel') }}</span>
              </div>

              <div class="grid grid-cols-2 gap-2 bg-slate-200/60 p-1.5 rounded-2xl">
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
                    <span>{{ langStore.t('urgencyNormalTitle') }}</span>
                  </div>
                  <span class="text-[9px] text-slate-400 mt-0.5 leading-tight break-words text-center">{{ langStore.t('urgencyNormalDesc') }}</span>
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
                    <span>{{ langStore.t('urgencyUrgentTitle') }}</span>
                  </div>
                  <span class="text-[9px] text-spu-pink/80 mt-0.5 leading-tight break-words text-center">{{ langStore.t('urgencyUrgentDesc') }}</span>
                </button>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (Category, Details, Email, Submit) -->
          <div class="md:col-span-7 space-y-6 bg-slate-50 md:bg-white md:p-6 lg:p-8 md:rounded-3xl md:border md:border-slate-200/90 md:shadow-xs">

            <!-- Issue Category Selector (Button Chips) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-900">
                  {{ langStore.t('categorySection') }} <span class="text-spu-pink">*</span>
                </label>
                <span class="text-[10px] text-slate-400">{{ langStore.t('categorySectionSubtitle') }}</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                <button 
                  v-for="cat in categories" 
                  :key="cat.name"
                  type="button"
                  @click="form.category = cat.name"
                  class="p-3 sm:p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group shadow-xs"
                  :class="form.category === cat.name 
                    ? 'bg-spu-purple text-white border-spu-purple shadow-md shadow-spu-purple/20' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="text-lg">{{ cat.icon }}</span>
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

            <!-- Describe the Issue -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-900">
                  {{ langStore.t('descSection') }} <span class="text-spu-pink">*</span>
                </label>
                <span class="text-[10px] text-slate-400">{{ form.description.length }} / 500</span>
              </div>
              <textarea 
                v-model="form.description"
                rows="4"
                maxlength="500"
                required
                :placeholder="langStore.t('descPlaceholder')"
                class="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-spu-purple rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none shadow-xs"
              ></textarea>
            </div>

            <!-- Reporter Email -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-900">
                {{ langStore.t('reporterEmail') }} <span class="text-spu-pink">*</span>
              </label>
              <div class="relative">
                <Mail class="w-4 h-4 text-spu-pink absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  v-model="form.reporter_email"
                  type="email"
                  required
                  placeholder="student65@spu.ac.th"
                  class="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-spu-purple rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                />
              </div>
              <p class="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                <BellRing class="w-3 h-3 text-spu-purple shrink-0" />
                <span>{{ langStore.t('reporterEmailHint') }}</span>
              </p>
            </div>

            <!-- Submit Button -->
            <div class="pt-2 space-y-2.5">
              <button 
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-spu-purple via-spu-purple-700 to-spu-pink text-white font-extrabold text-sm shadow-xl shadow-spu-purple/30 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                <span>{{ isSubmitting ? langStore.t('submittingBtn') : (langStore.currentLang.value === 'en' ? 'Submit Maintenance Report ▷' : 'ส่งข้อมูลแจ้งซ่อม ▷') }}</span>
              </button>

              <p class="text-[10px] text-center text-slate-400 font-medium flex items-center justify-center gap-1">
                <Zap class="w-3 h-3 text-spu-pink" />
                <span>ทีมช่างฝ่ายอาคารและสถานที่พร้อมเข้าตรวจสอบเหตุเร่งด่วนภายใน ~30 นาที</span>
              </p>
            </div>

          </div>

        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  Zap, 
  Upload, 
  Edit3,
  AlertCircle
} from 'lucide-vue-next'

import { useScannedRoom } from '~/composables/useScannedRoom'
import { useAppLang } from '~/composables/useAppLang'

const route = useRoute()
const router = useRouter()
const langStore = useAppLang()
const { currentBuilding, currentFloor, currentRoom, initRoom, setScannedRoom } = useScannedRoom()

const showLocationPicker = ref(false)
const locationTab = ref<'PRESET' | 'MANUAL'>('PRESET')
const isManualLocation = ref(false)
const isVerifiedLocation = ref(false)
const isSubmitting = ref(false)

const form = ref({
  building: '',
  floor: '',
  room: '',
  category: 'เครื่องปรับอากาศ',
  urgency: 'Urgent',
  description: '',
  reporter_email: 'praew.suk@spu.ac.th',
  reporter_name: 'Praew Suksom'
})

const hasLocation = computed(() => !!(form.value.building?.trim() && form.value.room?.trim()))

const attachedPhotos = ref<string[]>([])

const categories = computed(() => [
  { name: langStore.t('catAir'), icon: '❄️' },
  { name: langStore.t('catElectric'), icon: '💡' },
  { name: langStore.t('catPlumbing'), icon: '🚰' },
  { name: langStore.t('catFurniture'), icon: '🪑' },
  { name: langStore.t('catAv'), icon: '📽️' },
  { name: langStore.t('catOther'), icon: '🔧' }
])

const suggestedBuildingsList = computed(() => {
  const isEn = langStore.currentLang.value === 'en'
  return [
    { value: 'Building 11', label: isEn ? 'Building 11' : 'อาคาร 11' },
    { value: 'Building 5', label: isEn ? 'Building 5' : 'อาคาร 5' },
    { value: 'Building 9', label: isEn ? 'Building 9' : 'อาคาร 9' },
    { value: 'Building 1', label: isEn ? 'Building 1' : 'อาคาร 1' },
    { value: 'Central Library', label: isEn ? 'Central Library' : 'หอสมุดกลาง' },
    { value: 'Cafeteria', label: isEn ? 'Cafeteria' : 'โรงอาหาร' }
  ]
})

const locationPresets = computed(() => [
  { building: langStore.translateBuilding('Building 11'), floor: '5', room: langStore.translateRoom('11-502 (Multimedia Lab)') },
  { building: langStore.translateBuilding('Building 5'), floor: '3', room: langStore.translateRoom('5-301 (Smart Seminar Hall)') },
  { building: langStore.translateBuilding('Central Library'), floor: '3', room: langStore.translateRoom('Quiet Reading Zone, 3rd Floor') },
  { building: langStore.translateBuilding('Building 9'), floor: '4', room: langStore.translateRoom('Lab 9-401 (Robotics Lab)') }
])

function selectLocationPreset(preset: any) {
  form.value.building = preset.building
  form.value.floor = preset.floor
  form.value.room = preset.room
  isManualLocation.value = false
  isVerifiedLocation.value = false
  showLocationPicker.value = false
}

function confirmManualLocation() {
  if (!form.value.building.trim() || !form.value.room.trim()) {
    alert('กรุณากรอกอาคารและห้องให้ครบถ้วน')
    return
  }
  isManualLocation.value = true
  isVerifiedLocation.value = false
  showLocationPicker.value = false
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 1200
        let { width, height } = img
        if (width > height && width > MAX) {
          height = Math.round((height * MAX) / width)
          width = MAX
        } else if (height > MAX) {
          width = Math.round((width * MAX) / height)
          height = MAX
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handlePhotoUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    try {
      const compressed = await compressImage(file)
      attachedPhotos.value.push(compressed)
    } catch {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          attachedPhotos.value.push(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

function removePhoto(index: number) {
  attachedPhotos.value.splice(index, 1)
}

onMounted(() => {
  initRoom()
  
  if (route.query.manual === 'true') {
    isManualLocation.value = true
    locationTab.value = 'MANUAL'
    showLocationPicker.value = true
    form.value.building = ''
    form.value.floor = ''
    form.value.room = ''
    isVerifiedLocation.value = false
  } else if (route.query.room) {
    // Explicit query params passed (e.g. from scanned room hub)
    form.value.building = String(route.query.building || '')
    form.value.floor = String(route.query.floor || '1')
    form.value.room = String(route.query.room || '')
    isManualLocation.value = false
    isVerifiedLocation.value = true
    showLocationPicker.value = false
  } else {
    // User opened form without scanning room (e.g. clicked Category from Home)
    // Start COMPLETELY EMPTY as requested: user must select or type location!
    form.value.building = ''
    form.value.floor = ''
    form.value.room = ''
    isManualLocation.value = false
    isVerifiedLocation.value = false
    showLocationPicker.value = true
    locationTab.value = 'PRESET'
  }

  if (route.query.category) {
    const rawCat = String(route.query.category).toLowerCase()
    const matched = categories.find(c => 
      c.name.toLowerCase() === rawCat || 
      (rawCat.includes('air') && c.name.includes('ปรับอากาศ')) ||
      (rawCat.includes('elec') && c.name.includes('ไฟฟ้า')) ||
      (rawCat.includes('light') && c.name.includes('ไฟฟ้า')) ||
      (rawCat.includes('sanitary') && c.name.includes('สุขภัณฑ์')) ||
      (rawCat.includes('toilet') && c.name.includes('สุขภัณฑ์')) ||
      (rawCat.includes('desk') && c.name.includes('โต๊ะ')) ||
      (rawCat.includes('chair') && c.name.includes('โต๊ะ')) ||
      (rawCat.includes('av') && c.name.includes('โสต')) ||
      (rawCat.includes('projector') && c.name.includes('โปรเจกเตอร์')) ||
      (rawCat.includes('other') && c.name.includes('อื่น'))
    )
    if (matched) form.value.category = matched.name
    else form.value.category = String(route.query.category)
  }
})

async function handleSubmitReport() {
  if (!form.value.building.trim() || !form.value.room.trim()) {
    showLocationPicker.value = true
    alert('กรุณาระบุพิกัดสถานที่ (อาคารและห้องที่เกิดเหตุ) ให้ครบถ้วนก่อนส่งข้อมูลแจ้งซ่อม')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      ...form.value,
      lang: langStore.currentLang.value,
      image_before_url: attachedPhotos.value[0] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
    }

    const res = await $fetch<any>('/api/reports', {
      method: 'POST',
      body: payload
    })

    if (res.success) {
      setScannedRoom(form.value.building, form.value.floor, form.value.room)
      router.push({
        path: '/tracking',
        query: { 
          newId: res.data.id,
          building: form.value.building,
          floor: form.value.floor,
          room: form.value.room
        }
      })
    }
  } catch (err: any) {
    alert(`ไม่สามารถส่งรายงานได้: ${err.message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
