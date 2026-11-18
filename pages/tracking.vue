<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 pb-24 md:pb-12">
    <!-- Responsive Main Wrapper -->
    <div class="w-full max-w-md sm:max-w-xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto min-h-screen bg-white/80 md:bg-white md:shadow-lg md:rounded-3xl md:my-6 md:border md:border-slate-200/80 flex flex-col overflow-hidden">
      
      <!-- Top Header -->
      <header class="p-4 px-5 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-100 bg-white/95 sticky top-0 z-20 backdrop-blur-md">
        <!-- Logo and Brand -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-spu-purple text-white flex items-center justify-center font-extrabold text-xs shadow-sm group-hover:scale-105 transition-transform">
            SPU
          </div>
          <div>
            <h1 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{{ langStore.t('brandTitle') }}</h1>
            <p class="text-[10px] text-slate-400">{{ langStore.t('trackingTitle') }}</p>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation Bar (Hidden on Mobile) -->
        <nav class="hidden md:flex items-center gap-1.5 lg:gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/70">
          <NuxtLink 
            to="/" 
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all flex items-center gap-1.5"
          >
            <Home class="w-3.5 h-3.5" />
            <span>{{ langStore.t('home') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/report" 
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all flex items-center gap-1.5"
          >
            <Plus class="w-3.5 h-3.5 text-spu-pink" />
            <span>{{ langStore.t('reportIssue') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/tracking" 
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-spu-purple shadow-xs transition-all flex items-center gap-1.5"
          >
            <FileText class="w-3.5 h-3.5 text-spu-purple" />
            <span>{{ langStore.t('myReports') }}</span>
            <span 
              v-if="filteredRoomTickets.length > 0" 
              class="ml-0.5 min-w-[16px] h-4 bg-spu-pink text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1"
            >
              {{ filteredRoomTickets.length }}
            </span>
          </NuxtLink>

          <button 
            @click="isQrModalOpen = true"
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-spu-purple to-spu-pink text-white shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Camera class="w-3.5 h-3.5" />
            <span>{{ langStore.t('scanRoomQr') }}</span>
          </button>
        </nav>

        <div class="flex items-center gap-1.5 sm:gap-2.5">
          <!-- Language Switcher (ไทย / ENG) -->
          <LanguageSwitcher />

          <!-- Notification Bell (Admin Only Restricted) -->
          <button 
            @click="notif.openNotificationCenter()"
            class="relative p-2 text-slate-500 hover:text-spu-purple rounded-full hover:bg-slate-100 transition-colors"
            :title="adminAuth.isAdmin.value ? 'Admin Notifications' : 'ศูนย์แจ้งเตือน (เฉพาะ Admin)'"
            aria-label="Notification Center"
          >
            <Bell class="w-4 h-4" />
            <span 
              v-if="adminAuth.isAdmin.value && notif.unreadCount.value > 0" 
              class="absolute top-1 right-1 min-w-[16px] h-4 bg-spu-pink text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse"
            >
              {{ notif.unreadCount.value }}
            </span>
            <span 
              v-else-if="!adminAuth.isAdmin.value"
              class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-spu-pink ring-2 ring-white"
            ></span>
          </button>

          <!-- Admin Portal Access (Password Protected) -->
          <button 
            v-if="!adminAuth.isAdmin.value"
            type="button"
            @click="adminAuth.openLoginModal('/admin', 'กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานส่วนควบคุม Admin')"
            class="text-[11px] bg-spu-purple/10 text-spu-purple hover:bg-spu-purple hover:text-white px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="ต้องมีรหัสผ่านเพื่อเข้าใช้งาน Admin"
          >
            <Lock class="w-3.5 h-3.5 text-spu-purple" />
            <span>{{ langStore.t('admin') }}</span>
          </button>

          <NuxtLink 
            v-else
            to="/admin" 
            class="text-[11px] bg-spu-purple text-white hover:bg-spu-purple/90 px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="ไปที่ระบบ Admin (เข้าสู่ระบบแล้ว)"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ langStore.t('admin') }}</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        
        <!-- Page Title & Status Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-spu-purple-50/30 p-4 sm:p-5 rounded-3xl border border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{{ langStore.t('trackingTitle') }}</h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-snug">
              {{ isRoomScanned 
                ? langStore.t('trackingSubtitleScanned', { room: currentRoom })
                : langStore.t('trackingSubtitleUnscanned')
              }}
            </p>
          </div>

          <!-- Room Badge (Shows total ONLY if room is scanned) -->
          <div class="flex items-center gap-2 shrink-0">
            <span 
              v-if="isRoomScanned"
              class="text-xs font-bold text-spu-pink bg-spu-pink-50 border border-spu-pink-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs animate-fade-in"
            >
              <FileCheck class="w-4 h-4" /> {{ langStore.t('itemsInRoomCount', { count: filteredRoomTickets.length }) }}
            </span>
            <span 
              v-else 
              class="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs"
            >
              <QrCode class="w-4 h-4 text-spu-pink" /> {{ langStore.t('pleaseScanRoomFirst') }}
            </span>
          </div>
        </div>

        <!-- SCENARIO 1: NO ROOM SCANNED YET (Responsive split layout on iPad/Desktop) -->
        <div v-if="!isRoomScanned" class="animate-fade-in">
          <div class="p-6 sm:p-8 lg:p-10 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <!-- Left Column: Camera Scanner Action -->
              <div class="md:col-span-5 text-center space-y-4">
                <div class="w-20 h-20 rounded-3xl spu-gradient-hero text-white flex items-center justify-center mx-auto shadow-xl shadow-spu-purple/25 ring-8 ring-spu-purple-50">
                  <QrCode class="w-10 h-10 stroke-[2.2]" />
                </div>

                <div class="space-y-1.5 max-w-sm mx-auto">
                  <h3 class="text-base sm:text-lg font-extrabold text-slate-900">{{ langStore.t('scanPromptTitle') }}</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">
                    {{ langStore.t('scanPromptDesc') }}
                  </p>
                </div>

                <!-- Primary Action: Open Real Camera Scanner -->
                <button 
                  @click="isQrModalOpen = true"
                  type="button"
                  class="w-full py-3.5 px-4 rounded-2xl spu-gradient-primary text-white font-extrabold text-xs shadow-lg shadow-spu-purple/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Camera class="w-4 h-4" />
                  <span>{{ langStore.t('openCameraScannerBtn') }}</span>
                </button>
              </div>

              <!-- Right Column: Quick Testing Presets -->
              <div class="md:col-span-7 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-spu-pink"></span>
                    <span>{{ langStore.t('orSelectTestRoom') }}</span>
                  </p>
                  <span class="text-[10px] text-slate-400">{{ langStore.t('testRoomLabel') }}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                  <button 
                    v-for="preset in testPresets" 
                    :key="preset.room"
                    @click="quickSelectRoom(preset)"
                    class="p-3 bg-white hover:bg-spu-purple-50 border border-slate-200/80 hover:border-spu-purple/40 rounded-xl transition-all group shadow-2xs"
                  >
                    <p class="text-xs font-bold text-slate-800 group-hover:text-spu-purple truncate">{{ langStore.translateBuilding(preset.building) }} • {{ langStore.translateFloor(preset.floor) }}</p>
                    <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ langStore.translateRoom(preset.room) }}</p>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- SCENARIO 2: ROOM HAS BEEN SCANNED -->
        <div v-else class="space-y-6 animate-fade-in">
          
          <!-- Verified Room Location Card -->
          <div class="spu-gradient-hero rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-spu-purple-900/20 relative overflow-hidden space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
                  <QrCode class="w-6 h-6" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] font-black uppercase text-pink-200 tracking-wider flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {{ langStore.t('verifiedRoomTitle') }}
                  </span>
                  <h3 class="text-base sm:text-xl font-black text-white leading-tight truncate mt-0.5">{{ langStore.translateRoom(currentRoom) }}</h3>
                </div>
              </div>

              <!-- Switch Room Button & Add Issue in Room -->
              <div class="flex items-center gap-2 shrink-0">
                <button 
                  @click="clearScannedRoom"
                  class="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl transition-colors"
                >
                  {{ langStore.t('scanOtherRoomBtn') }}
                </button>

                <NuxtLink 
                  :to="`/report?building=${encodeURIComponent(currentBuilding)}&floor=${encodeURIComponent(currentFloor)}&room=${encodeURIComponent(currentRoom)}`"
                  class="text-xs font-bold bg-gradient-to-r from-spu-pink to-spu-pink-400 text-white px-3.5 py-2 rounded-xl shadow hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>{{ langStore.t('reportInThisRoomBtn') }}</span>
                </NuxtLink>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-white/15 text-xs">
              <div class="flex items-center gap-1 text-white/90">
                <MapPin class="w-3.5 h-3.5 text-pink-300" />
                <span>{{ langStore.translateBuilding(currentBuilding) }} • {{ langStore.translateFloor(currentFloor || '1') }}</span>
              </div>
              <span class="text-pink-200 text-xs font-medium">{{ langStore.t('syncedRoomLogs') }}</span>
            </div>
          </div>

          <!-- Filter Tabs for Scanned Room -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            <button 
              @click="activeFilter = 'ALL'"
              class="px-4 py-2 rounded-full transition-all shrink-0"
              :class="activeFilter === 'ALL' 
                ? 'bg-spu-purple text-white shadow-sm font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ langStore.t('filterAll') }} <span class="ml-1 opacity-80 text-[10px] font-bold">{{ roomTickets.length }}</span>
            </button>

            <button 
              @click="activeFilter = 'IN_PROGRESS'"
              class="px-4 py-2 rounded-full transition-all shrink-0"
              :class="activeFilter === 'IN_PROGRESS' 
                ? 'bg-spu-purple text-white shadow-sm ring-2 ring-spu-pink/40 font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ langStore.t('filterWorking') }} <span class="ml-1 opacity-80 text-[10px] font-bold">{{ inProgressCount }}</span>
            </button>

            <button 
              @click="activeFilter = 'ASSIGNED'"
              class="px-4 py-2 rounded-full transition-all shrink-0"
              :class="activeFilter === 'ASSIGNED' 
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ langStore.t('filterAssigned') }} <span class="ml-1 opacity-80 text-[10px] font-bold">{{ assignedCount }}</span>
            </button>

            <button 
              @click="activeFilter = 'PENDING'"
              class="px-4 py-2 rounded-full transition-all shrink-0"
              :class="activeFilter === 'PENDING' 
                ? 'bg-spu-purple text-white shadow-sm font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ langStore.t('filterReceived') }} <span class="ml-1 opacity-80 text-[10px] font-bold">{{ pendingCount }}</span>
            </button>

            <button 
              @click="activeFilter = 'RESOLVED'"
              class="px-4 py-2 rounded-full transition-all shrink-0"
              :class="activeFilter === 'RESOLVED' 
                ? 'bg-spu-purple text-white shadow-sm font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ langStore.t('filterResolved') }} <span class="ml-1 opacity-80 text-[10px] font-bold">{{ resolvedCount }}</span>
            </button>
          </div>

          <!-- Empty State for Scanned Room (No tickets for this room) -->
          <div 
            v-if="filteredRoomTickets.length === 0" 
            class="p-10 bg-white border border-slate-200/90 rounded-3xl text-center space-y-3 shadow-xs"
          >
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 class="w-7 h-7" />
            </div>
            <div>
              <h4 class="text-base font-bold text-slate-800">{{ langStore.t('noHistoryInRoom') }}</h4>
              <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {{ langStore.t('noHistoryInRoomDesc', { room: currentRoom }) }}
              </p>
            </div>
            <NuxtLink 
              :to="`/report?building=${encodeURIComponent(currentBuilding)}&floor=${encodeURIComponent(currentFloor)}&room=${encodeURIComponent(currentRoom)}`"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-spu-purple text-white text-xs font-bold hover:bg-spu-purple-700 transition-colors shadow-xs"
            >
              <Plus class="w-4 h-4" />
              <span>{{ langStore.t('reportIssueInRoom') }}</span>
            </NuxtLink>
          </div>

          <!-- Tickets Grid (Responsive 1-col on mobile, 2-col on iPad, 3-col on Desktop) -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            <div 
              v-for="ticket in filteredRoomTickets" 
              :key="ticket.id"
              class="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-3.5 relative overflow-hidden transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <!-- Top Gradient Accent line -->
                <div 
                  class="absolute top-0 left-0 right-0 h-1.5"
                  :class="ticket.status === 'IN_PROGRESS' ? 'spu-gradient-hero' : (ticket.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-400')"
                ></div>

                <!-- Card Header -->
                <div class="flex items-start justify-between gap-2 pt-0.5">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-extrabold text-slate-900">{{ formatTicketId(ticket.id) }}</span>
                      <span class="text-slate-300">•</span>
                      <span class="text-[11px] text-slate-400 font-medium">{{ formatRelativeTime(ticket.created_at) }}</span>
                    </div>
                    <p class="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin class="w-3.5 h-3.5 text-spu-pink shrink-0" />
                      <span class="truncate">{{ langStore.translateBuilding(ticket.building) }}, {{ langStore.translateFloor(ticket.floor) }}, {{ langStore.translateRoom(ticket.room) }}</span>
                    </p>
                  </div>

                  <!-- Status Badge -->
                  <span 
                    class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                    :class="getStatusBadgeClass(ticket.status)"
                  >
                    {{ formatStatus(ticket.status) }}
                  </span>
                </div>

                <!-- Content Thumbnail + Description -->
                <div class="flex items-start gap-3 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 mt-3">
                  <div class="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <img :src="ticket.image_before_url" alt="Ticket" class="w-full h-full object-cover" />
                    <span class="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center font-bold py-0.5">
                      {{ langStore.t('photoBefore') }}
                    </span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1 text-[11px] font-bold text-spu-purple mb-0.5">
                      <span>{{ getCategoryEmoji(ticket.category) }}</span>
                      <span>{{ langStore.translateCategory(ticket.category) }}</span>
                    </div>
                    <p class="text-xs text-slate-700 font-medium line-clamp-2 leading-snug">
                      {{ ticket.description }}
                    </p>
                    <div v-if="ticket.assigned_tech" class="flex items-center gap-1.5 text-[11px] text-slate-700 bg-spu-pink-50/70 border border-spu-pink/20 px-2 py-1 rounded-xl mt-1.5 font-bold">
                      <Wrench class="w-3.5 h-3.5 text-spu-pink shrink-0" />
                      <span class="truncate">{{ langStore.t('techPrefix') }}<strong class="text-spu-purple">{{ ticket.assigned_tech }}</strong></span>
                    </div>
                  </div>
                </div>

                <!-- Workflow Progress Stepper (Step 1 to 4) -->
                <div class="space-y-1.5 px-1 mt-3">
                  <div class="flex items-center justify-between text-[11px] font-bold">
                    <span class="text-slate-800">{{ langStore.t('stepWorkflow') }}</span>
                    <span class="text-spu-pink font-extrabold text-[10px]">{{ getStepLabel(ticket.status) }}</span>
                  </div>

                  <!-- Visual Stepper Progress Line & Dots -->
                  <div class="relative flex items-center justify-between pt-2 pb-1">
                    <!-- Background Connection Line -->
                    <div class="absolute left-3 right-3 top-4 h-0.5 bg-slate-200 -z-0"></div>
                    <!-- Active Progress Line -->
                    <div 
                      class="absolute left-3 top-4 h-0.5 bg-spu-purple -z-0 transition-all duration-500"
                      :style="{ width: getStepLineWidth(ticket.status) }"
                    ></div>

                    <!-- Step 1: Received -->
                    <div class="flex flex-col items-center gap-1 z-10">
                      <div class="w-5 h-5 rounded-full bg-spu-purple text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                        <Check class="w-3 h-3 stroke-[3]" />
                      </div>
                      <span class="text-[8.5px] sm:text-[9.5px] font-bold text-slate-700 text-center tracking-tight leading-tight max-w-[64px] sm:max-w-none break-keep">{{ langStore.t('stepReceived') }}</span>
                    </div>

                    <!-- Step 2: Assigned -->
                    <div class="flex flex-col items-center gap-1 z-10">
                      <div 
                        class="w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white"
                        :class="ticket.status !== 'PENDING' ? 'bg-spu-purple text-white' : 'bg-slate-200 text-slate-400'"
                      >
                        <Check v-if="ticket.status !== 'PENDING'" class="w-3 h-3 stroke-[3]" />
                        <Clock v-else class="w-3 h-3" />
                      </div>
                      <span class="text-[8.5px] sm:text-[9.5px] font-bold text-center tracking-tight leading-tight max-w-[64px] sm:max-w-none break-keep" :class="ticket.status !== 'PENDING' ? 'text-slate-700' : 'text-slate-400'">
                        {{ langStore.t('stepAssigned') }}
                      </span>
                    </div>

                    <!-- Step 3: Working -->
                    <div class="flex flex-col items-center gap-1 z-10">
                      <div 
                        class="w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white"
                        :class="ticket.status === 'RESOLVED' 
                          ? 'bg-spu-purple text-white' 
                          : (ticket.status === 'IN_PROGRESS' ? 'bg-spu-pink text-white ring-spu-pink/30' : 'bg-slate-200 text-slate-400')"
                      >
                        <Check v-if="ticket.status === 'RESOLVED'" class="w-3 h-3 stroke-[3]" />
                        <Wrench v-else-if="ticket.status === 'IN_PROGRESS'" class="w-3 h-3" />
                        <span v-else class="text-[9px] font-bold">3</span>
                      </div>
                      <span class="text-[8.5px] sm:text-[9.5px] font-bold text-center tracking-tight leading-tight max-w-[64px] sm:max-w-none break-keep" :class="ticket.status === 'IN_PROGRESS' ? 'text-spu-pink font-extrabold' : (ticket.status === 'RESOLVED' ? 'text-slate-700' : 'text-slate-400')">
                        {{ langStore.t('stepWorking') }}
                      </span>
                    </div>

                    <!-- Step 4: Resolved -->
                    <div class="flex flex-col items-center gap-1 z-10">
                      <div 
                        class="w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white"
                        :class="ticket.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'"
                      >
                        <Check v-if="ticket.status === 'RESOLVED'" class="w-3 h-3 stroke-[3]" />
                        <span v-else class="text-[9px] font-bold">4</span>
                      </div>
                      <span class="text-[8.5px] sm:text-[9.5px] font-bold text-center tracking-tight leading-tight max-w-[64px] sm:max-w-none break-keep" :class="ticket.status === 'RESOLVED' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'">
                        {{ langStore.t('stepResolved') }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Technician Update Callout (For In Progress) -->
                <div 
                  v-if="ticket.status === 'IN_PROGRESS'" 
                  class="p-2.5 bg-spu-pink-50 border border-spu-pink-100 rounded-2xl flex items-start gap-2 text-xs text-spu-pink-900 mt-2"
                >
                  <Info class="w-4 h-4 text-spu-pink shrink-0 mt-0.5" />
                  <p class="text-[11px] leading-snug">
                    <span class="font-bold">{{ langStore.t('techUpdate') }}</span> {{ langStore.t('techWorkingDesc') }}
                  </p>
                </div>
              </div>

              <!-- Card Bottom Action Buttons -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <!-- When Resolved: Show View Before / After button and Rating -->
                <template v-if="ticket.status === 'RESOLVED'">
                  <button 
                    @click="openBeforeAfter(ticket)"
                    class="px-3.5 py-2 bg-spu-purple-50 hover:bg-spu-purple text-spu-purple hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>{{ langStore.t('viewBeforeAfter') }}</span>
                  </button>
                  <div class="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                    <span>{{ langStore.t('ratingScore') }}</span>
                    <span>★★★★★</span>
                  </div>
                </template>

                <!-- When In Progress: Show Photos and Contact Tech -->
                <template v-else-if="ticket.status === 'IN_PROGRESS'">
                  <button 
                    @click="openBeforeAfter(ticket)"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Camera class="w-3.5 h-3.5" />
                    <span>{{ langStore.t('photos') }}</span>
                  </button>
                  <button 
                    @click="contactTech(ticket)"
                    class="px-3.5 py-1.5 spu-gradient-primary text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare class="w-3.5 h-3.5" />
                    <span>{{ langStore.t('contactTechnician') }}</span>
                  </button>
                </template>

                <!-- When Assigned: Show Tech assigned note -->
                <template v-else-if="ticket.status === 'ASSIGNED'">
                  <div class="flex items-center gap-1 text-[11px] text-blue-700 font-medium">
                    <Clock class="w-3 h-3 text-blue-600 shrink-0" />
                    <span class="truncate">{{ langStore.t('techPreparing') }}</span>
                  </div>
                  <button 
                    @click="contactTech(ticket)"
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare class="w-3.5 h-3.5" />
                    <span>{{ langStore.t('contactTechnician') }}</span>
                  </button>
                </template>

                <!-- When Pending: Estimated review notice -->
                <template v-else>
                  <span class="text-[10px] text-slate-400 font-medium">{{ langStore.t('estArrival') }}</span>
                  <button 
                    @click="addDetails(ticket)"
                    class="text-xs font-bold text-spu-purple hover:underline"
                  >
                    {{ langStore.t('viewDetails') }}
                  </button>
                </template>
              </div>

            </div>
          </div>
        </div>

      </main>

      <!-- Bottom Nav (Counts only active tickets for scanned room, or 0 if none) -->
      <BottomNav 
        :active-count="isRoomScanned ? (inProgressCount + pendingCount) : 0" 
        @open-qr="isQrModalOpen = true" 
      />

      <!-- Before/After Modal -->
      <BeforeAfterModal 
        :is-open="isBeforeAfterOpen" 
        :ticket="selectedTicket" 
        @close="isBeforeAfterOpen = false" 
      />

      <!-- Real Camera QR Scanner Modal -->
      <QrScannerModal 
        :is-open="isQrModalOpen" 
        @close="isQrModalOpen = false"
        @scanned="handleRoomScanned"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Bell, 
  MapPin, 
  FileCheck, 
  Wrench, 
  Check, 
  Clock, 
  Info, 
  Eye, 
  Camera, 
  MessageSquare, 
  QrCode, 
  CheckCircle2, 
  Lock,
  Home,
  Plus,
  FileText
} from 'lucide-vue-next'
import { useScannedRoom } from '~/composables/useScannedRoom'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAppLang } from '~/composables/useAppLang'

