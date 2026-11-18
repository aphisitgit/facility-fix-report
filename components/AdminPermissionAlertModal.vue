<template>
  <div 
    v-if="notif.isPermissionModalOpen.value" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    @click.self="notif.isPermissionModalOpen.value = false"
  >
    <div class="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all animate-scale-up">
      
      <!-- Top Graphic Header -->
      <div class="p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-spu-pink text-white relative text-center">
        <button 
          @click="notif.isPermissionModalOpen.value = false" 
          class="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-inner">
          <Lock class="w-8 h-8 text-white stroke-[2.2]" />
        </div>

        <span class="text-[10px] font-black uppercase tracking-wider bg-black/20 text-white px-2.5 py-1 rounded-full">
          RESTRICTED ACCESS
        </span>
        <h3 class="text-lg font-extrabold text-white mt-1.5">เฉพาะผู้ดูแลระบบ (Admin Only)</h3>
      </div>

      <!-- Description Body -->
      <div class="p-6 text-center space-y-4">
        <div class="space-y-1.5">
          <p class="text-xs font-bold text-slate-800">
            ระบบแจ้งเตือนการแจ้งซ่อมและรายงานปัญหาส่วนกลาง
          </p>
          <p class="text-xs text-slate-500 leading-relaxed">
            ศูนย์แจ้งเตือนนี้สงวนสิทธิ์เฉพาะ <strong class="text-spu-purple">Admin</strong> และเจ้าหน้าที่ส่วนกลางของมหาวิทยาลัยศรีปทุมเท่านั้น บุคคลทั่วไปไม่สามารถเข้าดูข้อมูลงานซ่อมได้
          </p>
        </div>

        <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-left flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>ต้องการดูรายงานความคืบหน้า? กรุณายืนยันตัวตนด้วยรหัสผ่านผู้ดูแลระบบ</span>
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 space-y-2">
          <button 
            type="button" 
            @click="handleProceedToLogin"
            class="w-full py-3 px-4 spu-gradient-primary text-white font-bold text-sm rounded-2xl shadow-lg shadow-spu-purple/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <KeyRound class="w-4 h-4" />
            <span>กรอกรหัสผ่าน Admin เพื่อดูการแจ้งเตือน</span>
          </button>

          <button 
            type="button" 
            @click="notif.isPermissionModalOpen.value = false" 
            class="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            ปิดหน้าต่าง (Close)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, X, ShieldAlert, KeyRound } from 'lucide-vue-next'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAdminAuth } from '~/composables/useAdminAuth'

const notif = useAdminNotifications()
const adminAuth = useAdminAuth()

const handleProceedToLogin = () => {
  notif.isPermissionModalOpen.value = false
  adminAuth.openLoginModal('/admin', 'กรุณากรอกรหัสผ่าน Admin เพื่อดูศูนย์การแจ้งเตือนส่วนกลาง')
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
</style>
