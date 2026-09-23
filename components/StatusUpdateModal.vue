<template>
  <div v-if="isOpen && ticket" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-spu-purple bg-spu-purple-50 px-2 py-0.5 rounded-full">#{{ ticket.id }}</span>
            <span class="text-xs font-semibold text-slate-600">{{ ticket.building }} • {{ ticket.room }}</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 mt-1">Update Ticket Triage & Status</h3>
        </div>
        <button 
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-5 overflow-y-auto max-h-[75vh] space-y-4">
        <!-- Ticket Brief Info -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
          <img :src="ticket.image_before_url" alt="Thumbnail" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200" />
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-800 truncate">{{ ticket.category }}</p>
            <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{{ ticket.description }}</p>
            <p class="text-[10px] text-spu-pink font-semibold mt-1">Reporter: {{ ticket.reporter_email }}</p>
          </div>
        </div>

        <!-- Target Status Selection -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">Change Status To *</label>
          <div class="grid grid-cols-2 gap-3">
            <button 
              type="button"
              @click="targetStatus = 'IN_PROGRESS'"
              class="p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between"
              :class="targetStatus === 'IN_PROGRESS' 
                ? 'border-amber-500 bg-amber-50/60 text-amber-900 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700'"
            >
              <div>
                <p class="text-xs font-bold">In Progress</p>
                <p class="text-[10px] text-slate-500">Technician working on-site</p>
              </div>
              <div v-if="targetStatus === 'IN_PROGRESS'" class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            </button>

            <button 
              type="button"
              @click="targetStatus = 'RESOLVED'"
              class="p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between"
              :class="targetStatus === 'RESOLVED' 
                ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700'"
            >
              <div>
                <p class="text-xs font-bold">Resolved</p>
                <p class="text-[10px] text-slate-500">Repairs completed & verified</p>
              </div>
              <div v-if="targetStatus === 'RESOLVED'" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            </button>
          </div>
        </div>

        <!-- Assign Technician -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Assign Lead Technician</label>
          <select 
            v-model="selectedTech" 
            class="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-spu-purple/40"
          >
            <option value="Somchai K.">Somchai K. (HVAC & Mechanical Lead)</option>
            <option value="Niran T.">Niran T. (Senior Electrician)</option>
            <option value="Wichai L.">Wichai L. (Audio/Visual & IT Tech)</option>
            <option value="Kitiwat S.">Kitiwat S. (General Maintenance)</option>
          </select>
        </div>

        <!-- Required After-Repair Photo Upload (If Resolved) -->
        <div v-if="targetStatus === 'RESOLVED'" class="space-y-2 pt-1 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800">
              After-Repair Photo Verification <span class="text-red-500">*</span>
            </label>
            <span class="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Required for SLA</span>
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
              <span class="text-xs font-semibold text-slate-700">Upload / Take After Photo</span>
              <span class="text-[10px] text-slate-400">JPG, PNG (Sample photos auto-filled if empty)</span>
              <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
            </label>
          </div>

          <!-- Quick Sample Photo Selection for fast testing -->
          <div class="flex items-center gap-2 pt-1">
            <span class="text-[10px] text-slate-400">Fast Preset:</span>
            <button 
              type="button"
              @click="afterPhotoPreview = 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'"
              class="text-[10px] text-spu-purple font-medium hover:underline bg-spu-purple-50 px-2 py-0.5 rounded"
            >
              Preset Fixed Component Photo
            </button>
          </div>
        </div>

        <!-- Technician Notes -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Action Note / Log</label>
          <textarea 
            v-model="actionNote"
            rows="2"
            placeholder="e.g. Cleared drainage pipe, tested airflow, certified room for lecture use."
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
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="isSubmitting || (targetStatus === 'RESOLVED' && !afterPhotoPreview)"
            class="px-5 py-2.5 rounded-xl spu-gradient-hero text-white text-xs font-bold hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span>{{ isSubmitting ? 'Updating & Sending Email...' : 'Save & Dispatch Notice' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Camera, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  ticket: Object as any
})

const emit = defineEmits(['close', 'updated'])

const targetStatus = ref<'IN_PROGRESS' | 'RESOLVED'>('IN_PROGRESS')
const selectedTech = ref('Somchai K.')
const afterPhotoPreview = ref('')
const actionNote = ref('')
const isSubmitting = ref(false)

watch(() => props.ticket, (newTicket) => {
  if (newTicket) {
    targetStatus.value = newTicket.status === 'PENDING' ? 'IN_PROGRESS' : 'RESOLVED'
    selectedTech.value = newTicket.assigned_tech || 'Somchai K.'
    afterPhotoPreview.value = newTicket.image_after_url || ''
    actionNote.value = ''
  }
})

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      afterPhotoPreview.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  if (!props.ticket) return
  isSubmitting.value = true

  try {
    const defaultAfterImage = 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    const payload = {
      status: targetStatus.value,
      assigned_tech: selectedTech.value,
      image_after_url: targetStatus.value === 'RESOLVED' ? (afterPhotoPreview.value || defaultAfterImage) : null,
      note: actionNote.value || (targetStatus.value === 'RESOLVED' ? 'Repairs completed and verified.' : 'Dispatched technician on-site.')
    }

    const res = await $fetch(`/api/reports/${props.ticket.id}/status`, {
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