const langStore = useAppLang()
const adminAuth = useAdminAuth()
const notif = useAdminNotifications()
const tickets = ref<any[]>([])
const activeFilter = ref<'ALL' | 'IN_PROGRESS' | 'ASSIGNED' | 'PENDING' | 'RESOLVED'>('ALL')
const isBeforeAfterOpen = ref(false)
const selectedTicket = ref<any>(null)
const isQrModalOpen = ref(false)

const { 
  currentBuilding, 
  currentFloor, 
  currentRoom, 
  isRoomScanned, 
  initRoom, 
  setScannedRoom, 
  clearScannedRoom 
} = useScannedRoom()

const testPresets = computed(() => [
  { building: 'Building 11', floor: '5', room: '11-502 (Multimedia Lab)' },
  { building: 'Building 5', floor: '3', room: '5-301 (Smart Seminar Hall)' },
  { building: 'Central Library', floor: '3', room: '3rd Floor Quiet Zone' },
  { building: 'Building 9', floor: '4', room: 'Lab 9-401 (Robotics Lab)' }
])

// Filter tickets ONLY for the currently scanned room!
const roomTickets = computed(() => {
  if (!isRoomScanned.value) return []
  const q = currentRoom.value.toLowerCase().trim()
  return tickets.value.filter(t => {
    const tRoom = (t.room || '').toLowerCase()
    return tRoom.includes(q) || q.includes(tRoom)
  })
})

