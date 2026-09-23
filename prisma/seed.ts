import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding UniLoop SPU database...')

  // Clear existing
  await prisma.statusLog.deleteMany()
  await prisma.ticket.deleteMany()

  const tickets = [
    {
      id: 'SPU-8821',
      building: 'Building 11',
      floor: '5',
      room: '11-502 (Multimedia Lab)',
      category: 'Air Conditioner',
      urgency: 'Urgent',
      description: 'Water leaking heavily from cassette AC unit over lecture desk 14. Loud humming vibration sound since 9:00 AM lecture started.',
      image_before_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      image_after_url: null,
      reporter_email: 'praew.suk@spu.ac.th',
      reporter_name: 'Praew Suksom',
      status: 'IN_PROGRESS',
      assigned_tech: 'Somchai K.',
      sla_time: '18m left (urgent)',
      likes: 12,
      comments_count: 3,
      rating: null,
      created_at: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      logs: [
        { status_step: 'Received', note: 'Report received automatically via Room QR Code', created_at: new Date(Date.now() - 1000 * 60 * 45) },
        { status_step: 'Assigned', note: 'Dispatched to Tech Somchai K. (Zone 11 Specialist)', created_at: new Date(Date.now() - 1000 * 60 * 30) },
        { status_step: 'Working', note: 'Technician update: Working on drainage pipe flush & clearing drip tray.', created_at: new Date(Date.now() - 1000 * 60 * 15) }
      ]
    },
    {
      id: 'SPU-8824',
      building: 'Building 5',
      floor: '1',
      room: 'Restroom Comm Arts Ground Floor',
      category: 'Sanitary / Plumbing',
      urgency: 'Normal',
      description: 'Flush valve leaking and handle loose in stall 2.',
      image_before_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      image_after_url: null,
      reporter_email: 'kirtipong.c@spu.ac.th',
      reporter_name: 'Kirtipong C.',
      status: 'PENDING',
      assigned_tech: null,
      sla_time: '45m elapsed',
      likes: 4,
      comments_count: 1,
      rating: null,
      created_at: new Date(Date.now() - 1000 * 60 * 55),
      logs: [
        { status_step: 'Received', note: 'Ticket logged into central triage queue', created_at: new Date(Date.now() - 1000 * 60 * 55) }
      ]
    },
    {
      id: 'SPU-8815',
      building: 'Central Library',
      floor: '2',
      room: 'Silent Study Zone D',
      category: 'Lighting & Power',
      urgency: 'Normal',
      description: 'Flickering ceiling LED panel causing distraction in reading area.',
      image_before_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      image_after_url: null,
      reporter_email: 'dr.anan.p@spu.ac.th',
      reporter_name: 'Dr. Anan P.',
      status: 'IN_PROGRESS',
      assigned_tech: 'Niran T.',
      sla_time: '1h 12m left',
      likes: 8,
      comments_count: 2,
      rating: null,
      created_at: new Date(Date.now() - 1000 * 60 * 120),
      logs: [
        { status_step: 'Received', note: 'Logged via manual location search', created_at: new Date(Date.now() - 1000 * 60 * 120) },
        { status_step: 'Assigned', note: 'Technician Niran T. dispatched with replacement LED ballast', created_at: new Date(Date.now() - 1000 * 60 * 60) },
        { status_step: 'Working', note: 'Replacing LED panel ballast unit', created_at: new Date(Date.now() - 1000 * 60 * 30) }
      ]
    },
    {
      id: 'SPU-8794',
      building: 'Building 5',
      floor: '3',
      room: '5-301 (Smart Seminar Hall)',
      category: 'Projector / PC',
      urgency: 'Normal',
      description: 'HDMI signal flickering violently and lamp showing blinking warning light during morning lecture.',
      image_before_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      image_after_url: null,
      reporter_email: 'siriporn.m@spu.ac.th',
      reporter_name: 'Prof. Siriporn M.',
      status: 'PENDING',
      assigned_tech: null,
      sla_time: 'Estimated review: ~30 mins',
      likes: 5,
      comments_count: 1,
      rating: null,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
      logs: [
        { status_step: 'Received', note: 'Report submitted by faculty member', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24) }
      ]
    },
    {
      id: 'SPU-8650',
      building: 'Central Library',
      floor: '3',
      room: '3rd Floor Quiet Zone',
      category: 'Desk & Chair',
      urgency: 'Normal',
      description: 'Broken hydraulic lift cylinder on ergonomic study chair replaced with new OEM unit.',
      image_before_url: 'https://images.unsplash.com/photo-1580481077195-c22e4d0d08a9?auto=format&fit=crop&w=800&q=80',
      image_after_url: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
      reporter_email: 'nattdanai.k@spu.ac.th',
      reporter_name: 'Nattdanai K.',
      status: 'RESOLVED',
      assigned_tech: 'Somchai K.',
      sla_time: 'Done in 42m',
      likes: 18,
      comments_count: 5,
      rating: 5,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      logs: [
        { status_step: 'Received', note: 'Ticket logged from Library circulation desk', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
        { status_step: 'Assigned', note: 'Assigned to Somchai K.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 15) },
        { status_step: 'Fixed', note: 'Hydraulic lift cylinder replaced with new OEM part', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 35) },
        { status_step: 'Resolved', note: 'Quality check passed, verified by library coordinator', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 42) }
      ]
    },
    {
      id: 'SPU-8820',
      building: 'Building 11',
      floor: '2',
      room: '11-204 (Digital Media Studio)',
      category: 'Lighting & Power',
      urgency: 'Urgent',
      description: 'Main studio fluorescent rack short-circuited. Circuit breaker tripped during recording session.',
      image_before_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      image_after_url: null,
      reporter_email: 'pitchaya.w@spu.ac.th',
      reporter_name: 'Pitchaya W.',
      status: 'IN_PROGRESS',
      assigned_tech: 'Niran T.',
      sla_time: '22m left',
      likes: 7,
      comments_count: 2,
      rating: null,
      created_at: new Date(Date.now() - 1000 * 60 * 80),
      logs: [
        { status_step: 'Received', note: 'Urgent electrical alert logged', created_at: new Date(Date.now() - 1000 * 60 * 80) },
        { status_step: 'Assigned', note: 'Assigned to Senior Electrician Niran T.', created_at: new Date(Date.now() - 1000 * 60 * 50) },
        { status_step: 'Working', note: 'Circuit isolated and load test underway', created_at: new Date(Date.now() - 1000 * 60 * 25) }
      ]
    }
  ]

  for (const t of tickets) {
    const { logs, ...ticketData } = t
    await prisma.ticket.create({
      data: {
        ...ticketData,
        status_logs: {
          create: logs
        }
      }
    })
  }

  console.log(`Seeding completed! ${tickets.length} tickets created.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
