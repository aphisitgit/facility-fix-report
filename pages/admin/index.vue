<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Left Sidebar (Desktop + Mobile/Tablet Drawer) -->
    <AdminSidebar 
      :active-tickets-count="activeCount" 
      :is-open="adminSidebar.isSidebarOpen.value"
      @close="adminSidebar.close()"
      @open-qr-gen="isQrGenOpen = true"
      @alert-feature="featureAlert"
      @logout="adminAuth.logout()"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 flex flex-col transition-all duration-300">
      
      <!-- Top Navigation Bar -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
        <!-- Navigation Drawer Toggle Button (Desktop & Mobile) -->
        <button 
          @click="adminSidebar.toggle()" 
          type="button"
          class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center"
          :title="adminSidebar.isSidebarOpen.value ? 'ปิดแถบเมนูด้านข้าง' : 'เปิดแถบเมนูด้านข้าง'"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu class="w-5 h-5" />
        </button>

        <!-- Search & Campus Selector -->
        <div class="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="tableSearch"
              type="text" 
              :placeholder="langStore.t('adminSearchPlaceholder')"
              class="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 transition-all"
            />
          </div>

          <!-- Campus Selector (Desktop/Tablet) -->
          <div class="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shrink-0">
            <Building2 class="w-3.5 h-3.5 text-spu-purple" />
            <span>{{ langStore.t('adminCampusSelector') }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <!-- Top Right Actions -->
        <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <!-- Announcement Management Button -->
          <button 
            @click="isAnnouncementModalOpen = true"
            class="px-2.5 sm:px-3.5 py-2 border border-spu-pink-200 bg-spu-pink-50 hover:bg-spu-pink-100 text-spu-pink-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            :title="langStore.t('editAnnouncement')"
          >
            <Megaphone class="w-3.5 h-3.5 text-spu-pink shrink-0" />
            <span class="hidden lg:inline">{{ langStore.t('adminCentralAnnouncement') }}</span>
          </button>

          <button 
            @click="exportCSV" 
            class="px-2.5 sm:px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            title="Export CSV"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span class="hidden lg:inline">{{ langStore.t('adminExportCsv') }}</span>
          </button>

          <!-- Clear All Data Button -->
          <button 
            @click="clearAllData" 
            class="px-2.5 sm:px-3 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            :title="langStore.currentLang.value === 'en' ? 'Clear All Data & Stats' : 'ล้างข้อมูล Ticket และสถิติทั้งหมด'"
          >
            <Trash2 class="w-3.5 h-3.5 text-rose-500" />
            <span class="hidden xl:inline">{{ langStore.currentLang.value === 'en' ? 'Clear All Data' : 'ล้างสถิติทั้งหมด' }}</span>
          </button>

          <button 
            @click="router.push('/report')"
            class="px-3 sm:px-4 py-2 spu-gradient-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-spu-purple/20 hover:opacity-95 transition-all"
          >
            <Plus class="w-3.5 h-3.5" />
            <span class="hidden xs:inline sm:inline">{{ langStore.t('adminNewOrder') }}</span>
          </button>

          <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>

          <!-- Language Switcher (ไทย / ENG) -->
          <LanguageSwitcher />

          <button 
            @click="notif.openNotificationCenter()"
            class="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            title="Admin Notifications"
            aria-label="Admin Notifications"
          >
            <Bell class="w-4 h-4" />
            <span 
              v-if="notif.unreadCount.value > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-spu-pink text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse"
            >
              {{ notif.unreadCount.value }}
            </span>
          </button>

          <!-- User Profile -->
          <div class="flex items-center gap-2 pl-1 sm:pl-2">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Praew" 
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-spu-purple/20"
            />
            <div class="text-left hidden xl:block">
              <p class="text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">
                {{ adminAuth.adminProfile.value?.name || 'Praew Suksom' }}
              </p>
              <p class="text-[10px] text-spu-pink font-semibold truncate max-w-[150px]">
                {{ adminAuth.adminProfile.value?.role || 'Operations Director' }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Body -->
      <main class="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        
        <!-- Header Banner & SLA Action -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-black uppercase text-spu-pink tracking-wider bg-spu-pink-50 border border-spu-pink-100 px-2 py-0.5 rounded-full">
                {{ langStore.t('adminSubtitle') }}
              </span>
              <span class="text-slate-300">•</span>
              <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {{ langStore.t('adminLiveConnected') }}
              </span>
            </div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ langStore.t('adminMainTitle') }}</h1>
            <p class="text-xs text-slate-500 mt-1 max-w-2xl">
              {{ langStore.t('adminMainDesc') }}
            </p>
          </div>

          <div class="flex items-center gap-2.5 shrink-0">
            <select v-model="selectedMonth" class="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 shadow-xs focus:outline-none">
              <option value="OCT">{{ langStore.t('adminMonthCurrent') }}</option>
              <option value="SEP">{{ langStore.t('adminMonthPrev') }}</option>
              <option value="TERM">{{ langStore.t('adminMonthTerm') }}</option>
            </select>

            <select v-model="selectedBuildingFilter" class="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 shadow-xs focus:outline-none">
              <option value="ALL">{{ langStore.t('adminAllBuildings') }}</option>
              <option value="Building 11">{{ langStore.t('adminBuilding11') }}</option>
              <option value="Building 9">{{ langStore.t('adminBuilding9') }}</option>
              <option value="Building 5">{{ langStore.t('adminBuilding5') }}</option>
              <option value="Central Library">{{ langStore.t('adminCentralLibrary') }}</option>
            </select>

            <button 
              @click="generateSlaReport" 
              class="px-4 py-2.5 bg-gradient-to-r from-spu-purple via-spu-purple-700 to-spu-pink text-white text-xs font-bold rounded-xl shadow-md shadow-spu-purple/20 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <FileSpreadsheet class="w-4 h-4" />
              <span>{{ langStore.t('adminGenerateSla') }}</span>
            </button>
          </div>
        </div>

        <!-- Live Campus Announcement Status Bar in Admin -->
        <div class="p-4 bg-gradient-to-r from-spu-pink-50/70 via-white to-purple-50/60 border border-spu-pink-200/80 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div class="flex items-start sm:items-center gap-3 min-w-0">
            <div class="p-2.5 rounded-2xl bg-spu-pink text-white shrink-0 shadow-2xs">
              <Megaphone class="w-4 h-4" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[10px] font-black uppercase text-spu-pink bg-white px-2 py-0.5 rounded-full border border-spu-pink-200">
                  {{ langStore.t('adminCentralAnnouncement') }}
                </span>
                <span class="text-[11px] font-semibold text-slate-500">{{ announcement.department }}</span>
                <span 
                  class="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  :class="announcement.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                >
                  {{ announcement.enabled ? (langStore.currentLang.value === 'en' ? '● Published on Home' : '● กำลังเผยแพร่หน้าหลัก') : (langStore.currentLang.value === 'en' ? '○ Hidden' : '○ ปิดการแสดงผล') }}
                </span>
              </div>
              <p class="text-xs font-bold text-slate-900 truncate mt-1">{{ announcement.title }}</p>
              <p class="text-[11px] text-slate-500 truncate max-w-2xl">{{ announcement.message }}</p>
            </div>
          </div>

          <button 
            @click="isAnnouncementModalOpen = true"
            class="px-4 py-2 bg-white hover:bg-spu-pink hover:text-white border border-spu-pink-200 text-spu-pink-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-2xs self-end sm:self-center"
          >
            <Edit3 class="w-3.5 h-3.5" />
            <span>{{ langStore.t('editAnnouncement') }}</span>
          </button>
        </div>

        <!-- 4 KPI Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Total Reports -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">{{ langStore.t('adminTotalReportsMonth') }}</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">{{ stats?.kpis?.totalReportsThisMonth ?? 0 }}</h3>
                  <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingUp class="w-3 h-3" /> {{ stats?.kpis?.monthlyIncrease || '0%' }}
                  </span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-spu-purple-50 text-spu-purple flex items-center justify-center">
                <ClipboardCheck class="w-5 h-5" />
              </div>
            </div>

            <!-- Mini Sparkline Graph -->
            <div class="h-8 mt-3 flex items-end gap-1">
              <div v-for="(h, i) in (stats?.kpis?.totalReportsThisMonth ? [40, 55, 35, 60, 48, 70, 85, 95] : [10, 10, 10, 10, 10, 10, 10, 10])" :key="i" 
                   class="flex-1 rounded-t transition-all"
                   :class="stats?.kpis?.totalReportsThisMonth ? 'bg-spu-pink/30 hover:bg-spu-pink' : 'bg-slate-100'"
                   :style="{ height: `${h}%` }"></div>
            </div>

            <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span class="flex items-center gap-1 font-semibold text-spu-pink">
                <span class="w-1.5 h-1.5 rounded-full bg-spu-pink"></span>
                {{ langStore.t('adminUrgentCases', { count: stats?.kpis?.urgentPriorityCount ?? 0 }) }}
              </span>
              <span>{{ langStore.t('adminVsLastMonth') }}</span>
            </div>
          </div>

          <!-- Card 2: Resolution Rate -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">{{ langStore.t('adminResolutionRate') }}</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">{{ stats?.kpis?.resolutionRate || '0%' }}</h3>
                  <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingUp class="w-3 h-3" /> {{ stats?.kpis?.resolutionChange || '0%' }}
                  </span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-pink-50 text-spu-pink flex items-center justify-center">
                <ShieldCheck class="w-5 h-5" />
              </div>
            </div>

            <div class="w-full bg-slate-100 rounded-full h-2 mt-6 overflow-hidden">
              <div class="bg-gradient-to-r from-spu-purple to-spu-pink h-full rounded-full transition-all duration-500" :style="{ width: stats?.kpis?.resolutionRate || '0%' }"></div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{{ stats?.kpis?.resolvedCount ?? 0 }} / {{ stats?.kpis?.totalReportsThisMonth ?? 0 }} {{ langStore.t('statusResolved') }}</span>
              <span class="font-bold text-slate-700">Target: 85%</span>
            </div>
          </div>

          <!-- Card 3: Avg. Repair Time (MTTR) -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">{{ langStore.t('adminMttr') }}</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">{{ stats?.kpis?.mttrHours || '0h' }}</h3>
                  <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingDown class="w-3 h-3" /> {{ stats?.kpis?.mttrChange || '0m' }}
                  </span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock class="w-5 h-5" />
              </div>
            </div>

            <p class="text-[11px] text-slate-400 mt-4">{{ langStore.t('adminDispatchSpeedImproved') }}</p>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span class="text-spu-pink font-semibold">{{ langStore.t('adminTriageUrgent') }}</span>
              <span>{{ langStore.t('adminTargetSla') }}</span>
            </div>
          </div>

          <!-- Card 4: Satisfaction Score -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">{{ langStore.t('adminSatisfactionScore') }}</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">{{ stats?.kpis?.satisfactionScore || '0.0' }} <span class="text-base text-slate-400 font-semibold">/ 5.0</span></h3>
                  <div class="flex text-amber-400 text-xs">{{ stats?.kpis?.totalReportsThisMonth > 0 ? '★★★★★' : '☆☆☆☆☆' }}</div>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Smile class="w-5 h-5" />
              </div>
            </div>

            <p class="text-[11px] text-slate-400 mt-4">{{ langStore.t('adminSatisfaction') }}</p>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{{ langStore.t('adminBasedOnReviews') }}</span>
              <span class="font-bold text-spu-pink">{{ langStore.t('adminSpuQuality') }}</span>
            </div>
          </div>
        </div>

        <!-- Middle Charts Section: Problem Hotspots + Category Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Problem Hotspots by Building (7 cols) -->
          <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <Building class="w-4 h-4 text-spu-purple" />
                  <h2 class="text-sm font-bold text-slate-900">{{ langStore.t('adminBuildingDistribution') }}</h2>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ langStore.t('adminBuildingDistributionDesc') }}</p>
              </div>
              <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{{ langStore.t('adminZoneCount') }}</span>
            </div>

            <!-- Hotspot Bars List -->
            <div v-if="(stats?.hotspots || []).length > 0" class="space-y-3.5 pt-2">
              <div v-for="bldg in (stats?.hotspots || [])" :key="bldg.name" class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-800">{{ langStore.translateBuilding(bldg.name) }}</span>
                    <span v-if="bldg.density" class="text-[9px] font-extrabold text-spu-pink bg-spu-pink-50 border border-spu-pink-200 px-1.5 py-0.2 rounded">
                      {{ bldg.density }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>{{ bldg.avgTime }}</span>
                    <span class="font-bold text-slate-700">{{ bldg.tickets }} ({{ bldg.pct }}%)</span>
                  </div>
                </div>

                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-700" 
                    :style="{ width: `${bldg.pct}%`, backgroundColor: bldg.color }"
                  ></div>
                </div>
              </div>
            </div>
            <div v-else class="py-10 text-center text-slate-400 text-xs space-y-2">
              <Building class="w-8 h-8 mx-auto text-slate-300" />
              <p>{{ langStore.currentLang.value === 'en' ? 'No reported incidents recorded in campus buildings' : 'ยังไม่มีข้อมูลสถิติปัญหาตามอาคาร' }}</p>
            </div>

            <!-- Bottom Alert Banner -->
            <div class="p-3 bg-pink-50/70 border border-pink-100 rounded-2xl flex items-center justify-between text-xs text-slate-700">
              <div class="flex items-center gap-2">
                <Info class="w-4 h-4 text-spu-pink shrink-0" />
                <span class="text-[11px]">{{ langStore.currentLang.value === 'en' ? 'Campus Facility Live Monitoring Operational' : 'ระบบติดตามการซ่อมบำรุงอาคารสถานที่ศรีปทุมพร้อมปฏิบัติการ' }}</span>
              </div>
              <button @click="featureAlert(langStore.currentLang.value === 'en' ? 'Building Blueprint' : 'แผนผังอาคาร')" class="text-[11px] font-bold text-spu-pink hover:underline shrink-0">
                {{ langStore.currentLang.value === 'en' ? 'View Blueprint' : 'ดูแผนผังอาคาร' }}
              </button>
            </div>
          </div>

          <!-- Issues by Category (5 cols Donut Chart) -->
          <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <PieChart class="w-4 h-4 text-spu-pink" />
                  <h2 class="text-sm font-bold text-slate-900">{{ langStore.t('adminCategoryDistribution') }}</h2>
                </div>
                <button class="text-slate-400 hover:text-slate-600">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ langStore.t('adminCategoryDistributionDesc') }}</p>

              <!-- Donut Visual Component -->
              <div class="flex items-center justify-center my-6 relative">
                <!-- SVG Donut -->
                <svg class="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" stroke-width="12" />
                  <!-- Dynamic Segments -->
                  <template v-if="(stats?.counts?.total || 0) > 0">
                    <circle 
                      v-for="(cat, idx) in (stats?.categories || [])" 
                      :key="cat.name"
                      cx="50" cy="50" r="38" 
                      fill="transparent" 
                      :stroke="cat.color" 
                      stroke-width="12" 
                      :stroke-dasharray="`${(cat.pct * 2.38).toFixed(1)} 239`" 
                      :stroke-dashoffset="`-${getCategoryOffset(idx)}`" 
                    />
                  </template>
                </svg>

                <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span class="text-2xl font-black text-slate-900">{{ stats?.counts?.total ?? 0 }}</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ langStore.t('adminTotalItems') }}</span>
                </div>
              </div>

              <!-- Legends Grid (2x2) -->
              <div v-if="(stats?.categories || []).length > 0" class="grid grid-cols-2 gap-3 text-xs">
                <div v-for="cat in (stats?.categories || [])" :key="cat.name" class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: cat.color }"></span>
                    <span class="font-bold text-slate-800 text-[11px] truncate">{{ langStore.translateCategory(cat.name) }}</span>
                  </div>
                  <div class="flex items-baseline justify-between mt-1">
                    <span class="text-base font-extrabold text-slate-900">{{ cat.pct }}%</span>
                    <span class="text-[10px] text-slate-400">{{ cat.count }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="py-6 text-center text-slate-400 text-xs">
                <span>{{ langStore.currentLang.value === 'en' ? 'No category distribution data' : 'ยังไม่มีสถิติตามหมวดหมู่อุปกรณ์' }}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-center">
              <button @click="featureAlert(langStore.t('adminViewCategoryStats'))" class="text-xs font-bold text-spu-pink hover:underline flex items-center gap-1">
                <span>{{ langStore.t('adminViewCategoryStats') }}</span>
                <ChevronRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        <!-- Live Ticket Management Section (Image 1 Bottom Table) -->
        <div id="tickets" class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4 p-6">
          
          <!-- Table Header / Controls -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <h2 class="text-base font-extrabold text-slate-900">{{ langStore.t('adminLiveTicketManagement') }}</h2>
              <span class="bg-spu-pink-100 text-spu-pink text-xs font-bold px-2.5 py-0.5 rounded-full">
                {{ langStore.t('adminActiveTicketsToday', { count: activeCount }) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="exportCSV" 
                class="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download class="w-3.5 h-3.5 text-slate-500" />
                <span>{{ langStore.t('adminExportCsv') }}</span>
              </button>
              <button 
                @click="featureAlert(langStore.t('adminBatchAssign'))" 
                class="px-4 py-2 spu-gradient-primary text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-sm transition-all"
              >
                {{ langStore.t('adminBatchAssign') }}
              </button>
            </div>
          </div>

          <!-- Search & Filter Row -->
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <div class="relative flex-1 min-w-[240px]">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                v-model="tableSearch" 
                type="text" 
                :placeholder="langStore.t('adminSearchPlaceholder')" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20"
              />
            </div>

            <select v-model="tableStatusFilter" class="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none">
              <option value="ALL">{{ langStore.t('adminStatusAll') }}</option>
              <option value="PENDING">{{ langStore.t('adminStatusPendingOption') }}</option>
              <option value="ASSIGNED">{{ langStore.t('adminStatusAssignedOption') }}</option>
              <option value="IN_PROGRESS">{{ langStore.t('adminStatusWorkingOption') }}</option>
              <option value="RESOLVED">{{ langStore.t('adminStatusResolvedOption') }}</option>
            </select>

            <select v-model="tableBuildingFilter" class="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none">
              <option value="ALL">{{ langStore.t('adminAllBuildings') }}</option>
              <option value="Building 11">{{ langStore.t('adminBuilding11') }}</option>
              <option value="Building 9">{{ langStore.t('adminBuilding9') }}</option>
              <option value="Building 5">{{ langStore.t('adminBuilding5') }}</option>
              <option value="Central Library">{{ langStore.t('adminCentralLibrary') }}</option>
            </select>

            <select class="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none">
              <option>{{ langStore.t('adminTimeAll') }}</option>
              <option>{{ langStore.t('adminTimeWeek') }}</option>
              <option>{{ langStore.t('adminTimeToday') }}</option>
            </select>
          </div>

          <!-- Mobile Ticket Cards View (Shown on screens < 768px) -->
          <div class="md:hidden space-y-3">
            <div 
              v-for="ticket in filteredTickets" 
              :key="ticket.id" 
              @click="openStatusModal(ticket)" 
              class="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3 cursor-pointer hover:border-spu-purple/40 transition-all active:scale-[0.99] shadow-xs"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-xs text-slate-900">{{ formatTicketId(ticket.id) }}</span>
                  <p class="text-xs font-bold text-slate-800 mt-0.5">{{ langStore.translateBuilding(ticket.building) }} • {{ langStore.translateFloor(ticket.floor) }} • {{ langStore.translateRoom(ticket.room) }}</p>
                </div>
                <span 
                  class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1"
                  :class="getStatusBadgeClass(ticket.status, ticket.urgency)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(ticket.status)"></span>
                  {{ formatStatus(ticket.status, ticket.urgency) }}
                </span>
              </div>

              <div class="flex items-start gap-3">
                <img 
                  :src="ticket.image_before_url" 
                  alt="Thumbnail" 
                  class="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
                />
                <div class="min-w-0 flex-1 space-y-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="inline-block text-[10px] font-bold text-spu-purple bg-spu-purple-50 px-2 py-0.5 rounded-full border border-spu-purple-100">
                      {{ langStore.translateCategory(ticket.category) }}
                    </span>
                    <span v-if="ticket.urgency === 'Urgent'" class="text-[9px] font-extrabold text-spu-pink bg-spu-pink-50 px-1.5 py-0.5 rounded border border-spu-pink-200">
                      {{ langStore.translateUrgency(ticket.urgency) }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 line-clamp-2 leading-snug">{{ ticket.description }}</p>
                  <p class="text-[10px] text-slate-500 font-mono truncate">✉️ {{ ticket.reporter_email }}</p>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <span class="font-bold text-slate-800 truncate max-w-[140px]">
                    👤 {{ ticket.assigned_tech || langStore.t('adminUnassigned') }}
                  </span>
                </div>
                <button 
                  @click.stop="openStatusModal(ticket)" 
                  class="px-3 py-1.5 bg-spu-purple text-white text-[11px] font-bold rounded-xl flex items-center gap-1 hover:bg-spu-purple-700 active:scale-95 transition-all shadow-xs"
                >
                  <Edit3 class="w-3 h-3" />
                  <span>{{ langStore.t('adminUpdateStatus') }}</span>
                </button>
              </div>
            </div>

            <!-- Mobile Empty State -->
            <div v-if="filteredTickets.length === 0" class="p-8 bg-slate-50/70 border border-slate-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 class="w-8 h-8 text-emerald-500 mx-auto" />
              <p class="font-bold text-slate-800 text-xs">{{ langStore.currentLang.value === 'en' ? 'No tickets found' : 'ไม่มีรายการแจ้งซ่อมในระบบ' }}</p>
              <p class="text-[11px] text-slate-400">{{ langStore.currentLang.value === 'en' ? 'All maintenance requests have been cleared.' : 'ไม่มีรายการค้างย้อน ข้อมูลได้รับการเคลียร์แล้ว' }}</p>
            </div>
          </div>

          <!-- Interactive Responsive Table (Desktop & Tablet) -->
          <div class="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-3.5 pl-4">{{ langStore.t('adminColTicket') }}</th>
                  <th class="p-3.5">{{ langStore.t('adminImageThumbnail') }}</th>
                  <th class="p-3.5">{{ langStore.t('adminColLocation') }}</th>
                  <th class="p-3.5">{{ langStore.t('adminColCategory') }}</th>
                  <th class="p-3.5">{{ langStore.t('adminColReporter') }}</th>
                  <th class="p-3.5">{{ langStore.t('adminColTech') }}</th>
                  <th class="p-3.5">{{ langStore.t('adminColStatus') }}</th>
                  <th class="p-3.5">{{ langStore.t('adminSlaTime') }}</th>
                  <th class="p-3.5 pr-4 text-right">{{ langStore.t('adminAction') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="filteredTickets.length === 0">
                  <td colspan="9" class="p-12 text-center text-slate-400">
                    <CheckCircle2 class="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p class="font-bold text-slate-700 text-sm">{{ langStore.currentLang.value === 'en' ? 'No tickets found' : 'ไม่มีรายการแจ้งซ่อมในระบบ' }}</p>
                    <p class="text-xs text-slate-400 mt-1">{{ langStore.currentLang.value === 'en' ? 'All maintenance requests have been processed or cleared.' : 'ไม่มีงานค้างย้อน ข้อมูลทั้งหมดได้รับการเคลียร์เรียบร้อยแล้ว' }}</p>
                  </td>
                </tr>
                <tr 
                  v-for="ticket in filteredTickets" 
                  :key="ticket.id" 
                  class="hover:bg-slate-50/80 transition-colors group cursor-pointer" 
                  @click="openStatusModal(ticket)"
                >
                  <!-- Ticket ID -->
                  <td class="p-3.5 pl-4 font-mono font-bold text-slate-900 group-hover:text-spu-purple">
                    {{ ticket.id }}
                  </td>

                  <!-- Preview Thumbnail -->
                  <td class="p-3.5">
                    <img 
                      :src="ticket.image_before_url" 
                      alt="Thumbnail" 
                      class="w-10 h-10 rounded-xl object-cover border border-slate-200" 
                    />
                  </td>

                  <!-- Campus Location -->
                  <td class="p-3.5">
                    <p class="font-bold text-slate-900">{{ langStore.translateBuilding(ticket.building) }}, {{ langStore.translateFloor(ticket.floor) }}</p>
                    <p class="text-[11px] text-slate-400">{{ langStore.translateRoom(ticket.room) }}</p>
                  </td>

                  <!-- Category Pill -->
                  <td class="p-3.5">
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-spu-purple bg-spu-purple-50 px-2.5 py-1 rounded-full border border-spu-purple-100">
                      {{ langStore.translateCategory(ticket.category) }}
                    </span>
                  </td>

                  <!-- Reporter -->
                  <td class="p-3.5">
                    <p class="text-xs font-mono font-medium text-slate-700 truncate max-w-[200px]" :title="ticket.reporter_email">
                      {{ ticket.reporter_email }}
                    </p>
                  </td>

                  <!-- Assigned Tech -->
                  <td class="p-3.5">
                    <div v-if="ticket.assigned_tech" class="flex items-center gap-1.5 flex-wrap">
                      <div class="w-6 h-6 rounded-full bg-spu-purple text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {{ ticket.assigned_tech[0] }}
                      </div>
                      <span class="font-bold text-slate-800 text-xs">{{ ticket.assigned_tech }}</span>
                    </div>
                    <div v-else class="flex items-center gap-1">
                      <button 
                        @click.stop="quickAssignToMe(ticket)" 
                        class="px-2 py-0.5 bg-spu-pink-50 hover:bg-spu-pink text-spu-pink hover:text-white font-bold rounded-lg text-[10px] transition-colors border border-spu-pink/30 flex items-center gap-1 shadow-2xs" 
                        :title="langStore.t('adminAssignToMe')"
                      >
                        <UserCheck class="w-3 h-3" />
                        <span>{{ langStore.t('adminAssignToMe') }}</span>
                      </button>
                      <button 
                        @click.stop="openStatusModal(ticket)" 
                        class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-[10px] transition-colors"
                      >
                        {{ langStore.t('adminAssignAction') }}
                      </button>
                    </div>
                  </td>

                  <!-- Status Pill -->
                  <td class="p-3.5">
                    <span 
                      class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5" 
                      :class="getStatusBadgeClass(ticket.status, ticket.urgency)"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(ticket.status)"></span>
                      {{ formatStatus(ticket.status, ticket.urgency) }}
                    </span>
                  </td>

                  <!-- SLA / Time Elapsed -->
                  <td class="p-3.5 text-xs">
                    <span 
                      class="font-medium" 
                      :class="ticket.urgency === 'Urgent' ? 'text-spu-pink font-bold' : 'text-slate-500'"
                    >
                      {{ ticket.sla_time || (ticket.status === 'RESOLVED' ? (langStore.currentLang.value === 'en' ? 'Resolved in 42 mins' : 'เสร็จใน 42 นาที') : (langStore.currentLang.value === 'en' ? '45 mins elapsed' : 'ผ่านมาแล้ว 45 นาที')) }}
                    </span>
                  </td>

                  <!-- Action Button -->
                  <td class="p-3.5 pr-4 text-right">
                    <button 
                      @click.stop="openStatusModal(ticket)" 
                      class="p-2 text-slate-400 hover:text-spu-purple hover:bg-spu-purple-50 rounded-xl transition-all" 
                      :title="langStore.t('adminUpdateStatus')"
                    >
                      <Edit3 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bottom Pagination Controls -->
          <div class="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span>{{ langStore.t('adminShowingRecords', { count: filteredTickets.length, total: filteredTickets.length }) }}</span>

            <div class="flex items-center gap-1.5 font-bold">
              <button class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">{{ langStore.t('adminPrevPage') }}</button>
              <button class="w-7 h-7 rounded-lg bg-spu-purple text-white flex items-center justify-center">1</button>
              <button class="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">2</button>
              <button class="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">3</button>
              <span>...</span>
              <button class="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">24</button>
              <button class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">{{ langStore.t('adminNextPage') }}</button>
            </div>
          </div>

        </div>

      </main>

      <!-- Status Update & After Photo Modal -->
      <StatusUpdateModal 
        :is-open="isStatusModalOpen" 
        :ticket="selectedTicket" 
        @close="isStatusModalOpen = false" 
        @updated="handleTicketUpdated"
      />

      <!-- Room QR Code Sticker Generator Modal -->
      <RoomQrGeneratorModal :is-open="isQrGenOpen" @close="isQrGenOpen = false" />

      <!-- QR Modal -->
      <QrScannerModal :is-open="isQrModalOpen" @close="isQrModalOpen = false" />

      <!-- Global Email Toast Simulator -->
      <EmailNotificationToast />

      <!-- Campus Announcement Modal -->
      <AnnouncementModal 
        :is-open="isAnnouncementModalOpen" 
        @close="isAnnouncementModalOpen = false" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Search, 
  Building2, 
  ChevronDown, 
  Download, 
  Plus, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  ClipboardCheck, 
  ShieldCheck, 
  Clock, 
  Smile, 
  Building, 
  Info, 
  PieChart, 
  MoreVertical, 
  ChevronRight, 
  FileSpreadsheet, 
  Edit3,
  Menu,
  UserCheck,
  Megaphone,
  Trash2,
  CheckCircle2
} from 'lucide-vue-next'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAdminNotifications } from '~/composables/useAdminNotifications'
import { useAdminSidebar } from '~/composables/useAdminSidebar'
import { useAnnouncement } from '~/composables/useAnnouncement'
import { useAppLang } from '~/composables/useAppLang'

const router = useRouter()
const adminAuth = useAdminAuth()
const notif = useAdminNotifications()
const adminSidebar = useAdminSidebar()
const langStore = useAppLang()
const { announcement, initAnnouncement } = useAnnouncement()

const stats = ref<any>(null)
const tickets = ref<any[]>([])
const selectedMonth = ref('OCT')
const selectedBuildingFilter = ref('ALL')
const tableSearch = ref('')
const tableStatusFilter = ref('ALL')
const tableBuildingFilter = ref('ALL')

const isStatusModalOpen = ref(false)
const selectedTicket = ref<any>(null)
const isQrModalOpen = ref(false)
const isQrGenOpen = ref(false)
const isAnnouncementModalOpen = ref(false)

const activeCount = computed(() => {
  return tickets.value.filter(t => t.status !== 'RESOLVED').length
})

const filteredTickets = computed(() => {
  return tickets.value.filter(t => {
    // Search
    if (tableSearch.value.trim() !== '') {
      const q = tableSearch.value.toLowerCase()
      const match = t.id.toLowerCase().includes(q) ||
                    t.room.toLowerCase().includes(q) ||
                    t.building.toLowerCase().includes(q) ||
                    t.reporter_email.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q)
      if (!match) return false
    }

    // Status filter
    if (tableStatusFilter.value !== 'ALL' && t.status !== tableStatusFilter.value) {
      return false
    }

    // Building filter
    if (tableBuildingFilter.value !== 'ALL' && !t.building.includes(tableBuildingFilter.value)) {
      return false
    }

    return true
  })
})

function getStatusBadgeClass(status: string, urgency?: string) {
  if (status === 'IN_PROGRESS') {
    return urgency === 'Urgent' ? 'bg-pink-100 text-spu-pink font-black' : 'bg-amber-100 text-amber-800 font-bold'
  }
  if (status === 'ASSIGNED') return 'bg-blue-100 text-blue-800 font-bold'
  if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-800 font-bold'
  return 'bg-purple-100 text-spu-purple font-bold'
}

function getStatusDotClass(status: string) {
  if (status === 'IN_PROGRESS') return 'bg-amber-500'
  if (status === 'ASSIGNED') return 'bg-blue-600'
  if (status === 'RESOLVED') return 'bg-emerald-500'
  return 'bg-spu-purple'
}

function formatStatus(status: string, urgency?: string) {
  if (status === 'IN_PROGRESS') {
    return urgency === 'Urgent' 
      ? (langStore.currentLang.value === 'en' ? 'Urgent Fixing' : 'กำลังเร่งซ่อม') 
      : langStore.t('statusWorking')
  }
  if (status === 'ASSIGNED') return langStore.t('statusAssigned')
  if (status === 'RESOLVED') return langStore.t('statusResolved')
  return langStore.t('statusPending')
}

function formatTicketId(id: string) {
  if (!id) return ''
  return id.startsWith('Ticket') || id.startsWith('#') ? id : `#${id}`
}

function openStatusModal(ticket: any) {
  selectedTicket.value = ticket
  isStatusModalOpen.value = true
}

async function quickAssignToMe(ticket: any) {
  const myName = adminAuth.adminProfile.value?.name || 'Admin SPU'
  try {
    await $fetch(`/api/reports/${encodeURIComponent(ticket.id)}/status`, {
      method: 'PATCH',
      body: {
        status: ticket.status === 'PENDING' ? 'ASSIGNED' : ticket.status,
        assigned_tech: myName,
        note: `รับผิดชอบงานโดย: ${myName}`
      }
    })
    await loadData()
  } catch (err: any) {
    alert(`ไม่สามารถมอบหมายงานได้: ${err.message}`)
  }
}

function handleTicketUpdated() {
  loadData()
}

function featureAlert(name: string) {
  alert(`แจ้งเตือน: ฟังก์ชัน "${name}" เปิดใช้งานในระบบแล้ว`)
}

function generateSlaReport() {
  alert('กำลังสร้างรายงานสรุปผล SLA & การซ่อมบำรุงอาคารสถานที่ (PDF)...')
}

function exportCSV() {
  const headers = ['Ticket ID', 'Building', 'Floor', 'Room', 'Category', 'Urgency', 'Status', 'Reporter', 'Tech', 'Created At']
  const rows = filteredTickets.value.map(t => [
    t.id,
    `"${(t.building || '').replace(/"/g, '""')}"`,
    t.floor,
    `"${(t.room || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.urgency,
    t.status,
    `"${(t.reporter_email || '').replace(/"/g, '""')}"`,
    `"${(t.assigned_tech || '').replace(/"/g, '""')}"`,
    `"${t.created_at}"`
  ])
  
  // Prepend UTF-8 BOM (\uFEFF) so Excel opens Thai text correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `SPU_Facility_Tickets_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function getCategoryOffset(idx: number) {
  if (!stats.value?.categories || idx === 0) return '0'
  let offset = 0
  for (let i = 0; i < idx; i++) {
    offset += (stats.value.categories[i].pct * 2.38)
  }
  return offset.toFixed(1)
}

async function clearAllData() {
  const confirmMsg = langStore.currentLang.value === 'en'
    ? 'Are you sure you want to clear all tickets and reset statistics to 0?'
    : 'คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลงานแจ้งซ่อมและรีเซ็ตสถิติทั้งหมดเป็น 0?'
  if (!confirm(confirmMsg)) return

  try {
    const res = await $fetch<any>('/api/admin/clear-data', { method: 'POST' })
    if (res.success) {
      await loadData()
      alert(langStore.currentLang.value === 'en' ? 'All tickets and statistics cleared successfully!' : 'เคลียร์สถิติและ Ticket ทั้งหมดเรียบร้อยแล้ว!')
    }
  } catch (err: any) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`)
  }
}

let liveSyncInterval: any = null

async function loadData() {
  try {
    const [statsRes, ticketsRes] = await Promise.all([
      $fetch<any>('/api/stats'),
      $fetch<any>('/api/reports')
    ])

    if (statsRes.success) stats.value = statsRes
    if (ticketsRes.success) tickets.value = ticketsRes.data
  } catch (err) {
    console.error('Failed to load admin data', err)
  }
}

onMounted(() => {
  adminSidebar.initSidebar()
  initAnnouncement()
  loadData()

  // Live Sync interval (every 10s) across multiple devices
  liveSyncInterval = setInterval(loadData, 10000)
})

onUnmounted(() => {
  if (liveSyncInterval) clearInterval(liveSyncInterval)
})
</script>
