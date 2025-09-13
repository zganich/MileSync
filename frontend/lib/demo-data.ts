import { db, users, trips, mileageGaps } from './db'
import bcrypt from 'bcryptjs'

export async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...')

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 12)
    const demoUser = await db.insert(users).values({
      email: 'demo@milesync.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1-555-0123',
      isActive: true
    }).returning()

    console.log('✅ Demo user created')

    // Create realistic trip data based on gig platform patterns
    const tripData = [
      // Week 1 - Normal driving week
      {
        userId: demoUser[0].id,
        startDate: new Date('2024-01-15T08:00:00Z'),
        endDate: new Date('2024-01-15T12:30:00Z'),
        startMileage: 85420,
        endMileage: 85485,
        totalMiles: 65,
        startLocation: 'Home',
        endLocation: 'Downtown',
        purpose: 'business' as const,
        businessMiles: 65,
        personalMiles: 0,
        notes: 'Morning Uber shifts - 4 trips',
        source: 'manual' as const,
        isVerified: true
      },
      {
        userId: demoUser[0].id,
        startDate: new Date('2024-01-15T18:00:00Z'),
        endDate: new Date('2024-01-15T22:00:00Z'),
        startMileage: 85485,
        endMileage: 85550,
        totalMiles: 65,
        startLocation: 'Downtown',
        endLocation: 'Home',
        purpose: 'business' as const,
        businessMiles: 65,
        personalMiles: 0,
        notes: 'Evening DoorDash deliveries - 6 orders',
        source: 'manual' as const,
        isVerified: true
      },
      {
        userId: demoUser[0].id,
        startDate: new Date('2024-01-16T09:00:00Z'),
        endDate: new Date('2024-01-16T15:00:00Z'),
        startMileage: 85550,
        endMileage: 85680,
        totalMiles: 130,
        startLocation: 'Home',
        endLocation: 'Airport',
        purpose: 'business' as const,
        businessMiles: 130,
        personalMiles: 0,
        notes: 'Airport runs - 3 trips',
        source: 'manual' as const,
        isVerified: true
      },
      // Week 2 - Missing day (gap)
      {
        userId: demoUser[0].id,
        startDate: new Date('2024-01-18T10:00:00Z'),
        endDate: new Date('2024-01-18T16:00:00Z'),
        startMileage: 85680,
        endMileage: 85720,
        totalMiles: 40,
        startLocation: 'Home',
        endLocation: 'Shopping Center',
        purpose: 'business' as const,
        businessMiles: 40,
        personalMiles: 0,
        notes: 'Uber Eats deliveries',
        source: 'manual' as const,
        isVerified: true
      },
      // Week 3 - Unusual high mileage day
      {
        userId: demoUser[0].id,
        startDate: new Date('2024-01-22T07:00:00Z'),
        endDate: new Date('2024-01-22T19:00:00Z'),
        startMileage: 85720,
        endMileage: 85950,
        totalMiles: 230,
        startLocation: 'Home',
        endLocation: 'Home',
        purpose: 'business' as const,
        businessMiles: 230,
        personalMiles: 0,
        notes: 'Long distance deliveries - 12 orders',
        source: 'manual' as const,
        isVerified: true
      },
      // Mixed trip
      {
        userId: demoUser[0].id,
        startDate: new Date('2024-01-23T08:00:00Z'),
        endDate: new Date('2024-01-23T12:00:00Z'),
        startMileage: 85950,
        endMileage: 86020,
        totalMiles: 70,
        startLocation: 'Home',
        endLocation: 'Home',
        purpose: 'mixed' as const,
        businessMiles: 50,
        personalMiles: 20,
        notes: 'Uber rides + personal errands',
        source: 'manual' as const,
        isVerified: true
      }
    ]

    await db.insert(trips).values(tripData)
    console.log('✅ Demo trips created')

    // Create gap data based on the trips
    const gapData = [
      {
        userId: demoUser[0].id,
        gapType: 'date_gap',
        startDate: new Date('2024-01-16T23:59:59Z'),
        endDate: new Date('2024-01-18T00:00:01Z'),
        description: 'Missing trip data for January 17th. No recorded trips between Jan 16th evening and Jan 18th morning.',
        status: 'pending' as const
      },
      {
        userId: demoUser[0].id,
        gapType: 'unusual_pattern',
        startDate: new Date('2024-01-22T07:00:00Z'),
        endDate: new Date('2024-01-22T19:00:00Z'),
        expectedMileage: 120,
        actualMileage: 230,
        missingMiles: 0,
        description: 'Unusually high mileage day: 230 miles vs typical 80-120 miles. Verify all trips were business-related.',
        status: 'pending' as const
      }
    ]

    await db.insert(mileageGaps).values(gapData)
    console.log('✅ Demo gaps created')

    console.log('🎉 Demo data seeding completed!')
    console.log('📧 Demo login: demo@milesync.com')
    console.log('🔑 Demo password: demo123')

    return demoUser[0]
  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    throw error
  }
}
