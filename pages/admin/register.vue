<template>
  <div class="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
    
    <!-- Top Back to Home / Portal -->
    <div class="max-w-md w-full mx-auto mb-4 flex items-center justify-between">
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-spu-purple transition-colors"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>กลับหน้าหลักผู้ใช้ทั่วไป</span>
      </NuxtLink>

      <span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
        <Lock class="w-3 h-3 text-amber-600" />
        <span>Staff Portal Only</span>
      </span>
    </div>

    <!-- Registration Card Container -->
    <div class="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
      
      <!-- Card Header -->
      <div class="p-6 bg-gradient-to-br from-spu-purple via-spu-purple to-spu-pink text-white relative">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl text-white border border-white/30 shadow-inner shrink-0">
            <span>SPU</span>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full text-pink-100">
              Operations & Facility Staff
            </span>
            <h1 class="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              ลงทะเบียนผู้ดูแลและเจ้าหน้าที่
            </h1>
          </div>
        </div>
        <p class="text-xs text-purple-100 mt-2 leading-relaxed">
          สร้างบัญชีสำหรับแอดมินหรือช่างผู้รับผิดชอบงาน เพื่อเข้าสู่ระบบและแสดงชื่อในการรับผิดชอบงานซ่อมบำรุง
        </p>
      </div>

      <!-- Success Screen -->
      <div v-if="registeredUser" class="p-6 sm:p-8 text-center space-y-4 animate-scale-up">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 class="w-8 h-8 stroke-[2.5]" />
        </div>
        
        <div>
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Registration Complete</span>
          <h2 class="text-xl font-extrabold text-slate-900 mt-1">ยินดีต้อนรับเข้าสู่ระบบ!</h2>
          <p class="text-xs text-slate-600 mt-1">
            ลงทะเบียนเจ้าหน้าที่ <strong class="text-spu-purple">{{ registeredUser.name }}</strong> เรียบร้อยแล้ว
          </p>
        </div>

        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">ชื่อผู้ใช้:</span>
            <span class="font-mono font-bold text-slate-900">{{ registeredUser.username }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">ตำแหน่งงาน:</span>
            <span class="font-bold text-spu-pink">{{ registeredUser.role }}</span>
          </div>
          <div class="flex justify-between" v-if="registeredUser.phone">
            <span class="text-slate-500">เบอร์ติดต่อ:</span>
            <span class="font-medium text-slate-700">{{ registeredUser.phone }}</span>
          </div>
        </div>

        <button 
          @click="proceedToAdmin"
          class="w-full py-3 px-4 spu-gradient-primary text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-spu-purple/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <span>เข้าสู่ระบบ Admin Portal ทันที</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Registration Form -->
      <form v-else @submit.prevent="handleRegister" class="p-6 space-y-4">
        
        <!-- Error Alert -->
        <div 
          v-if="errorMessage" 
          class="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 flex items-center gap-2 animate-shake"
        >
          <AlertCircle class="w-4 h-4 shrink-0 text-red-500" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Username Input -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            ชื่อผู้ใช้ (Username) <span class="text-spu-pink">*</span>
          </label>
          <div class="relative">
            <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="form.username" 
              type="text" 
              required
              placeholder="เช่น somsak_ac, niran_elec..."
              class="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all font-mono"
            />
          </div>
          <p class="text-[10px] text-slate-400 mt-1">ใช้ตัวอักษรภาษาอังกฤษ ตัวเลข หรือขีดล่าง</p>
        </div>

        <!-- Full Name / Technician Name Input -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            ชื่อ-นามสกุล / ชื่อช่างผู้รับผิดชอบ <span class="text-spu-pink">*</span>
          </label>
          <div class="relative">
            <BadgeCheck class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="form.name" 
              type="text" 
              required
              placeholder="เช่น นายสมศักดิ์ แสนสุข (ช่างแอร์ประจำอาคาร 11)"
              class="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all"
            />
          </div>
          <p class="text-[10px] text-slate-400 mt-1">ชื่อนี้จะปรากฏในระบบเมื่อคุณกดรับงานหรืออัปเดตสถานะงานซ่อม</p>
        </div>

        <!-- Role / Position -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            ตำแหน่ง / ฝ่ายงานที่รับผิดชอบ <span class="text-spu-pink">*</span>
          </label>
          <div class="relative">
            <Briefcase class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select 
              v-model="form.role" 
              required
              class="w-full pl-10 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all appearance-none"
            >
              <option value="ช่างแอร์และระบบทำความเย็น (HVAC Specialist)">ช่างแอร์และระบบทำความเย็น (HVAC Specialist)</option>
              <option value="ช่างไฟฟ้าและแสงสว่าง (Electrician)">ช่างไฟฟ้าและแสงสว่าง (Electrician)</option>
              <option value="ช่างประปาและสุขภัณฑ์ (Plumbing & Sanitary)">ช่างประปาและสุขภัณฑ์ (Plumbing & Sanitary)</option>
              <option value="ช่างโสตทัศนูปกรณ์และไอที (AV & IT Tech)">ช่างโสตทัศนูปกรณ์และไอที (AV & IT Tech)</option>
              <option value="ช่างซ่อมบำรุงอาคารทั่วไป (General Facility Tech)">ช่างซ่อมบำรุงอาคารทั่วไป (General Facility Tech)</option>
              <option value="หัวหน้างานปฏิบัติการ (Operations Director)">หัวหน้างานปฏิบัติการ (Operations Director)</option>
              <option value="ผู้ดูแลระบบส่วนกลาง (Facility Admin)">ผู้ดูแลระบบส่วนกลาง (Facility Admin)</option>
            </select>
            <ChevronDown class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            เบอร์โทรศัพท์ติดต่อ / เบอร์ภายใน
          </label>
          <div class="relative">
            <Phone class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="เช่น 081-234-5678 หรือ ต่อ 102"
              class="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all"
            />
          </div>
        </div>

        <!-- Password Inputs Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              รหัสผ่าน <span class="text-spu-pink">*</span>
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="อย่างน้อย 4 ตัวอักษร"
                class="w-full pl-10 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <EyeOff v-if="showPassword" class="w-3.5 h-3.5" />
                <Eye v-else class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ยืนยันรหัสผ่าน <span class="text-spu-pink">*</span>
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                v-model="confirmPassword" 
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                class="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 focus:border-spu-purple transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Staff Invite Passcode Box -->
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldAlert class="w-3.5 h-3.5 text-amber-500" />
              <span>รหัสยืนยันเจ้าหน้าที่ส่วนกลาง (Staff Passcode)</span>
            </label>
            <span class="text-[10px] text-slate-400">Security Gate</span>
          </div>
          <input 
            v-model="form.inviteCode" 
            type="text" 
            placeholder="รหัสผ่านเจ้าหน้าที่: SPU2025"
            class="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-spu-purple"
          />
          <p class="text-[10px] text-slate-400">
            รหัสความปลอดภัยเริ่มต้น: <code class="font-bold text-spu-purple">SPU2025</code> (หรือคลิกเพื่อเติมอัตโนมัติ)
            <button 
              type="button" 
              @click="form.inviteCode = 'SPU2025'" 
              class="text-spu-pink font-bold hover:underline ml-1"
            >
              เติม SPU2025
            </button>
          </p>
        </div>

        <!-- Submit Button -->
        <div class="pt-2 space-y-2">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-3 px-4 spu-gradient-primary text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-spu-purple/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            <span v-else>ยืนยันลงทะเบียนเจ้าหน้าที่</span>
            <ArrowRight v-if="!isLoading" class="w-4 h-4" />
          </button>

          <!-- Quick Return to Login -->
          <button 
            type="button" 
            @click="openLogin"
            class="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-spu-purple hover:bg-slate-50 rounded-xl transition-colors text-center"
          >
            มีบัญชีผู้ดูแลระบบอยู่แล้ว? เข้าสู่ระบบที่นี่
          </button>
        </div>

      </form>
    </div>

    <!-- Security Footer -->
    <div class="max-w-md w-full mx-auto mt-6 text-center text-[11px] text-slate-400">
      <p>SPU Operations & Infrastructure Hub • Restricted Staff System</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, 
  Lock, 
  BadgeCheck, 
  Briefcase, 
  Phone, 
  ChevronLeft, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'

const router = useRouter()
const adminAuth = useAdminAuth()

const form = ref({
  username: '',
  name: '',
  role: 'ช่างแอร์และระบบทำความเย็น (HVAC Specialist)',
  phone: '',
  password: '',
  inviteCode: 'SPU2025'
})

const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const registeredUser = ref<any>(null)

const handleRegister = async () => {
  errorMessage.value = ''

  if (form.value.password !== confirmPassword.value) {
    errorMessage.value = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง'
    return
  }

  if (form.value.password.length < 4) {
    errorMessage.value = 'รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร'
    return
  }

  isLoading.value = true
  try {
    const res = await $fetch<any>('/api/admin/register', {
      method: 'POST',
      body: form.value
    })

    if (res && res.success) {
      registeredUser.value = res.user
      // Automatically log the new admin in!
      await adminAuth.login(form.value.username, form.value.password)
    }
  } catch (err: any) {
    errorMessage.value = err.data?.message || err.message || 'การลงทะเบียนล้มเหลว กรุณาตรวจสอบข้อมูล'
  } finally {
    isLoading.value = false
  }
}

const proceedToAdmin = () => {
  router.push('/admin')
}

const openLogin = () => {
  adminAuth.openLoginModal('/admin', 'กรุณากรอก Username และ Password เพื่อเข้าใช้งาน')
}
</script>

<style scoped>
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scaleUp 0.2s ease-out forwards;
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