const filteredRoomTickets = computed(() => {
  if (activeFilter.value === 'ALL') return roomTickets.value
  return roomTickets.value.filter(t => t.status === activeFilter.value)
})

const inProgressCount = computed(() => roomTickets.value.filter(t => t.status === 'IN_PROGRESS').length)
const assignedCount = computed(() => roomTickets.value.filter(t => t.status === 'ASSIGNED').length)
const pendingCount = computed(() => roomTickets.value.filter(t => t.status === 'PENDING').length)
const resolvedCount = computed(() => roomTickets.value.filter(t => t.status === 'RESOLVED').length)

function quickSelectRoom(preset: { building: string; floor: string; room: string }) {
  setScannedRoom(preset.building, preset.floor, preset.room)
}

function handleRoomScanned(roomData: { building: string; floor: string; room: string }) {
  setScannedRoom(roomData.building, roomData.floor, roomData.room)
}

function getStatusBadgeClass(status: string) {
  if (status === 'IN_PROGRESS') return 'bg-spu-pink-100 text-spu-pink'
  if (status === 'ASSIGNED') return 'bg-blue-100 text-blue-700'
  if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-700'
  return 'bg-amber-100 text-amber-700'
}

function formatStatus(status: string) {
  if (status === 'IN_PROGRESS') return langStore.t('statusWorking')
  if (status === 'ASSIGNED') return langStore.t('statusAssigned')
  if (status === 'RESOLVED') return langStore.t('statusResolved')
  return langStore.t('statusPending')
}

