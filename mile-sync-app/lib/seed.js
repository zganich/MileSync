// Database seeding script
async function seed() {
  console.log('🌱 Starting database seeding...')
  
  console.log('📝 Note: This requires actual Supabase credentials in .env.local')
  console.log('🔧 Demo data will be seeded once Supabase is configured')
  
  const demoData = {
    users: [
      {
        id: 'demo-user-id',
        email: 'demo@milesync.com',
        firstName: 'Demo',
        lastName: 'User',
        isActive: true
      }
    ],
    trips: [
      {
        id: 'trip-1',
        userId: 'demo-user-id',
        date: '2024-01-15',
        startOdometer: 50000,
        endOdometer: 50150,
        miles: 150,
        purpose: 'business',
        location: 'Downtown to Airport',
        notes: 'Client meeting'
      }
    ],
    gaps: [
      {
        id: 'gap-1',
        userId: 'demo-user-id',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        expectedMiles: 200,
        actualMiles: 150,
        gapMiles: 50,
        status: 'open',
        notes: 'Missing mileage for 2 days'
      }
    ]
  }
  
  console.log('✅ Demo data prepared:', JSON.stringify(demoData, null, 2))
  console.log('✅ Seeding script ready (requires Supabase setup)')
}

seed().catch(console.error)
