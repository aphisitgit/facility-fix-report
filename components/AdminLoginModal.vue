<template>
  <div 
    v-if="adminAuth.isLoginModalOpen.value" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    @click.self="adminAuth.closeLoginModal()"
  >
    <div class="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all animate-scale-up">
      
      <!-- Modal Header -->
      <div class="p-6 bg-gradient-to-br from-spu-purple via-spu-purple to-spu-pink text-white relative">
        <button 
          @click="adminAuth.closeLoginModal()" 
          class="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-3 mb-2">
          <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg text-white border border-white/25 shadow-inner">
            <ShieldCheck class="w-6 h-6 text-white" />
          </div>
          <div>
            <span class="text-[10px] font-bold tracking-wider uppercase text-pink-200 bg-white/10 px-2 py-0.5 rounded-full">
              Staff & Admin Portal
            </span>
            <h3 class="text-lg font-extrabold text-white mt-0.5">เข้าสู่ระบบเจ้าหน้าที่</h3>
          </div>
        </div>
        <p class="text-xs text-purple-100 mt-1 leading-relaxed">
          {{ adminAuth.loginPromptReason.value || 'เข้าสู่ระบบเพื่อจัดการงานซ่อมบำรุงและแสดงชื่อผู้รับผิดชอบงาน' }}
        </p>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-3.5">
        
        <!-- Error Message Banner -->
        <div 
          v-if="adminAuth.loginErrorMsg.value" 
          class="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 flex items-center gap-2 animate-shake"
        >
          <AlertCircle class="w-4 h-4 shrink-0 text-red-500" />
          <span>{{ adminAuth.loginErrorMsg.value }}</span>
        </div>

        <!-- Username Field -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            ชื่อผู้ใช้ (Username)
          </label>
          <div class="relative">
            <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              ref="usernameInputRef"
              v-model="username" 
              type="text"
              placeholder="กรอก Username..."
              autocomplete="username"
              class="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all font-mono"
              required
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>รหัสผ่าน (Password)</span>
            <span class="text-[10px] font-normal text-slate-400">Security Check</span>
          </label>
          <div class="relative">
            <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              placeholder="กรอกรหัสผ่าน..."
              autocomplete="current-password"
              class="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all"
              required
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <EyeOff v-if="showPassword" class="w-3.5 h-3.5" />
              <Eye v-else class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Quick Fill Accounts for Testing -->
        <div class="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1.5">
          <p class="font-bold text-slate-600 text-[10px]">เลือกบัญชีทดสอบด่วน:</p>
          <div class="flex flex-wrap gap-1.5">
            <button 
              type="button" 
              @click="username = 'admin'; password = 'admin1234'"
              class="px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-colors"
              :class="username === 'admin' ? 'bg-spu-purple text-white border-spu-purple' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'"
            >
              Praew (Director)
            </button>
            <button 
              type="button" 
              @click="username = 'somchai'; password = '1234'"
              class="px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-colors"
              :class="username === 'somchai' ? 'bg-spu-purple text-white border-spu-purple' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'"
            >
              ช่างสมชาย (HVAC Lead)
            </button>
            <button 
              type="button" 
              @click="username = 'niran'; password = '1234'"
              class="px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-colors"
              :class="username === 'niran' ? 'bg-spu-purple text-white border-spu-purple' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'"
            >
              ช่างนิรันดร์ (Electrician)
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-1 space-y-2">
          <button 
            type="submit" 
            :disabled="isLoading || !password"
            class="w-full py-2.5 px-4 spu-gradient-primary text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-spu-purple/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            <span v-else>เข้าสู่ระบบ (Sign In)</span>
            <ArrowRight v-if="!isLoading" class="w-4 h-4" />
          </button>

          <!-- Hidden Admin Registration Link -->
          <NuxtLink 
            to="/admin/register"
            @click="adminAuth.closeLoginModal()"
            class="w-full py-2 text-[11px] font-bold text-spu-purple hover:text-spu-pink rounded-xl transition-colors text-center block"
          >
            สมัครบัญชีเจ้าหน้าที่ / แอดมินใหม่ (เฉพาะเจ้าหน้าที่) &rarr;
          </NuxtLink>

          <button 
            type="button" 
            @click="adminAuth.closeLoginModal()" 
            class="w-full py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            ยกเลิก (Cancel)
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ShieldCheck, Lock, User, Eye, EyeOff, X, AlertCircle, Loader2, ArrowRight } from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'

const adminAuth = useAdminAuth()
const username = ref('admin')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const usernameInputRef = ref<HTMLInputElement | null>(null)

watch(() => adminAuth.isLoginModalOpen.value, (isOpen) => {
  if (isOpen) {
    password.value = ''
    showPassword.value = false
    nextTick(() => {
      usernameInputRef.value?.focus()
    })
  }
})

const handleSubmit = async () => {
  if (!password.value) return
  isLoading.value = true
  try {
    await adminAuth.login(username.value, password.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scaleUp 0.18s ease-out forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
