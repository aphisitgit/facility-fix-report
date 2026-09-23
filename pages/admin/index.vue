<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Left Sidebar (Desktop) -->
    <AdminSidebar 
      :active-tickets-count="activeCount" 
      @open-qr-gen="isQrGenOpen = true"
      @alert-feature="featureAlert"
      @logout="router.push('/')"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 flex flex-col">
      
      <!-- Top Navigation Bar -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-3.5 flex items-center justify-between">
        <!-- Search & Campus Selector -->
        <div class="flex items-center gap-4 flex-1 max-w-xl">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="tableSearch"
              type="text" 
              placeholder="Search ticket ID, room, or reporter email..."
              class="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20 transition-all"
            />
          </div>

          <!-- Campus Selector -->
          <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shrink-0">
            <Building2 class="w-3.5 h-3.5 text-spu-purple" />
            <span>Bang Khen Main Campus - Term 1/2024</span>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <!-- Top Right Actions -->
        <div class="flex items-center gap-3">
          <button 
            @click="exportCSV" 
            class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          <button 
            @click="router.push('/report')"
            class="px-4 py-2 spu-gradient-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-spu-purple/20 hover:opacity-95 transition-all"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Create Dispatch</span>
          </button>

          <div class="h-6 w-px bg-slate-200"></div>

          <button class="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">
            <Bell class="w-4 h-4" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-spu-pink ring-2 ring-white"></span>
          </button>

          <!-- User Profile -->
          <div class="flex items-center gap-2.5 pl-2">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Praew" 
              class="w-8 h-8 rounded-full object-cover ring-2 ring-spu-purple/20"
            />
            <div class="text-left hidden lg:block">
              <p class="text-xs font-bold text-slate-800 leading-tight">Praew</p>
              <p class="text-[10px] text-slate-400">Operations Director</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Body -->
      <main class="p-8 space-y-6 flex-1 overflow-y-auto">
        
        <!-- Header Banner & SLA Action -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-black uppercase text-spu-pink tracking-wider bg-spu-pink-50 border border-spu-pink-100 px-2 py-0.5 rounded-full">
                OPERATIONAL INTELLIGENCE
              </span>
              <span class="text-slate-300">•</span>
              <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Sync • Updated 2 mins ago
              </span>
            </div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Campus Facility Operations & Analytics</h1>
            <p class="text-xs text-slate-500 mt-1 max-w-2xl">
              Real-time overview of ticket triage, maintenance performance, and infrastructure health across Sripatum University.
            </p>
          </div>

          <div class="flex items-center gap-2.5 shrink-0">
            <select v-model="selectedMonth" class="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 shadow-xs focus:outline-none">
              <option value="OCT">This Month (Oct 2024)</option>
              <option value="SEP">Last Month (Sep 2024)</option>
              <option value="TERM">Term 1/2024 Full</option>
            </select>

            <select v-model="selectedBuildingFilter" class="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 shadow-xs focus:outline-none">
              <option value="ALL">All Buildings</option>
              <option value="Building 11">Building 11</option>
              <option value="Building 9">Building 9</option>
              <option value="Building 5">Building 5</option>
              <option value="Central Library">Central Library</option>
            </select>

            <button 
              @click="generateSlaReport" 
              class="px-4 py-2.5 bg-gradient-to-r from-spu-purple via-spu-purple-700 to-spu-pink text-white text-xs font-bold rounded-xl shadow-md shadow-spu-purple/20 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <FileSpreadsheet class="w-4 h-4" />
              <span>Generate SLA Report</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Total Reports -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">Total Reports This Month</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">{{ stats?.kpis?.totalReportsThisMonth || 142 }}</h3>
                  <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingUp class="w-3 h-3" /> {{ stats?.kpis?.monthlyIncrease || '+12%' }}
                  </span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-spu-purple-50 text-spu-purple flex items-center justify-center">
                <ClipboardCheck class="w-5 h-5" />
              </div>
            </div>

            <!-- Mini Sparkline Graph -->
            <div class="h-8 mt-3 flex items-end gap-1">
              <div v-for="(h, i) in [40, 55, 35, 60, 48, 70, 85, 95]" :key="i" 
                   class="flex-1 bg-spu-pink/30 hover:bg-spu-pink rounded-t transition-all"
                   :style="{ height: `${h}%` }"></div>
            </div>

            <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span class="flex items-center gap-1 font-semibold text-spu-pink">
                <span class="w-1.5 h-1.5 rounded-full bg-spu-pink"></span>
                {{ stats?.kpis?.urgentPriorityCount || 18 }} urgent priority
              </span>
              <span>vs 127 in Sep</span>
            </div>
          </div>

          <!-- Card 2: Resolution Rate -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">Resolution Rate</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">{{ stats?.kpis?.resolutionRate || '88.5%' }}</h3>
                  <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingUp class="w-3 h-3" /> {{ stats?.kpis?.resolutionChange || '+3.2%' }}
                  </span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-pink-50 text-spu-pink flex items-center justify-center">
                <ShieldCheck class="w-5 h-5" />
              </div>
            </div>

            <div class="w-full bg-slate-100 rounded-full h-2 mt-6 overflow-hidden">
              <div class="bg-gradient-to-r from-spu-purple to-spu-pink h-full rounded-full" style="width: 88.5%"></div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{{ stats?.kpis?.resolvedCount || 126 }} of 142 resolved</span>
              <span class="font-bold text-slate-700">Target: 85%</span>
            </div>
          </div>

          <!-- Card 3: Avg. Repair Time (MTTR) -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">Avg. Repair Time (MTTR)</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">{{ stats?.kpis?.mttrHours || '3.4h' }}</h3>
                  <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingDown class="w-3 h-3" /> {{ stats?.kpis?.mttrChange || '-45m' }}
                  </span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock class="w-5 h-5" />
              </div>
            </div>

            <p class="text-[11px] text-slate-400 mt-4">Faster dispatch SLA than Q2 cycle</p>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span class="text-spu-pink font-semibold">⚡ Urgent triage: 48m</span>
              <span>SLA goal: &lt; 6h</span>
            </div>
          </div>

          <!-- Card 4: Satisfaction Score -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-500">Satisfaction Score</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <h3 class="text-3xl font-black text-slate-900">4.7 <span class="text-base text-slate-400 font-semibold">/ 5.0</span></h3>
                  <div class="flex text-amber-400 text-xs">★★★★★</div>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Smile class="w-5 h-5" />
              </div>
            </div>

            <p class="text-[11px] text-slate-400 mt-4">96% positive student & faculty feedback</p>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Based on 118 ratings</span>
              <span class="font-bold text-spu-pink">SPU Quality Standard</span>
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
                  <h2 class="text-sm font-bold text-slate-900">Problem Hotspots by Building</h2>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">Distribution of maintenance tickets across campus facilities this month</p>
              </div>
              <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">5 Campus Zones</span>
            </div>

            <!-- Hotspot Bars List -->
            <div class="space-y-3.5 pt-2">
              <div v-for="bldg in (stats?.hotspots || [])" :key="bldg.name" class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-800">{{ bldg.name }}</span>
                    <span v-if="bldg.density" class="text-[9px] font-extrabold text-spu-pink bg-spu-pink-50 border border-spu-pink-200 px-1.5 py-0.2 rounded">
                      {{ bldg.density }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>{{ bldg.avgTime }} avg</span>
                    <span class="font-bold text-slate-700">{{ bldg.tickets }} tickets ({{ bldg.pct }}%)</span>
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

            <!-- Bottom Alert Banner -->
            <div class="p-3 bg-pink-50/70 border border-pink-100 rounded-2xl flex items-center justify-between text-xs text-slate-700">
              <div class="flex items-center gap-2">
                <Info class="w-4 h-4 text-spu-pink shrink-0" />
                <span class="text-[11px]">Building 11 Floor 4-5 HVAC replacement scheduled this weekend.</span>
              </div>
              <button @click="featureAlert('Campus Map View')" class="text-[11px] font-bold text-spu-pink hover:underline shrink-0">
                View Building Map
              </button>
            </div>
          </div>

          <!-- Issues by Category (5 cols Donut Chart) -->
          <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <PieChart class="w-4 h-4 text-spu-pink" />
                  <h2 class="text-sm font-bold text-slate-900">Issues by Category</h2>
                </div>
                <button class="text-slate-400 hover:text-slate-600">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">Breakdown of reported incident types</p>

              <!-- Donut Visual Component -->
              <div class="flex items-center justify-center my-6 relative">
                <!-- SVG Donut -->
                <svg class="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" stroke-width="12" />
                  <!-- HVAC 42% -->
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#D63384" stroke-width="12" stroke-dasharray="100 139" stroke-dashoffset="0" />
                  <!-- Electrical 28% -->
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#4A154B" stroke-width="12" stroke-dasharray="67 172" stroke-dashoffset="-100" />
                  <!-- Furniture 18% -->
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E01E5A" stroke-width="12" stroke-dasharray="43 196" stroke-dashoffset="-167" />
                  <!-- Sanitary 12% -->
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#64748B" stroke-width="12" stroke-dasharray="29 210" stroke-dashoffset="-210" />
                </svg>

                <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span class="text-2xl font-black text-slate-900">142</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Issues</span>
                </div>
              </div>

              <!-- Legends Grid (2x2) -->
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div v-for="cat in (stats?.categories || [])" :key="cat.name" class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: cat.color }"></span>
                    <span class="font-bold text-slate-800 text-[11px] truncate">{{ cat.name }}</span>
                  </div>
                  <div class="flex items-baseline justify-between mt-1">
                    <span class="text-base font-extrabold text-slate-900">{{ cat.pct }}%</span>
                    <span class="text-[10px] text-slate-400">{{ cat.count }} tix</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-center">
              <button @click="featureAlert('Category Audit Breakdown')" class="text-xs font-bold text-spu-pink hover:underline flex items-center gap-1">
                <span>View category audit breakdown</span>
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
              <h2 class="text-base font-extrabold text-slate-900">Live Ticket Management</h2>
              <span class="bg-spu-pink-100 text-spu-pink text-xs font-bold px-2.5 py-0.5 rounded-full">
                {{ activeCount }} Active Today
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="exportCSV" 
                class="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download class="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
              <button 
                @click="featureAlert('Bulk Dispatch Tool')" 
                class="px-4 py-2 spu-gradient-primary text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-sm transition-all"
              >
                Bulk Assign
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
                placeholder="Search ticket ID, room, or reporter email..."
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spu-purple/20"
              />
            </div>

            <select v-model="tableStatusFilter" class="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none">
              <option value="ALL">All Statuses (Pending, Active, Done)</option>
              <option value="PENDING">Pending Triage</option>
              <option value="IN_PROGRESS">Active / In Progress</option>
              <option value="RESOLVED">Resolved / Completed</option>
            </select>

            <select v-model="tableBuildingFilter" class="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none">
              <option value="ALL">All Buildings</option>
              <option value="Building 11">Building 11</option>
              <option value="Building 9">Building 9</option>
              <option value="Building 5">Building 5</option>
              <option value="Central Library">Central Library</option>
            </select>

            <select class="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none">
              <option>Last 30 Days</option>
              <option>This Week</option>
              <option>Today Only</option>
            </select>
          </div>

          <!-- Interactive Responsive Table -->
          <div class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-3.5 pl-4">Ticket ID</th>
                  <th class="p-3.5">Preview</th>
                  <th class="p-3.5">Campus Location</th>
                  <th class="p-3.5">Category</th>
                  <th class="p-3.5">Reporter</th>
                  <th class="p-3.5">Assigned Tech</th>
                  <th class="p-3.5">Status</th>
                  <th class="p-3.5">SLA / Time</th>
                  <th class="p-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
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
                    <p class="font-bold text-slate-900">{{ ticket.building }}, Fl {{ ticket.floor }}</p>
                    <p class="text-[11px] text-slate-400">{{ ticket.room }}</p>
                  </td>

                  <!-- Category Pill -->
                  <td class="p-3.5">
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-spu-purple bg-spu-purple-50 px-2.5 py-1 rounded-full border border-spu-purple-100">
                      {{ ticket.category }}
                    </span>
                  </td>

                  <!-- Reporter -->
                  <td class="p-3.5">
                    <p class="font-semibold text-slate-800">{{ ticket.reporter_name || 'SPU Member' }}</p>
                    <p class="text-[10px] text-slate-400 font-mono">{{ ticket.reporter_email }}</p>
                  </td>

                  <!-- Assigned Tech -->
                  <td class="p-3.5">
                    <div v-if="ticket.assigned_tech" class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-spu-purple text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {{ ticket.assigned_tech[0] }}
                      </div>
                      <span class="font-semibold text-slate-800">{{ ticket.assigned_tech }}</span>
                    </div>
                    <button 
                      v-else 
                      @click.stop="openStatusModal(ticket)"
                      class="px-2.5 py-1 bg-slate-100 hover:bg-spu-purple-50 text-slate-500 hover:text-spu-purple font-bold rounded-lg text-[10px] transition-colors"
                    >
                      + Assign Tech
                    </button>
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
                      {{ ticket.sla_time || (ticket.status === 'RESOLVED' ? 'Done in 42m' : '45m elapsed') }}
                    </span>
                  </td>

                  <!-- Action Button -->
                  <td class="p-3.5 pr-4 text-right">
                    <button 
                      @click.stop="openStatusModal(ticket)"
                      class="p-2 text-slate-400 hover:text-spu-purple hover:bg-spu-purple-50 rounded-xl transition-all"
                      title="Update ticket status"
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
            <span>Showing 1 to {{ filteredTickets.length }} of 142 tickets across Sripatum Campus</span>

            <div class="flex items-center gap-1.5 font-bold">
              <button class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">Previous</button>
              <button class="w-7 h-7 rounded-lg bg-spu-purple text-white flex items-center justify-center">1</button>
              <button class="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">2</button>
              <button class="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">3</button>
              <span>...</span>
              <button class="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">24</button>
              <button class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">Next</button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  Edit3 
} from 'lucide-vue-next'

