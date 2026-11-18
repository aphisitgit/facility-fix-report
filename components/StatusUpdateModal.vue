<template>
  <div v-if="isOpen && ticket" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90dvh]">
      <!-- Header -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
        <div class="min-w-0 pr-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-spu-purple bg-spu-purple-50 px-2 py-0.5 rounded-full">{{ ticket.id?.startsWith('Ticket') ? ticket.id : '#' + ticket.id }}</span>
            <span class="text-xs font-semibold text-slate-600 truncate">{{ langStore.translateBuilding(ticket.building) }} • {{ langStore.translateRoom(ticket.room) }}</span>
          </div>
          <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">{{ langStore.t('modalUpdateTitle') }}</h3>
        </div>
        <button 
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors shrink-0"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
        <!-- Ticket Brief Info -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
          <img :src="ticket.image_before_url" alt="Thumbnail" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200" />
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-800 truncate">{{ langStore.translateCategory(ticket.category) }}</p>
            <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{{ ticket.description }}</p>
            <p class="text-[10px] text-spu-pink font-semibold mt-1">{{ langStore.t('modalReporterLabel') }} {{ ticket.reporter_email }}</p>
          </div>
        </div>

        <!-- 4-Step Workflow Stepper Header -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>{{ langStore.t('modalWorkflowStandard') }}</span>
              <span class="text-[10px] text-slate-400 font-normal">({{ langStore.currentLang.value === 'en' ? 'Standard 4 Steps' : 'ขั้นตอนมาตรฐาน 4 ระดับ' }})</span>
            </span>
            <span class="text-xs font-black text-spu-pink">
              {{ getStepBadgeLabel(targetStatus) }}
            </span>
          </div>

          <!-- Stepper Visual Progress Bar -->
          <div class="relative flex items-center justify-between px-3 pt-1 pb-1">
            <!-- Background Connection Line Track -->
            <div class="absolute left-6 right-6 top-3.5 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-spu-purple transition-all duration-300 rounded-full"
                :style="{ width: getStepLineWidth(targetStatus) }"
              ></div>
            </div>

            <!-- Step 1: Received -->
            <button 
              type="button" 
              @click="targetStatus = 'PENDING'"
              class="flex flex-col items-center gap-1 z-10 group cursor-pointer focus:outline-none"
              :title="langStore.t('modalStep1')"
            >
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ring-4 ring-white transition-all group-hover:scale-110"
                :class="isStepActive('PENDING') ? 'bg-spu-purple text-white scale-105' : 'bg-slate-200 text-slate-500'"
              >
                <Check class="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span class="text-[10px] font-bold" :class="targetStatus === 'PENDING' ? 'text-spu-purple font-black' : 'text-slate-500'">{{ langStore.t('statusPending') }}</span>
            </button>

            <!-- Step 2: Assigned -->
            <button 
              type="button" 
              @click="targetStatus = 'ASSIGNED'"
              class="flex flex-col items-center gap-1 z-10 group cursor-pointer focus:outline-none"
              :title="langStore.t('modalStep2')"
            >
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ring-4 ring-white transition-all group-hover:scale-110"
                :class="isStepActive('ASSIGNED') ? 'bg-spu-purple text-white scale-105' : 'bg-slate-200 text-slate-500'"
              >
                <Check v-if="isStepActive('ASSIGNED')" class="w-3.5 h-3.5 stroke-[3]" />
                <span v-else>2</span>
              </div>
              <span class="text-[10px] font-bold" :class="targetStatus === 'ASSIGNED' ? 'text-spu-purple font-black' : 'text-slate-500'">{{ langStore.t('statusAssigned') }}</span>
            </button>

            <!-- Step 3: Working -->
            <button 
              type="button" 
              @click="targetStatus = 'IN_PROGRESS'"
              class="flex flex-col items-center gap-1 z-10 group cursor-pointer focus:outline-none"
              :title="langStore.t('modalStep3')"
            >
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ring-4 ring-white transition-all group-hover:scale-110"
                :class="isStepActive('IN_PROGRESS') ? 'bg-spu-purple text-white scale-105' : 'bg-slate-200 text-slate-500'"
              >
                <Check v-if="isStepActive('IN_PROGRESS')" class="w-3.5 h-3.5 stroke-[3]" />
                <span v-else>3</span>
              </div>
              <span class="text-[10px] font-bold" :class="targetStatus === 'IN_PROGRESS' ? 'text-spu-pink font-black' : 'text-slate-500'">{{ langStore.t('statusWorking') }}</span>
            </button>

            <!-- Step 4: Resolved -->
            <button 
              type="button" 
              @click="targetStatus = 'RESOLVED'"
              class="flex flex-col items-center gap-1 z-10 group cursor-pointer focus:outline-none"
              :title="langStore.t('modalStep4')"
            >
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ring-4 ring-white transition-all group-hover:scale-110"
                :class="targetStatus === 'RESOLVED' ? 'bg-emerald-600 text-white scale-105' : 'bg-slate-200 text-slate-500'"
              >
                <Check v-if="targetStatus === 'RESOLVED'" class="w-3.5 h-3.5 stroke-[3]" />
                <span v-else>4</span>
              </div>
              <span class="text-[10px] font-bold" :class="targetStatus === 'RESOLVED' ? 'text-emerald-700 font-black' : 'text-slate-500'">{{ langStore.t('statusResolved') }}</span>
            </button>
          </div>
        </div>

        <!-- 4 Step Status Cards Selection -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>เปลี่ยนสถานะงานแจ้งซ่อม *</span>
            <span class="text-[10px] font-normal text-slate-400">ขั้นตอนมาตรฐาน 4 ระดับ</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            <!-- Step 1: Received -->
            <button 
              type="button"
              @click="targetStatus = 'PENDING'"
              class="p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between"
              :class="targetStatus === 'PENDING' 
                ? 'border-spu-purple bg-spu-purple-50/70 text-spu-purple shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" :class="targetStatus === 'PENDING' ? 'bg-spu-purple text-white' : 'bg-slate-100 text-slate-500'">
                  <ClipboardList class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">{{ langStore.currentLang.value === 'en' ? '1. Received' : '1. รับเรื่องแล้ว (Received)' }}</p>
                  <p class="text-[10px] text-slate-500">{{ langStore.currentLang.value === 'en' ? 'Awaiting technician dispatch' : 'รับเรื่องแล้ว (รอมอบหมาย)' }}</p>
                </div>
              </div>
              <div v-if="targetStatus === 'PENDING'" class="w-2.5 h-2.5 rounded-full bg-spu-purple"></div>
            </button>

            <!-- Step 2: Assigned -->
            <button 
              type="button"
              @click="targetStatus = 'ASSIGNED'"
              class="p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between"
              :class="targetStatus === 'ASSIGNED' 
                ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" :class="targetStatus === 'ASSIGNED' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'">
                  <UserCheck class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">{{ langStore.currentLang.value === 'en' ? '2. Assigned' : '2. มอบหมายช่างแล้ว (Assigned)' }}</p>
                  <p class="text-[10px] text-slate-500">{{ langStore.currentLang.value === 'en' ? 'Technician assigned' : 'มอบหมายช่างผู้ดูแลแล้ว' }}</p>
                </div>
              </div>
              <div v-if="targetStatus === 'ASSIGNED'" class="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            </button>

            <!-- Step 3: Working -->
            <button 
              type="button"
              @click="targetStatus = 'IN_PROGRESS'"
              class="p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between"
              :class="targetStatus === 'IN_PROGRESS' 
                ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" :class="targetStatus === 'IN_PROGRESS' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'">
                  <Wrench class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">{{ langStore.currentLang.value === 'en' ? '3. Working On-Site' : '3. กำลังซ่อมหน้างาน (Working)' }}</p>
                  <p class="text-[10px] text-slate-500">{{ langStore.currentLang.value === 'en' ? 'Active repair in progress' : 'ช่างกำลังซ่อมหน้างาน' }}</p>
                </div>
              </div>
              <div v-if="targetStatus === 'IN_PROGRESS'" class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            </button>

            <!-- Step 4: Resolved -->
            <button 
              type="button"
              @click="targetStatus = 'RESOLVED'"
              class="p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between"
              :class="targetStatus === 'RESOLVED' 
                ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" :class="targetStatus === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'">
                  <CheckCircle class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">{{ langStore.currentLang.value === 'en' ? '4. Repair Resolved' : '4. ซ่อมเสร็จสิ้น (Resolved)' }}</p>
                  <p class="text-[10px] text-slate-500">{{ langStore.currentLang.value === 'en' ? 'Repair completed & verified' : 'ซ่อมเสร็จสิ้น & ตรวจรับ' }}</p>
                </div>
              </div>
              <div v-if="targetStatus === 'RESOLVED'" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            </button>

          </div>
        </div>

        <!-- Assign Technician -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs font-bold text-slate-700">{{ langStore.currentLang.value === 'en' ? 'Assigned Technician' : 'มอบหมายช่างผู้รับผิดชอบงาน' }}</label>
            <button 
              v-if="adminAuth.adminProfile.value?.name"
              type="button" 
              @click="selectedTech = adminAuth.adminProfile.value.name"
              class="text-[10px] font-bold text-spu-pink hover:text-spu-purple flex items-center gap-1 hover:underline"
            >
              <UserCheck class="w-3 h-3" />
              <span>{{ langStore.currentLang.value === 'en' ? `Assign to me (${adminAuth.adminProfile.value.name})` : `มอบหมายให้ฉัน (${adminAuth.adminProfile.value.name})` }}</span>
            </button>
          </div>
          <select 
            v-model="selectedTech" 
            class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-purple/40"
          >
            <!-- Registered Staff List -->
            <optgroup label="เจ้าหน้าที่ในระบบ (Registered Staff)" v-if="staffList.length > 0">
              <option v-for="u in staffList" :key="u.id" :value="u.name">
                {{ u.name }} — {{ u.role }}
              </option>
            </optgroup>
            <!-- Default / Preset Options -->
            <optgroup label="ตัวเลือกทั่วไป (Presets)">
              <option value="Somchai K.">Somchai K. (ช่างระบบปรับอากาศ & เครื่องกล)</option>
              <option value="Niran T.">Niran T. (ช่างเทคนิคระบบไฟฟ้าอาคาร)</option>
              <option value="Wichai L.">Wichai L. (ช่างโสตทัศนูปกรณ์ & IT)</option>
              <option value="Kitiwat S.">Kitiwat S. (ช่างซ่อมบำรุงทั่วไป)</option>
            </optgroup>
          </select>
        </div>

        <!-- Required After-Repair Photo Upload (If Resolved) -->
        <div v-if="targetStatus === 'RESOLVED'" class="space-y-2 pt-1 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800">
              {{ langStore.currentLang.value === 'en' ? 'After-Repair Photo Verification' : 'แนบรูปถ่ายยืนยันหลังการซ่อมเสร็จสิ้น' }} <span class="text-red-500">*</span>
            </label>
            <span class="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {{ langStore.currentLang.value === 'en' ? 'Required for SLA Closure' : 'จำเป็นสำหรับการปิดงาน SLA' }}
            </span>
          </div>

          <div class="flex gap-3 items-center">
            <!-- Preview if available -->
            <div v-if="afterPhotoPreview" class="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shrink-0">
              <img :src="afterPhotoPreview" alt="After" class="w-full h-full object-cover" />
              <button 
                type="button" 
                @click="afterPhotoPreview = ''"
                class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <X class="w-3 h-3" />
              </button>
            </div>

            <!-- Upload Box / Camera -->
            <label class="flex-1 border-2 border-dashed border-slate-200 hover:border-spu-purple rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-spu-purple-50/30 transition-all">
              <Camera class="w-5 h-5 text-slate-400 group-hover:text-spu-purple mb-1" />
              <span class="text-xs font-semibold text-slate-700">{{ langStore.currentLang.value === 'en' ? 'Take Photo / Upload After-Repair' : 'ถ่ายภาพ / อัปโหลดรูปภาพหลังซ่อม' }}</span>
              <span class="text-[10px] text-slate-400">JPG, PNG</span>
              <input type="file" accept="image/*" capture="environment" class="hidden" @change="handleFileUpload" />
            </label>
          </div>

          <!-- Quick Sample Photo Selection for fast testing -->
          <div class="flex items-center gap-2 pt-1">
            <span class="text-[10px] text-slate-400">{{ langStore.currentLang.value === 'en' ? 'Quick Sample:' : 'รูปตัวอย่างรวดเร็ว:' }}</span>
            <button 
              type="button"
              @click="afterPhotoPreview = 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'"
              class="text-[10px] text-spu-purple font-medium hover:underline bg-spu-purple-50 px-2 py-0.5 rounded"
            >
              {{ langStore.currentLang.value === 'en' ? 'Use Sample Photo' : 'ใช้ภาพตัวอย่างซ่อมเสร็จ' }}
            </button>
          </div>
        </div>

        <!-- Technician Notes -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ langStore.currentLang.value === 'en' ? 'Technician Log / Action Details' : 'บันทึกการปฏิบัติงาน / หมายเหตุการซ่อม' }}</label>
          <textarea 
            v-model="actionNote"
            rows="2"
            placeholder="เช่น ทำความสะอาดท่อน้ำทิ้ง ตรวจสอบระบบลมเย็น พร้อมใช้งานสำหรับการเรียนการสอนแล้ว"
            class="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-spu-purple/40 resize-none"
          ></textarea>
        </div>

        <!-- Footer Buttons -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {{ langStore.currentLang.value === 'en' ? 'Cancel' : 'ยกเลิก' }}
          </button>
          <button 
            type="submit"
            :disabled="isSubmitting || (targetStatus === 'RESOLVED' && !afterPhotoPreview)"
            class="px-5 py-2.5 rounded-xl spu-gradient-hero text-white text-xs font-bold hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span>{{ isSubmitting 
              ? (langStore.currentLang.value === 'en' ? 'Saving and Dispatching Email...' : 'กำลังบันทึกและส่งอีเมล...') 
              : (langStore.currentLang.value === 'en' ? 'Update Status & Send Email' : 'บันทึกสถานะและส่งแจ้งเตือน') 
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { X, Camera, Loader2, UserCheck, Check, ClipboardList, Wrench, CheckCircle } from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAppLang } from '~/composables/useAppLang'

