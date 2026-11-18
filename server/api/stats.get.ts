import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const allTickets = await prisma.ticket.findMany({
      include: { status_logs: true }
    })
    const totalCount = allTickets.length

    const pendingCount = allTickets.filter(t => t.status === 'PENDING').length
    const assignedCount = allTickets.filter(t => t.status === 'ASSIGNED').length
    const inProgressCount = allTickets.filter(t => t.status === 'IN_PROGRESS').length
    const resolvedCount = allTickets.filter(t => t.status === 'RESOLVED').length
    const urgentCount = allTickets.filter(t => t.urgency === 'Urgent').length

    // Hotspots by Building
    const buildingCounts: Record<string, number> = {}
    allTickets.forEach(t => {
      const b = t.building || 'Other'
      buildingCounts[b] = (buildingCounts[b] || 0) + 1
    })

    const buildingColorMap: Record<string, string> = {
      'Building 11': '#D63384',
      'Building 9': '#9D174D',
      'Building 5': '#4A154B',
      'Building 1': '#8A278A',
      'Central Library': '#8A278A',
      'Cafeteria': '#64748B'
    }

    const hotspots = Object.entries(buildingCounts)
      .map(([name, count]) => {
        const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
        return {
          name,
          density: pct >= 30 ? 'HIGH DENSITY' : null,
          avgTime: '2.5h',
          tickets: count,
          pct,
          color: buildingColorMap[name] || '#D63384'
        }
      })
      .sort((a, b) => b.tickets - a.tickets)

    // Category breakdown
    const categoryCounts: Record<string, number> = {}
    allTickets.forEach(t => {
      const c = t.category || 'Other'
      categoryCounts[c] = (categoryCounts[c] || 0) + 1
    })

    const catColors: Record<string, string> = {
      'HVAC / Cooling': '#D63384',
      'Electrical & Lighting': '#4A154B',
      'Electrical / Power': '#4A154B',
      'Desks & Furniture': '#E01E5A',
      'Furniture & Desks': '#E01E5A',
      'Sanitary & Plumbing': '#64748B',
      'Sanitary & Misc': '#64748B'
    }

    const categories = Object.entries(categoryCounts).map(([name, count]) => {
      const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
      return {
        name,
        pct,
        count,
        color: catColors[name] || '#8A278A'
      }
    })

    const resolutionRate = totalCount > 0 
      ? Math.round((resolvedCount / totalCount) * 1000) / 10 
      : 0

    return {
      success: true,
      kpis: {
        totalReportsThisMonth: totalCount,
        monthlyIncrease: totalCount > 0 ? '+100%' : '0%',
        urgentPriorityCount: urgentCount,
        previousMonthUrgent: 0,
        resolutionRate: `${resolutionRate}%`,
        resolutionChange: '0%',
        resolvedCount: resolvedCount,
        totalTriageTarget: '85%',
        mttrHours: totalCount > 0 ? '2.5h' : '0h',
        mttrChange: '0m',
        urgentTriageTime: urgentCount > 0 ? '30m' : '-',
        satisfactionScore: totalCount > 0 ? (resolvedCount > 0 ? '5.0' : '0.0') : '0.0',
        satisfactionPct: totalCount > 0 ? (resolvedCount > 0 ? '100%' : '0%') : '0%',
        ratingsCount: resolvedCount,
        activeTodayCount: inProgressCount + assignedCount + pendingCount
      },
      hotspots,
      categories,
      counts: {
        total: totalCount,
        pending: pendingCount,
        assigned: assignedCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        urgent: urgentCount
      }
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Failed to fetch stats: ${err.message}`
    })
  }
})
