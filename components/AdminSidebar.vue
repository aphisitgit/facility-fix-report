<template>
  <aside class="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
    <!-- Top Brand Section -->
    <div>
      <div class="p-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-spu-purple text-white flex items-center justify-center font-bold text-lg shadow-sm">
          <span class="tracking-tighter">SPU</span>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-sm text-slate-900 leading-tight">UniLoop SPU</span>
            <span class="bg-spu-pink-100 text-spu-pink-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">Admin Hub</span>
          </div>
          <p class="text-[11px] text-slate-400">Campus Facilities Ops</p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-3 space-y-1">
        <NuxtLink 
          to="/admin" 
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="route.path === '/admin' ? 'bg-spu-purple-50 text-spu-purple font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center gap-3">
            <LayoutDashboard class="w-4 h-4" :class="route.path === '/admin' ? 'text-spu-purple' : 'text-slate-400'" />
            <span>Dashboard & Analytics</span>
          </div>
          <div v-if="route.path === '/admin'" class="w-1.5 h-4 bg-spu-purple rounded-full"></div>
        </NuxtLink>

        <a 
          href="/admin#tickets" 
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <div class="flex items-center gap-3">
            <ClipboardList class="w-4 h-4 text-slate-400" />
            <span>Ticket Management</span>
          </div>
          <span class="bg-spu-pink-100 text-spu-pink text-[11px] font-bold px-2 py-0.5 rounded-full">
            {{ activeTicketsCount }} Active
          </span>
        </a>

        <!-- Database Explorer Link -->
        <NuxtLink 
          to="/admin/database" 
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="route.path === '/admin/database' ? 'bg-spu-purple-50 text-spu-purple font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center gap-3">
            <Database class="w-4 h-4" :class="route.path === '/admin/database' ? 'text-spu-purple' : 'text-slate-400'" />
            <span>Database Explorer</span>
          </div>
          <span class="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-mono font-bold">SQL</span>
        </NuxtLink>

        <button 
          @click="$emit('open-qr-gen')" 
          type="button" 
          class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
        >
          <QrCode class="w-4 h-4 text-slate-400" />
          <span>Room QR Generator</span>
        </button>

        <button 
          @click="$emit('alert-feature', 'Technicians & Zones')" 
          type="button" 
          class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
        >
          <Users class="w-4 h-4 text-slate-400" />
          <span>Technicians & Zones</span>
        </button>

        <button 
          @click="$emit('alert-feature', 'Settings')" 
          type="button" 
          class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
        >
          <Settings class="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Profile & Switch View Section -->
    <div class="p-3 border-t border-slate-100 space-y-2">
      <!-- Switch to Student/Mobile Portal Link -->
      <NuxtLink 
        to="/" 
        class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-spu-purple bg-spu-purple-50 hover:bg-spu-purple-100 transition-colors"
      >
        <div class="flex items-center gap-2">
          <Smartphone class="w-3.5 h-3.5" />
          <span>Go to Mobile User Portal</span>
        </div>
        <ArrowUpRight class="w-3.5 h-3.5" />
      </NuxtLink>

      <!-- Director Card -->
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-full bg-spu-purple text-white flex items-center justify-center text-xs font-bold shrink-0">
            SPU
          </div>
          <div class="truncate">
            <p class="text-xs font-semibold text-slate-800 truncate">Facilities Director</p>
            <p class="text-[10px] text-slate-400 truncate">Sripatum Univ.</p>
          </div>
        </div>
        <button 
          @click="$emit('logout')" 
          title="Sign out" 
          class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, 
  ClipboardList, 
  QrCode, 
  Database, 
  Users, 
  Settings, 
  Smartphone, 
  ArrowUpRight, 
  LogOut 
} from 'lucide-vue-next'

const route = useRoute()

defineProps({
  activeTicketsCount: {
    type: Number,
    default: 14
  }
})

defineEmits(['open-qr-gen', 'alert-feature', 'logout'])
</script>