const props = defineProps({
  isOpen: Boolean,
  ticket: Object as any
})

const emit = defineEmits(['close', 'updated'])

const langStore = useAppLang()
const adminAuth = useAdminAuth()
const targetStatus = ref<'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('IN_PROGRESS')
const selectedTech = ref('Somchai K.')
const afterPhotoPreview = ref('')
const actionNote = ref('')
const isSubmitting = ref(false)
const staffList = ref<any[]>([])

function getStepBadgeLabel(status: string) {
  const isEn = langStore.currentLang.value === 'en'
  if (status === 'RESOLVED') return isEn ? 'Step 4 of 4 • Resolved' : 'ขั้นตอนที่ 4 จาก 4 • ซ่อมเสร็จสิ้น'
  if (status === 'IN_PROGRESS') return isEn ? 'Step 3 of 4 • Working on-site' : 'ขั้นตอนที่ 3 จาก 4 • กำลังซ่อมหน้างาน'
  if (status === 'ASSIGNED') return isEn ? 'Step 2 of 4 • Assigned to Tech' : 'ขั้นตอนที่ 2 จาก 4 • มอบหมายช่างแล้ว'
  return isEn ? 'Step 1 of 4 • Received' : 'ขั้นตอนที่ 1 จาก 4 • รับเรื่องแล้ว'
}

