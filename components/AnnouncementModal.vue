<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90dvh]">
      
      <!-- Header -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <div class="flex items-center gap-2.5 min-w-0 pr-2">
          <div class="w-9 h-9 rounded-2xl bg-spu-pink text-white flex items-center justify-center shadow-xs shrink-0">
            <Megaphone class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-slate-900 truncate">จัดการประกาศจากส่วนกลาง</h3>
            <p class="text-[11px] text-slate-400 truncate">แก้ไขข้อความและควบคุมการแสดงผลประกาศบนหน้าแรกของผู้ใช้งาน</p>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-200/80 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors shrink-0"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSave" class="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
        
        <!-- Toggle Enabled / Disabled -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
          <div class="space-y-0.5">
            <p class="text-xs font-bold text-slate-800">เปิดแสดงประกาศบนหน้าแรก</p>
            <p class="text-[11px] text-slate-500">หากปิด สมาชิกจะไม่เห็นแถบประกาศนี้ในหน้าหลัก</p>
          </div>

          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="formData.enabled" 
              type="checkbox" 
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spu-pink"></div>
          </label>
        </div>

        <!-- Department Input -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">หน่วยงาน / ฝ่ายที่ออกประกาศ *</label>
          <input 
            v-model="formData.department"
            type="text"
            required
            placeholder="เช่น ฝ่ายอาคารและสถานที่"
            class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-pink/30"
          />
        </div>

        <!-- Title Input -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">หัวข้อประกาศ *</label>
          <input 
            v-model="formData.title"
            type="text"
            required
            placeholder="เช่น กำหนดการบำรุงรักษาเครื่องปรับอากาศ: อาคาร 11 (ชั้น 4-8)"
            class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-pink/30"
          />
        </div>

        <!-- Message Body -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">ข้อความรายละเอียดประกาศ *</label>
          <textarea 
            v-model="formData.message"
            rows="3"
            required
            placeholder="กรอกรายละเอียดคำชี้แจง เวลาดำเนินการ หรือข้อควรปฏิบัติ..."
            class="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-spu-pink/30 resize-none"
          ></textarea>
        </div>

        <!-- Live Preview of the Banner -->
        <div class="space-y-1.5 pt-1">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ตัวอย่างการแสดงผลบนหน้าแรก (Preview):</p>
          
          <div 
            v-if="formData.enabled" 
            class="relative bg-gradient-to-r from-spu-pink-50 to-purple-50/60 border border-spu-pink-200/80 rounded-2xl p-3.5 text-xs shadow-xs"
          >
            <div class="flex items-start gap-2.5">
              <div class="p-1.5 rounded-xl bg-spu-purple text-white shrink-0 mt-0.5">
                <Megaphone class="w-3.5 h-3.5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span class="text-[9px] font-black uppercase text-spu-pink tracking-wider bg-white px-1.5 py-0.2 rounded-full border border-spu-pink-200">
                    ประกาศจากส่วนกลาง
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium truncate">{{ formData.department }}</span>
                </div>
                <h4 class="font-extrabold text-slate-900 text-xs leading-tight">{{ formData.title }}</h4>
                <p class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{{ formData.message }}</p>
              </div>
            </div>
          </div>

          <div v-else class="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
            🚫 ประกาศนี้ถูกปิดการแสดงผลอยู่ สมาชิกทั่วไปจะไม่เห็นบนหน้าหลัก
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {{ langStore.t('cancel') }}
          </button>
          <button 
            type="submit"
            class="px-5 py-2.5 rounded-xl spu-gradient-primary text-white text-xs font-bold hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Check class="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{{ langStore.currentLang.value === 'en' ? 'Save & Publish Announcement' : 'บันทึกและเผยแพร่ประกาศ' }}</span>
          </button>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Megaphone, X, Check } from 'lucide-vue-next'
import { useAnnouncement } from '~/composables/useAnnouncement'
import { useAppLang } from '~/composables/useAppLang'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'saved'])

const langStore = useAppLang()
const { announcement, updateAnnouncement } = useAnnouncement()

const formData = ref({
  enabled: true,
  department: '',
  title: '',
  message: ''
})

watch(() => props.isOpen, (open) => {
  if (open) {
    formData.value = {
      enabled: announcement.value.enabled,
      department: announcement.value.department,
      title: announcement.value.title,
      message: announcement.value.message
    }
  }
}, { immediate: true })

function handleSave() {
  updateAnnouncement({
    enabled: formData.value.enabled,
    department: formData.value.department,
    title: formData.value.title,
    message: formData.value.message
  })
  emit('saved')
  emit('close')
  alert('บันทึกและอัปเดตประกาศจากส่วนกลางเรียบร้อยแล้ว!')
}
</script>
