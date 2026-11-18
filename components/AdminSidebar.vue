<template>
  <div class="relative">
    <!-- Mobile / Tablet Backdrop Overlay -->
    <div 
      v-if="isOpen" 
      @click="$emit('close')"
      class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-fade-in"
    ></div>

    <!-- Navigation Drawer Aside (Sticky & Smooth Slide-out on Desktop/Tablet/Mobile) -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-screen select-none transition-all duration-300 ease-in-out lg:sticky lg:top-0 shrink-0 shadow-2xl lg:shadow-none overflow-hidden"
      :class="isOpen ? 'translate-x-0 lg:ml-0' : '-translate-x-full lg:-ml-72'"
    >
      <!-- Top Brand Section (Pinned at top of drawer) -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-spu-purple text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <span class="tracking-tighter">SPU</span>
          </div>
            <div>
              <span class="font-bold text-sm text-slate-900 leading-tight">Facility Fix</span>
              <p class="text-[11px] text-slate-400">SPU Facility Fix & Report</p>
            </div>
        </div>

        <!-- Close / Collapse Button (PanelLeftClose on Desktop, X on Mobile) -->
        <button 
          @click="$emit('close')" 
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Slide out / Collapse Drawer"
          aria-label="Close Drawer"
        >
          <PanelLeftClose class="w-5 h-5 hidden lg:block" />
          <X class="w-5 h-5 lg:hidden" />
        </button>
      </div>

      <!-- Navigation Menu (Scrolls internally without moving header/footer) -->
      <nav class="p-3 space-y-1 flex-1 overflow-y-auto">
        <NuxtLink 
          to="/admin" 
          @click="scrollToDashboard"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="isDashboardActive ? 'bg-spu-purple-50 text-spu-purple font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center gap-3 min-w-0">
            <LayoutDashboard class="w-4 h-4 shrink-0" :class="isDashboardActive ? 'text-spu-purple' : 'text-slate-400'" />
            <span class="whitespace-nowrap font-medium">{{ langStore.t('menuDashboard') }}</span>
          </div>
          <div v-if="isDashboardActive" class="w-1.5 h-4 bg-spu-purple rounded-full shrink-0"></div>
        </NuxtLink>

        <a 
          href="/admin#tickets" 
          @click="scrollToTickets"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
          :class="isTicketsActive ? 'bg-spu-purple-50 text-spu-purple font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center gap-3 min-w-0">
            <ClipboardList class="w-4 h-4 shrink-0" :class="isTicketsActive ? 'text-spu-purple' : 'text-slate-400'" />
            <span class="whitespace-nowrap font-medium">{{ langStore.t('menuTickets') }}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span v-if="activeTicketsCount > 0" class="bg-spu-pink-100 text-spu-pink text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              {{ activeTicketsCount }} {{ langStore.t('sidebarActiveBadge') }}
            </span>
            <div v-if="isTicketsActive" class="w-1.5 h-4 bg-spu-purple rounded-full shrink-0"></div>
          </div>
        </a>

        <!-- Database Explorer Link -->
        <NuxtLink 
          to="/admin/database" 
          @click="handleNavClick"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="route.path === '/admin/database' ? 'bg-spu-purple-50 text-spu-purple font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center gap-3 min-w-0">
            <Database class="w-4 h-4 shrink-0" :class="route.path === '/admin/database' ? 'text-spu-purple' : 'text-slate-400'" />
            <span class="whitespace-nowrap font-medium">{{ langStore.t('menuDatabase') }}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap">SQL</span>
            <div v-if="route.path === '/admin/database'" class="w-1.5 h-4 bg-spu-purple rounded-full shrink-0"></div>
          </div>
        </NuxtLink>

        <!-- Room QR Generator Page Link -->
        <NuxtLink 
          to="/admin/qr-generator" 
          @click="handleNavClick"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="route.path === '/admin/qr-generator' ? 'bg-spu-purple-50 text-spu-purple font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center gap-3 min-w-0">
            <QrCode class="w-4 h-4 shrink-0" :class="route.path === '/admin/qr-generator' ? 'text-spu-purple' : 'text-slate-400'" />
            <span class="whitespace-nowrap font-medium">{{ langStore.t('menuQrGenerator') }}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[10px] bg-spu-pink-50 text-spu-pink px-1.5 py-0.5 rounded font-bold whitespace-nowrap">Print</span>
            <div v-if="route.path === '/admin/qr-generator'" class="w-1.5 h-4 bg-spu-purple rounded-full shrink-0"></div>
          </div>
        </NuxtLink>

        <button 
          @click="$emit('alert-feature', langStore.t('menuTechnicians')); handleNavClick()" 
          type="button" 
          class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
        >
          <Users class="w-4 h-4 text-slate-400 shrink-0" />
          <span class="whitespace-nowrap">{{ langStore.t('menuTechnicians') }}</span>
        </button>

        <button 
          @click="$emit('alert-feature', langStore.t('menuSettings')); handleNavClick()" 
          type="button" 
          class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
        >
          <Settings class="w-4 h-4 text-slate-400 shrink-0" />
          <span class="whitespace-nowrap">{{ langStore.t('menuSettings') }}</span>
        </button>
      </nav>

      <!-- Bottom Profile & Switch View Section (Pinned at bottom of drawer) -->
      <div class="p-3 border-t border-slate-100 space-y-2 shrink-0 bg-white">
        <!-- Switch to Student/Mobile Portal Link -->
        <NuxtLink 
          to="/" 
          @click="handleNavClick"
          class="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-spu-purple bg-spu-purple-50 hover:bg-spu-purple-100 transition-colors"
        >
          <div class="flex items-center gap-2">
            <Smartphone class="w-4 h-4 text-spu-purple" />
            <span>{{ langStore.t('menuUserPortal') }}</span>
          </div>
          <ArrowUpRight class="w-3.5 h-3.5" />
        </NuxtLink>

        <!-- Admin Profile Card -->
        <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-spu-purple text-white flex items-center justify-center text-xs font-bold shrink-0">
              {{ (adminAuth.adminProfile.value?.name || 'SPU').slice(0, 2).toUpperCase() }}
            </div>
            <div class="truncate">
              <p class="text-xs font-bold text-slate-800 truncate">
                {{ adminAuth.adminProfile.value?.name || 'Facilities Director' }}
              </p>
              <p class="text-[10px] text-spu-pink font-semibold truncate">
                {{ adminAuth.adminProfile.value?.role || 'Sripatum Univ.' }}
              </p>
            </div>
          </div>
          <button 
            @click="$emit('logout'); handleNavClick()" 
            title="Sign out" 
            class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  LayoutDashboard, 
  ClipboardList, 
  QrCode, 
  Database, 
  Users, 
  Settings, 
  Smartphone, 
  ArrowUpRight, 
  LogOut,
  X,
  PanelLeftClose
} from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAppLang } from '~/composables/useAppLang'