function getStepLineWidth(status: string) {
  if (status === 'RESOLVED') return '100%'
  if (status === 'IN_PROGRESS') return '66%'
  if (status === 'ASSIGNED') return '33%'
  return '0%'
}

function isStepActive(step: string) {
  const order = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']
  return order.indexOf(targetStatus.value) >= order.indexOf(step)
}

function isStepPassed(step: string) {
  const order = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']
  return order.indexOf(targetStatus.value) > order.indexOf(step)
}

async function loadStaff() {
  try {
    const res = await $fetch<any>('/api/admin/users')
    if (res.success && Array.isArray(res.data)) {
      staffList.value = res.data
    }
  } catch {
    // quiet fail
  }
}

onMounted(() => {
  loadStaff()
})

watch(() => props.ticket, (newTicket) => {
  if (newTicket) {
    targetStatus.value = (newTicket.status as any) || 'PENDING'
    selectedTech.value = newTicket.assigned_tech || adminAuth.adminProfile.value?.name || 'Somchai K.'
    afterPhotoPreview.value = newTicket.image_after_url || ''
    actionNote.value = ''
    loadStaff()
  }
})

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

async function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    try {
      const compressed = await compressImage(file)
      afterPhotoPreview.value = compressed
    } catch {
      const reader = new FileReader()
      reader.onload = (event) => {
        afterPhotoPreview.value = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }
}

async function handleSubmit() {
  if (!props.ticket) return
  isSubmitting.value = true

  try {
    const defaultAfterImage = 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    let defaultNote = 'Ticket received and queued for triage.'
    if (targetStatus.value === 'RESOLVED') defaultNote = 'Repairs completed and verified.'
    else if (targetStatus.value === 'IN_PROGRESS') defaultNote = 'Technician is actively working on-site.'
    else if (targetStatus.value === 'ASSIGNED') defaultNote = `Dispatched and assigned to ${selectedTech.value}.`

    const payload = {
      status: targetStatus.value,
      assigned_tech: selectedTech.value,
      image_after_url: targetStatus.value === 'RESOLVED' ? (afterPhotoPreview.value || defaultAfterImage) : null,
      note: actionNote.value || defaultNote
    }

    const res = await $fetch(`/api/reports/${encodeURIComponent(props.ticket.id)}/status`, {
      method: 'PATCH',
      body: payload
    })

    emit('updated', res)
    emit('close')
  } catch (err: any) {
    alert(`Failed to update ticket: ${err.message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
