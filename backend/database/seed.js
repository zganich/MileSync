const { User, Trip, MileageGap } = require('../backend/models');
const logger = require('../backend/config/logger');

async function seed() {
  try {
    logger.info('Starting database seeding...');
    
    // Create sample user
    const user = await User.create({
      email: 'demo@milesync.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      phone: '5550123456'
    });
    
    logger.info(`Created demo user: ${user.email}`);
    
    // Create sample trips
    const sampleTrips = [
      {
        userId: user.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'),
        startMileage: 10000,
        endMileage: 10050,
        totalMiles: 50,
        purpose: 'business',
        businessMiles: 50,
        source: 'manual',
        notes: 'Client meeting downtown'
      },
      {
        userId: user.id,
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-02'),
        startMileage: 10050,
        endMileage: 10120,
        totalMiles: 70,
        purpose: 'business',
        businessMiles: 70,
        source: 'manual',
        notes: 'Site visit to construction project'
      },
      {
        userId: user.id,
        startDate: new Date('2024-01-04'),
        endDate: new Date('2024-01-04'),
        startMileage: 10120,
        endMileage: 10180,
        totalMiles: 60,
        purpose: 'business',
        businessMiles: 60,
        source: 'manual',
        notes: 'Follow-up meeting with client'
      }
    ];
    
    for (const tripData of sampleTrips) {
      const trip = await Trip.create(tripData);
      logger.info(`Created sample trip: ${trip.id}`);
    }
    
    // Create sample mileage gap (missing day on 2024-01-03)
    const gap = await MileageGap.create({
      userId: user.id,
      gapStartDate: new Date('2024-01-03'),
      gapEndDate: new Date('2024-01-03'),
      startMileage: 10120,
      endMileage: 10120,
      missingMiles: 65,
      gapType: 'date_gap',
      severity: 'medium',
      description: 'Missing mileage data for January 3, 2024',
      suggestedAction: 'Add trip entry or mark as personal use'
    });
    
    logger.info(`Created sample gap: ${gap.id}`);
    
    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