function formatRelativeTime(ts: string) {
  if (!ts) return langStore.currentLang.value === 'en' ? 'Just now' : 'เมื่อสักครู่'
  const d = new Date(ts)
  if (langStore.currentLang.value === 'en') {
    return 'Today at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  return 'วันนี้ ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

function getCategoryEmoji(cat: string) {
  if (cat.includes('Air') || cat.includes('ปรับอากาศ') || cat.includes('แอร์')) return '❄️'
  if (cat.includes('Light') || cat.includes('Elec') || cat.includes('ไฟ')) return '💡'
  if (cat.includes('Sanitary') || cat.includes('สุขภัณฑ์') || cat.includes('ประปา')) return '🚰'
  if (cat.includes('Desk') || cat.includes('โต๊ะ')) return '🪑'
  return '💻'
}

function getStepLabel(status: string) {
  const isEn = langStore.currentLang.value === 'en'
  if (status === 'RESOLVED') return isEn ? 'Step 4 of 4 • Resolved' : 'ขั้นตอนที่ 4 จาก 4 • ซ่อมเสร็จสิ้น'
  if (status === 'IN_PROGRESS') return isEn ? 'Step 3 of 4 • Technician Working On-site' : 'ขั้นตอนที่ 3 จาก 4 • ช่างกำลังซ่อมในพื้นที่'
  if (status === 'ASSIGNED') return isEn ? 'Step 2 of 4 • Assigned to Tech' : 'ขั้นตอนที่ 2 จาก 4 • มอบหมายช่างแล้ว'
  return isEn ? 'Step 1 of 4 • Ticket Received' : 'ขั้นตอนที่ 1 จาก 4 • รับเรื่องแล้ว'
}

function getStepLineWidth(status: string) {
  if (status === 'RESOLVED') return '100%'
  if (status === 'IN_PROGRESS') return '66%'
  if (status === 'ASSIGNED') return '33%'
  return '0%'
}

function openBeforeAfter(ticket: any) {
  selectedTicket.value = ticket
  isBeforeAfterOpen.value = true
}

function contactTech(ticket: any) {
  alert(`Connecting to Technician: ${ticket.assigned_tech || 'Somchai K.'} via SPU Campus Line...`)
}

function formatTicketId(id: string) {
  if (!id) return ''
  return id.startsWith('Ticket') || id.startsWith('#') ? id : `#${id}`
}

function addDetails(ticket: any) {
  alert(`Adding extra notes or photos to ${formatTicketId(ticket.id)}...`)
}

async function fetchTickets() {
  try {
    const res = await $fetch<any>('/api/reports')
    if (res.success && res.data) {
      tickets.value = res.data
    }
  } catch (err) {
    console.error('Failed to load tickets', err)
  }
}

let trackingInterval: any = null

onMounted(() => {
  initRoom()
  fetchTickets()

  // Auto-refresh ticket status for users on mobile/tablet (every 10s)
  trackingInterval = setInterval(fetchTickets, 10000)
})

onUnmounted(() => {
  if (trackingInterval) clearInterval(trackingInterval)
})
</script>