const router = useRouter()

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
    return urgency === 'Urgent' ? 'bg-pink-100 text-spu-pink font-black' : 'bg-spu-purple-50 text-spu-purple font-bold'
  }
  if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-800 font-bold'
  return 'bg-slate-100 text-slate-700 font-bold'
}

function getStatusDotClass(status: string) {
  if (status === 'IN_PROGRESS') return 'bg-spu-pink'
  if (status === 'RESOLVED') return 'bg-emerald-500'
  return 'bg-amber-400'
}

function formatStatus(status: string, urgency?: string) {
  if (status === 'IN_PROGRESS') return urgency === 'Urgent' ? 'Urgent In Progress' : 'In Progress'
  if (status === 'RESOLVED') return 'Resolved'
  return 'Pending Triage'
}

function openStatusModal(ticket: any) {
  selectedTicket.value = ticket
  isStatusModalOpen.value = true
}

function handleTicketUpdated() {
  loadData()
}

function featureAlert(name: string) {
  alert(`Feature: "${name}" is active in the SPU Operations Suite.`)
}

function generateSlaReport() {
  alert('Generating monthly SPU Facilities SLA & Infrastructure compliance PDF report...')
}

function exportCSV() {
  const headers = ['Ticket ID', 'Building', 'Floor', 'Room', 'Category', 'Urgency', 'Status', 'Reporter', 'Tech', 'Created At']
  const rows = filteredTickets.value.map(t => [
    t.id,
    `"${t.building}"`,
    t.floor,
    `"${t.room}"`,
    `"${t.category}"`,
    t.urgency,
    t.status,
    `"${t.reporter_email}"`,
    `"${t.assigned_tech || ''}"`,
    `"${t.created_at}"`
  ])
  
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `SPU_Facility_Tickets_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

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
  loadData()
})
</script>
