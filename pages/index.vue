<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 pb-24 md:pb-12">
    <!-- Responsive Main Wrapper (Mobile, iPad, Desktop) -->
    <div class="w-full max-w-md sm:max-w-xl md:max-w-5xl lg:max-w-7xl mx-auto min-h-screen bg-white/80 md:bg-white md:shadow-lg md:rounded-3xl md:my-6 md:border md:border-slate-200/80 flex flex-col overflow-hidden">
      
      <!-- Top Header (Responsive for Mobile, iPad, and Desktop) -->
      <header class="p-4 px-5 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-100 bg-white/95 sticky top-0 z-20 backdrop-blur-md">
        <!-- Logo and Brand -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-spu-purple text-white flex items-center justify-center font-extrabold text-xs shadow-sm group-hover:scale-105 transition-transform">
            SPU
          </div>
          <div>
            <h1 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Facility Fix & Report</h1>
            <p class="text-[10px] text-slate-400">{{ langStore.t('brandSubtitle') }}</p>
          </div>
        </NuxtLink>

        <!-- Desktop & iPad Navigation Links (Hidden on mobile) -->
        <nav class="hidden md:flex items-center gap-1.5 lg:gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/70">
          <NuxtLink 
            to="/" 
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-white text-spu-purple shadow-xs"
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
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all flex items-center gap-1.5"
          >
            <FileText class="w-3.5 h-3.5 text-slate-400" />
            <span>{{ langStore.t('myReports') }}</span>
            <span 
              v-if="activeReportsCount > 0" 
              class="ml-0.5 min-w-[16px] h-4 bg-spu-pink text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1"
            >
              {{ activeReportsCount }}
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

        <!-- Top Right Actions -->
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
            <span>{{ langStore.t('adminDashboard') }}</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Main Content (Responsive 2-column on iPad/Desktop) -->
      <main class="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        
        <!-- Campus Service Hub & Location Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-spu-pink-50/30 p-4 sm:p-5 rounded-3xl border border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-spu-pink shrink-0" />
              <h2 class="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">{{ langStore.t('serviceHub') }}</h2>
            </div>
            <p class="text-xs text-slate-500 mt-1">{{ langStore.t('serviceHubDesc') }}</p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink 
              to="/tracking"
              class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-colors"
              :class="isRoomScanned ? 'bg-spu-pink-50 border border-spu-pink-100 text-spu-pink hover:bg-spu-pink-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              <span class="w-2 h-2 rounded-full" :class="isRoomScanned ? 'bg-spu-pink animate-pulse' : 'bg-slate-400'"></span>
              <span>{{ isRoomScanned ? (langStore.currentLang.value === 'en' ? `In progress: ${activeReportsCount} in ${langStore.translateRoom(currentRoom)}` : `กำลังดำเนินการ ${activeReportsCount} รายการใน ${langStore.translateRoom(currentRoom)}`) : langStore.t('unscannedRoomTitle') }}</span>
            </NuxtLink>

            <button 
              @click="isQrModalOpen = true"
              type="button"
              class="md:hidden inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-spu-purple text-white shadow-xs"
            >
              <Camera class="w-3.5 h-3.5" />
              <span>{{ langStore.t('scanRoomQr') }}</span>
            </button>
          </div>
        </div>

        <!-- 2-Column Responsive Layout Grid (1-col on mobile, 2-col on iPad/Desktop) -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <!-- LEFT COLUMN (iPad: 5 cols, Desktop: 5 cols) -->
          <div class="md:col-span-5 space-y-6">
            
            <!-- SPECIAL ROOM-SPECIFIC QR SCANNED HUB (When a room QR is scanned) -->
            <div v-if="isRoomScanned" class="spu-gradient-hero rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-spu-purple-900/20 relative overflow-hidden space-y-4 animate-fade-in">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
                    <QrCode class="w-6 h-6" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-[10px] font-black uppercase text-pink-200 tracking-wider flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      {{ langStore.t('verifiedRoomTitle') }}
                    </span>
                    <h3 class="text-base sm:text-lg font-black leading-tight break-words">{{ langStore.translateRoom(currentRoom) }}</h3>
                  </div>
                </div>

                <!-- Exit room button -->
                <button 
                  @click="clearRoomFilter"
                  class="text-[10px] font-semibold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-xl transition-colors shrink-0"
                >
                  {{ langStore.t('changeLocation') }}
                </button>
              </div>

              <div class="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-white/80">{{ langStore.t('locationLabel') }}</span>
                  <span class="font-bold">{{ langStore.translateBuilding(currentBuilding) }} • {{ langStore.translateFloor(currentFloor || '1') }}</span>
                </div>
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-white/80">{{ langStore.t('repairHistoryLabel') }}</span>
                  <span class="font-bold text-pink-200">{{ roomReports.length }} {{ langStore.t('itemsInRoom') }}</span>
                </div>
              </div>

              <!-- Primary Report in This Room Button -->
              <button 
                @click="reportInThisRoom"
                class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-spu-pink to-spu-pink-400 text-white font-black text-xs shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Camera class="w-4 h-4" />
                <span>{{ langStore.t('reportInRoomNow') }} ▷</span>
              </button>
            </div>

            <!-- Quick Report via Room QR (Shown when no room is scanned yet) -->
            <div v-else class="spu-gradient-hero rounded-3xl p-6 text-white shadow-xl shadow-spu-purple-900/20 relative overflow-hidden group">
              <div class="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-2xl"></div>
              <div class="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-spu-pink/30 blur-xl"></div>

              <div class="relative z-10 flex flex-col items-center text-center">
                <div class="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mb-3 shadow-inner">
                  <QrCode class="w-7 h-7 text-white" />
                </div>

                <h3 class="text-base sm:text-lg font-extrabold tracking-tight">{{ langStore.t('quickReportTitle') }}</h3>
                <p class="text-xs text-white/80 mt-1.5 max-w-[280px] leading-relaxed">
                  {{ langStore.t('quickReportSubtitle') }}
                </p>

                <button 
                  @click="isQrModalOpen = true"
                  type="button"
                  class="mt-4 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-spu-pink to-spu-pink-400 text-white font-bold text-xs shadow-lg shadow-spu-pink-700/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Camera class="w-4 h-4" />
                  <span>{{ langStore.t('openQrScanner') }}</span>
                </button>
              </div>
            </div>

            <!-- Search Location Input (Shown if not in room mode) -->
            <div v-if="!isRoomScanned" class="space-y-2.5">
              <div class="relative">
                <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  v-model="searchQuery"
                  @keyup.enter="handleSearch"
                  type="text" 
                  :placeholder="langStore.t('searchPlaceholder')"
                  class="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-spu-purple/30 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                />
                <SlidersHorizontal class="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-slate-600" />
              </div>

              <!-- Quick Shortcuts Pills -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">{{ langStore.t('suggestedBuildings') }}</span>
                <button 
                  v-for="bldg in quickBuildings" 
                  :key="bldg.name"
                  @click="quickSelectLocation(bldg.name, bldg.room)"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-spu-purple-50 hover:text-spu-purple border border-slate-200/60 rounded-xl text-slate-600 font-medium whitespace-nowrap transition-colors"
                >
                  {{ bldg.name }}
                </button>
              </div>
            </div>

            <!-- Issue Categories Grid -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-xs sm:text-sm font-bold text-slate-900">{{ langStore.t('allCategories') }}</h3>
                <NuxtLink :to="isRoomScanned ? `/report?building=${encodeURIComponent(currentBuilding || '')}&floor=${encodeURIComponent(currentFloor || '1')}&room=${encodeURIComponent(currentRoom || '')}` : '/report'" class="text-[11px] font-semibold text-spu-pink hover:underline">
                  {{ langStore.t('viewAllCategories') }} &gt;
                </NuxtLink>
              </div>

              <div class="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-2.5">
                <button 
                  v-for="cat in mainCategories" 
                  :key="cat.name"
                  @click="selectCategoryAndReport(cat.name)"
                  class="p-2 sm:p-3 bg-slate-50/90 hover:bg-spu-purple-50/70 border border-slate-200/80 hover:border-spu-purple/40 rounded-2xl flex flex-col items-center justify-between gap-1.5 sm:gap-2 transition-all text-center group shadow-xs min-h-[92px]"
                >
                  <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0" :class="cat.colorClass">
                    <component :is="cat.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span class="text-[9.5px] sm:text-xs font-semibold text-slate-700 group-hover:text-spu-purple leading-tight line-clamp-2 min-h-[24px] sm:min-h-[28px] flex items-center justify-center break-keep">{{ cat.name }}</span>
                </button>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (iPad: 7 cols, Desktop: 7 cols) -->
          <div class="md:col-span-7 space-y-6">

            <!-- Campus Alert Banner -->
            <div v-if="announcement.enabled && showAlert" class="relative bg-gradient-to-r from-spu-pink-50 to-purple-50/60 border border-spu-pink-200/80 rounded-3xl p-4 sm:p-5 text-xs shadow-xs animate-fade-in">
              <button 
                @click="showAlert = false" 
                class="absolute top-3 right-3 text-spu-pink-600/70 hover:text-spu-pink-900 transition-colors"
                aria-label="ปิดประกาศ"
              >
                <X class="w-4 h-4" />
              </button>
              
              <div class="flex items-start gap-3 pr-6">
                <div class="p-2 rounded-2xl bg-spu-purple text-white shrink-0 mt-0.5 shadow-sm">
                  <Megaphone class="w-4 h-4" />
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-black uppercase text-spu-pink tracking-wider bg-white px-2 py-0.5 rounded-full border border-spu-pink-200">
                      {{ langStore.t('campusAnnouncement') }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium">{{ announcement.department }}</span>
                  </div>
                  <h4 class="font-extrabold text-slate-900 text-xs sm:text-sm">{{ announcement.title }}</h4>
                  <p class="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                    {{ announcement.message }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Campus Service Highlights (Visible on iPad & Desktop) -->
            <div class="hidden sm:grid grid-cols-3 gap-3">
              <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-purple-100 text-spu-purple flex items-center justify-center shrink-0">
                  <Clock class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-900">{{ langStore.t('statResponseTime') }}</p>
                  <p class="text-[10px] text-slate-500 truncate">{{ langStore.t('statResponseDesc') }}</p>
                </div>
              </div>

              <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-900">{{ langStore.t('statSuccessRate') }}</p>
                  <p class="text-[10px] text-slate-500 truncate">{{ langStore.t('statSuccessDesc') }}</p>
                </div>
              </div>

              <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-pink-100 text-spu-pink flex items-center justify-center shrink-0">
                  <Wrench class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-900">{{ langStore.t('statTechnicians') }}</p>
                  <p class="text-[10px] text-slate-500 truncate">{{ langStore.t('statTechniciansDesc') }}</p>
                </div>
              </div>
            </div>

            <!-- RECENT REPORTS / ROOM HISTORY (Filtered to this room if scanned!) -->
            <div class="space-y-3.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900">
                    {{ isRoomScanned ? (langStore.currentLang.value === 'en' ? `Repair History for ${langStore.translateRoom(currentRoom)}` : `ประวัติการแจ้งซ่อมของ ${langStore.translateRoom(currentRoom)}`) : langStore.t('recentCampusReports') }}
                  </h3>
                  <span class="w-2 h-2 rounded-full bg-spu-pink animate-pulse"></span>
                </div>
                
                <button 
                  v-if="isRoomScanned"
                  @click="clearRoomFilter"
                  class="text-[11px] font-semibold text-spu-purple hover:underline"
                >
                  {{ langStore.t('viewAllBuildings') }} &gt;
                </button>
                <NuxtLink v-else to="/tracking" class="text-[11px] font-semibold text-spu-pink hover:underline">
                  {{ langStore.t('viewAll') }} ({{ reports.length }}) &gt;
                </NuxtLink>
              </div>

              <!-- Empty State if no reports for this room -->
              <div 
                v-if="roomReports.length === 0" 
                class="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-2.5"
              >
                <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 class="w-6 h-6" />
                </div>
                <h4 class="text-sm font-bold text-slate-800">
                  {{ isRoomScanned ? langStore.t('noIssuesInRoom') : (langStore.currentLang.value === 'en' ? 'No Recent Issues Reported' : 'ไม่มีรายการแจ้งซ่อมในระบบขณะนี้') }}
                </h4>
                <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {{ isRoomScanned ? langStore.t('noIssuesInRoomDesc') : (langStore.currentLang.value === 'en' ? 'All facilities are currently operating normally across the campus.' : 'ระบบสาธารณูปโภคและอาคารสถานที่ทุกแห่งเปิดใช้งานได้ตามปกติ') }}
                </p>
              </div>

              <!-- List of Reports (Sub-grid on iPad and Desktop) -->
              <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                <div 
                  v-for="ticket in roomReports" 
                  :key="ticket.id"
                  @click="goToTicket(ticket.id)"
                  class="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-spu-purple/40 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-start gap-3 min-w-0">
                      <div class="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-600">
                        <component :is="getCategoryIcon(ticket.category)" class="w-4 h-4" />
                      </div>
                      <div class="min-w-0">
                        <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">{{ ticket.description }}</h4>
                        <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
                          <span class="truncate">{{ langStore.translateBuilding(ticket.building) }}, {{ langStore.translateRoom(ticket.room) }}</span>
                        </p>
                      </div>
                    </div>

                    <!-- Status Badge -->
                    <span 
                      class="text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0"
                      :class="getStatusBadgeClass(ticket.status)"
                    >
                      {{ formatStatus(ticket.status) }}
                    </span>
                  </div>

                  <!-- Card Bottom Metadata -->
                  <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    <div class="flex items-center gap-1">
                      <Clock class="w-3.5 h-3.5" />
                      <span>{{ formatTimestamp(ticket.created_at) }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="flex items-center gap-1 text-slate-600">
                        <ThumbsUp class="w-3.5 h-3.5 text-spu-pink" /> {{ ticket.likes || 12 }}
                      </span>
                      <span class="flex items-center gap-1 text-slate-600">
                        <MessageSquare class="w-3.5 h-3.5" /> {{ ticket.comments_count || 2 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <!-- Bottom Floating Nav (Only shown on mobile screen < md) -->
      <BottomNav :active-count="activeReportsCount" @open-qr="isQrModalOpen = true" />

      <!-- QR Scanner Modal -->
      <QrScannerModal :is-open="isQrModalOpen" @close="isQrModalOpen = false" @scanned="handleRoomScanned" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, 
  MapPin, 
  X, 
  Megaphone, 
  QrCode, 
  Camera, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  ThumbsUp, 
  MessageSquare,
  CheckCircle2,
  Fan,
  Lightbulb,
  Wrench,
  Tv,
  Lock,
  Home,
  Plus,
  FileText
} from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAnnouncement } from '~/composables/useAnnouncement'
import { useAppLang } from '~/composables/useAppLang'

const route = useRoute()
const router = useRouter()
const adminAuth = useAdminAuth()
const notif = useAdminNotifications()
const langStore = useAppLang()
const { announcement, initAnnouncement } = useAnnouncement()
const { 
  currentBuilding, 
  currentFloor, 
  currentRoom, 
  isRoomScanned, 
  initRoom, 
  setScannedRoom, 
  clearScannedRoom 
} = useScannedRoom()

const showAlert = ref(true)
const isQrModalOpen = ref(false)
const searchQuery = ref('')
const reports = ref<any[]>([])

// Filter reports to ONLY this room if room is scanned!
const roomReports = computed(() => {
  if (!isRoomScanned.value) return reports.value.slice(0, 4)
  const rm = currentRoom.value.toLowerCase().trim()
  return reports.value.filter(t => {
    const tRoom = (t.room || '').toLowerCase()
    return tRoom.includes(rm) || rm.includes(tRoom)
  })
})

// Active reports count for BottomNav badge: 0 if no room scanned, or count for this room
const activeReportsCount = computed(() => {
  if (!isRoomScanned.value) return 0
  return roomReports.value.filter(t => t.status !== 'RESOLVED').length
})

const quickBuildings = computed(() => {
  const isEn = langStore.currentLang.value === 'en'
  return [
    { name: isEn ? 'Building 11' : 'อาคาร 11', raw: 'Building 11', room: '11-502' },
    { name: isEn ? 'Building 5' : 'อาคาร 5', raw: 'Building 5', room: '5-301' },
    { name: isEn ? 'Central Library' : 'หอสมุดกลาง', raw: 'Central Library', room: isEn ? 'Floor 3' : 'ชั้น 3' },
    { name: isEn ? 'Cafeteria' : 'โรงอาหาร', raw: 'Cafeteria', room: isEn ? 'Floor 1' : 'ชั้น 1' }
  ]
})

const mainCategories = computed(() => [
  { name: langStore.t('catAir'), raw: 'เครื่องปรับอากาศ', icon: Fan, colorClass: 'text-sky-500' },
  { name: langStore.t('catElectric'), raw: 'ระบบไฟฟ้า/ไฟ', icon: Lightbulb, colorClass: 'text-amber-500' },
  { name: langStore.t('catPlumbing'), raw: 'สุขภัณฑ์/ประปา', icon: Wrench, colorClass: 'text-blue-500' },
  { name: langStore.t('catAv'), raw: 'โสตทัศน์/ห้องเรียน', icon: Tv, colorClass: 'text-spu-pink' }
])

function getCategoryIcon(cat: string) {
  if (!cat) return Tv
  const c = cat.toLowerCase()
  if (c.includes('air') || c.includes('แอร์') || c.includes('ปรับอากาศ')) return Fan
  if (c.includes('light') || c.includes('elec') || c.includes('ไฟ')) return Lightbulb
  if (c.includes('sanitary') || c.includes('สุขภัณฑ์') || c.includes('ประปา') || c.includes('ห้องน้ำ')) return Wrench
  return Tv
}

function getStatusBadgeClass(status: string) {
  if (status === 'IN_PROGRESS') return 'bg-spu-pink-100 text-spu-pink font-bold'
  if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-700 font-bold'
  return 'bg-amber-100 text-amber-700 font-bold'
}

function formatStatus(status: string) {
  const isEn = langStore.currentLang.value === 'en'
  if (status === 'IN_PROGRESS') return isEn ? 'In Progress' : 'กำลังดำเนินการ'
  if (status === 'RESOLVED') return isEn ? 'Resolved' : 'ซ่อมเสร็จสิ้น'
  return isEn ? 'Received' : 'รอดำเนินการ'
}

function formatTimestamp(ts: string) {
  const isEn = langStore.currentLang.value === 'en'
  if (!ts) return isEn ? 'Today, 10:15 AM' : 'วันนี้ 10:15 น.'
  const d = new Date(ts)
  if (isEn) {
    return 'Today, ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  return 'วันนี้ ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

function clearRoomFilter() {
  clearScannedRoom()
  router.push('/')
}

function handleRoomScanned(roomData: { building: string; floor: string; room: string }) {
  setScannedRoom(roomData.building, roomData.floor, roomData.room)
}

function reportInThisRoom() {
  router.push({
    path: '/report',
    query: {
      building: currentBuilding.value,
      floor: currentFloor.value,
      room: currentRoom.value
    }
  })
}

function quickSelectLocation(bldg: string, room: string) {
  setScannedRoom(bldg, '1', room)
  router.push({
    path: '/',
    query: {
      building: bldg,
      room: room
    }
  })
}

function selectCategoryAndReport(catName: string) {
  router.push({
    path: '/report',
    query: {
      building: isRoomScanned.value ? currentBuilding.value : undefined,
      floor: isRoomScanned.value ? currentFloor.value : undefined,
      room: isRoomScanned.value ? currentRoom.value : undefined,
      category: catName
    }
  })
}

function handleSearch() {
  if (searchQuery.value) {
    router.push({
      path: '/report',
      query: {
        search: searchQuery.value
      }
    })
  }
}

function goToTicket(id: string) {
  router.push(`/tracking?id=${id}`)
}

async function fetchRecentReports() {
  try {
    const res = await $fetch<any>('/api/reports')
    if (res.success && res.data) {
      reports.value = res.data
    }
  } catch (err) {
    console.error('Failed to load reports', err)
  }
}

onMounted(() => {
  initRoom()
  initAnnouncement()
  fetchRecentReports()
})
</script>
