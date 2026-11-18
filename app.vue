<template>
  <div>
    <NuxtPage />

    <!-- Global Admin Access & Notification Modals -->
    <AdminLoginModal />
    <AdminNotificationModal />
    <AdminPermissionAlertModal />
    <AdminIncomingToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAppLang } from '~/composables/useAppLang'

const route = useRoute()
const adminAuth = useAdminAuth()
const notif = useAdminNotifications()
const appLang = useAppLang()

let notifInterval: any = null

onMounted(() => {
  // Initialize language preference
  appLang.initLang()

  // Check persisted auth
  adminAuth.checkAuth()

  // Fetch initial notifications
  notif.fetchNotifications()

  // Setup periodic polling for real-time notifications
  notifInterval = setInterval(() => {
    notif.fetchNotifications()
  }, 5000)

  // If redirected with login parameter
  if (route.query.login === 'admin') {
    const redirect = (route.query.redirect as string) || '/admin'
    adminAuth.openLoginModal(redirect, 'กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานส่วนควบคุม Admin')
  }
})

// Watch query change in case of navigation
watch(() => route.query.login, (newVal) => {
  if (newVal === 'admin') {
    const redirect = (route.query.redirect as string) || '/admin'
    adminAuth.openLoginModal(redirect, 'กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานส่วนควบคุม Admin')
  }
})

onUnmounted(() => {
  if (notifInterval) clearInterval(notifInterval)
})
</script>