const route = useRoute()
const router = useRouter()
const adminAuth = useAdminAuth()
const langStore = useAppLang()

const emit = defineEmits(['open-qr-gen', 'alert-feature', 'logout', 'close'])

defineProps({
  activeTicketsCount: {
    type: Number,
    default: 14
  },
  isOpen: {
    type: Boolean,
    default: true
  }
})

const activeTab = ref<'dashboard' | 'tickets' | 'other'>('dashboard')

const isDashboardActive = computed(() => {
  return route.path === '/admin' && activeTab.value === 'dashboard'
})

const isTicketsActive = computed(() => {
  return route.path === '/admin' && activeTab.value === 'tickets'
})

function scrollToTickets(e: Event) {
  e.preventDefault()
  activeTab.value = 'tickets'
  handleNavClick()
  if (route.path === '/admin') {
    const el = document.getElementById('tickets')
    if (el) {
      const topOffset = 80
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - topOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      if (typeof window !== 'undefined') {
        history.pushState(null, '', '/admin#tickets')
      }
    }
  } else {
    router.push('/admin#tickets')
  }
}

function scrollToDashboard(e: Event) {
  activeTab.value = 'dashboard'
  handleNavClick()
  if (route.path === '/admin') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (typeof window !== 'undefined' && window.location.hash) {
      history.pushState(null, '', '/admin')
    }
  }
}

function handleNavClick() {
  // Only close on mobile/tablet screen sizes
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    emit('close')
  }
}

let scrollListener: any = null

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (window.location.hash === '#tickets') {
      activeTab.value = 'tickets'
    }

    scrollListener = () => {
      if (route.path !== '/admin') return
      const el = document.getElementById('tickets')
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 250) {
          activeTab.value = 'tickets'
        } else {
          activeTab.value = 'dashboard'
        }
      }
    }

    window.addEventListener('scroll', scrollListener, { passive: true })
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#tickets') {
        activeTab.value = 'tickets'
      } else if (route.path === '/admin') {
        activeTab.value = 'dashboard'
      }
    })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && scrollListener) {
    window.removeEventListener('scroll', scrollListener)
  }
})

watch(() => route.path, (newPath) => {
  if (newPath !== '/admin') {
    activeTab.value = 'other'
  } else if (route.hash === '#tickets') {
    activeTab.value = 'tickets'
  } else {
    activeTab.value = 'dashboard'
  }
}, { immediate: true })
</script>
