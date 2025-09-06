const { Trip, MileageGap } = require('../models');
const moment = require('moment');
const logger = require('../config/logger');

class GapDetector {
  constructor() {
    this.gapThresholds = {
      maxDailyMiles: 500,      // Maximum reasonable miles per day
      minGapMiles: 10,         // Minimum miles to consider a gap
      maxGapDays: 30,          // Maximum days to look back for gaps
      odometerRollover: 999999 // Odometer rollover threshold
    };
  }

  async detectGaps(userId, startDate = null, endDate = null) {
    try {
      logger.info(`Detecting gaps for user ${userId}`);
      
      // Get user's trips within date range
      const trips = await this.getUserTrips(userId, startDate, endDate);
      
      if (trips.length === 0) {
        logger.info(`No trips found for user ${userId}`);
        return { gaps: [], summary: { totalGaps: 0, totalMissingMiles: 0 } };
      }
      
      // Sort trips by date
      trips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      
      // Detect different types of gaps
      const gaps = [];
      
      // 1. Date gaps (missing days between trips)
      gaps.push(...this.detectDateGaps(trips, userId));
      
      // 2. Mileage inconsistencies
      gaps.push(...this.detectMileageInconsistencies(trips, userId));
      
      // 3. Odometer rollover detection
      gaps.push(...this.detectOdometerRollover(trips, userId));
      
      // 4. Unusual mileage patterns
      gaps.push(...this.detectUnusualPatterns(trips, userId));
      
      // Save gaps to database
      const savedGaps = await this.saveGaps(gaps);
      
      const summary = this.generateGapSummary(savedGaps);
      
      logger.info(`Detected ${savedGaps.length} gaps for user ${userId}`);
      
      return {
        gaps: savedGaps,
        summary
      };
      
    } catch (error) {
      logger.error(`Error detecting gaps for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserTrips(userId, startDate, endDate) {
    const whereClause = { userId };
    
    if (startDate || endDate) {
      whereClause.startDate = {};
      if (startDate) whereClause.startDate[Op.gte] = startDate;
      if (endDate) whereClause.startDate[Op.lte] = endDate;
    }
    
    return await Trip.findAll({
      where: whereClause,
      order: [['startDate', 'ASC']]
    });
  }

  detectDateGaps(trips, userId) {
    const gaps = [];
    
    for (let i = 0; i < trips.length - 1; i++) {
      const currentTrip = trips[i];
      const nextTrip = trips[i + 1];
      
      const currentEndDate = moment(currentTrip.endDate);
      const nextStartDate = moment(nextTrip.startDate);
      const daysBetween = nextStartDate.diff(currentEndDate, 'days');
      
      // If there's a gap of more than 1 day
      if (daysBetween > 1) {
        const gapStartDate = currentEndDate.clone().add(1, 'day');
        const gapEndDate = nextStartDate.clone().subtract(1, 'day');
        
        // Estimate missing mileage based on average daily usage
        const estimatedMissingMiles = this.estimateMissingMiles(trips, daysBetween);
        
        if (estimatedMissingMiles >= this.gapThresholds.minGapMiles) {
          gaps.push({
            userId,
            gapStartDate: gapStartDate.toDate(),
            gapEndDate: gapEndDate.toDate(),
            startMileage: currentTrip.endMileage,
            endMileage: nextTrip.startMileage,
            missingMiles: estimatedMissingMiles,
            gapType: 'date_gap',
            severity: this.calculateSeverity(estimatedMissingMiles, daysBetween),
            description: `Missing ${daysBetween} days of mileage data between ${gapStartDate.format('MM/DD/YYYY')} and ${gapEndDate.format('MM/DD/YYYY')}`,
            suggestedAction: 'Review calendar and add missing trip entries or mark as personal use'
          });
        }
      }
    }
    
    return gaps;
  }

  detectMileageInconsistencies(trips, userId) {
    const gaps = [];
    
    for (let i = 0; i < trips.length - 1; i++) {
      const currentTrip = trips[i];
      const nextTrip = trips[i + 1];
      
      // Check if end mileage of current trip matches start mileage of next trip
      if (currentTrip.endMileage !== nextTrip.startMileage) {
        const mileageDifference = Math.abs(nextTrip.startMileage - currentTrip.endMileage);
        
        if (mileageDifference >= this.gapThresholds.minGapMiles) {
          gaps.push({
            userId,
            gapStartDate: currentTrip.endDate,
            gapEndDate: nextTrip.startDate,
            startMileage: currentTrip.endMileage,
            endMileage: nextTrip.startMileage,
            missingMiles: mileageDifference,
            gapType: 'mileage_inconsistency',
            severity: this.calculateSeverity(mileageDifference, 1),
            description: `Mileage inconsistency: Trip ended at ${currentTrip.endMileage} but next trip started at ${nextTrip.startMileage}`,
            suggestedAction: 'Verify odometer readings and correct mileage entries'
          });
        }
      }
    }
    
    return gaps;
  }

  detectOdometerRollover(trips, userId) {
    const gaps = [];
    
    for (let i = 0; i < trips.length - 1; i++) {
      const currentTrip = trips[i];
      const nextTrip = trips[i + 1];
      
      // Check for odometer rollover (next trip starts with lower mileage)
      if (nextTrip.startMileage < currentTrip.endMileage) {
        const rolloverMiles = (this.gapThresholds.odometerRollover - currentTrip.endMileage) + nextTrip.startMileage;
        
        gaps.push({
          userId,
          gapStartDate: currentTrip.endDate,
          gapEndDate: nextTrip.startDate,
          startMileage: currentTrip.endMileage,
          endMileage: nextTrip.startMileage,
          missingMiles: rolloverMiles,
          gapType: 'odometer_rollover',
          severity: 'medium',
          description: `Odometer rollover detected: Trip ended at ${currentTrip.endMileage} and next trip started at ${nextTrip.startMileage}`,
          suggestedAction: 'Confirm odometer rollover and adjust mileage calculations accordingly'
        });
      }
    }
    
    return gaps;
  }

  detectUnusualPatterns(trips, userId) {
    const gaps = [];
    
    trips.forEach((trip, index) => {
      // Check for unusually high daily mileage
      const tripDuration = moment(trip.endDate).diff(moment(trip.startDate), 'days') + 1;
      const dailyMiles = trip.totalMiles / tripDuration;
      
      if (dailyMiles > this.gapThresholds.maxDailyMiles) {
        gaps.push({
          userId,
          gapStartDate: trip.startDate,
          gapEndDate: trip.endDate,
          startMileage: trip.startMileage,
          endMileage: trip.endMileage,
          missingMiles: 0, // Not missing, just unusual
          gapType: 'unusual_pattern',
          severity: 'high',
          description: `Unusually high daily mileage: ${Math.round(dailyMiles)} miles per day over ${tripDuration} days`,
          suggestedAction: 'Verify trip details and consider breaking into multiple trips'
        });
      }
      
      // Check for negative mileage
      if (trip.totalMiles < 0) {
        gaps.push({
          userId,
          gapStartDate: trip.startDate,
          gapEndDate: trip.endDate,
          startMileage: trip.startMileage,
          endMileage: trip.endMileage,
          missingMiles: Math.abs(trip.totalMiles),
          gapType: 'mileage_inconsistency',
          severity: 'critical',
          description: `Negative mileage detected: ${trip.totalMiles} miles`,
          suggestedAction: 'Check and correct odometer readings'
        });
      }
    });
    
    return gaps;
  }

  estimateMissingMiles(trips, daysBetween) {
    // Calculate average daily mileage from existing trips
    const totalMiles = trips.reduce((sum, trip) => {
      const duration = moment(trip.endDate).diff(moment(trip.startDate), 'days') + 1;
      return sum + (trip.totalMiles / duration);
    }, 0);
    
    const averageDailyMiles = totalMiles / trips.length;
    
    // Return estimated missing miles
    return Math.round(averageDailyMiles * daysBetween);
  }

  calculateSeverity(missingMiles, daysBetween) {
    if (missingMiles > 1000 || daysBetween > 7) return 'critical';
    if (missingMiles > 500 || daysBetween > 3) return 'high';
    if (missingMiles > 100 || daysBetween > 1) return 'medium';
    return 'low';
  }

  async saveGaps(gaps) {
    const savedGaps = [];
    
    for (const gap of gaps) {
      try {
        // Check if gap already exists
        const existingGap = await MileageGap.findOne({
          where: {
            userId: gap.userId,
            gapStartDate: gap.gapStartDate,
            gapEndDate: gap.gapEndDate,
            gapType: gap.gapType
          }
        });
        
        if (!existingGap) {
          const savedGap = await MileageGap.create(gap);
          savedGaps.push(savedGap);
        }
      } catch (error) {
        logger.error('Error saving gap:', error);
      }
    }
    
    return savedGaps;
  }

  generateGapSummary(gaps) {
    const summary = {
      totalGaps: gaps.length,
      totalMissingMiles: gaps.reduce((sum, gap) => sum + gap.missingMiles, 0),
      bySeverity: {
        critical: gaps.filter(g => g.severity === 'critical').length,
        high: gaps.filter(g => g.severity === 'high').length,
        medium: gaps.filter(g => g.severity === 'medium').length,
        low: gaps.filter(g => g.severity === 'low').length
      },
      byType: {
        date_gap: gaps.filter(g => g.gapType === 'date_gap').length,
        mileage_inconsistency: gaps.filter(g => g.gapType === 'mileage_inconsistency').length,
        odometer_rollover: gaps.filter(g => g.gapType === 'odometer_rollover').length,
        unusual_pattern: gaps.filter(g => g.gapType === 'unusual_pattern').length
      }
    };
    
    return summary;
  }

  async resolveGap(gapId, resolutionNotes, resolvedBy) {
    try {
      const gap = await MileageGap.findByPk(gapId);
      
      if (!gap) {
        throw new Error('Gap not found');
      }
      
      await gap.update({
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy,
        resolutionNotes
      });
      
      logger.info(`Gap ${gapId} resolved by user ${resolvedBy}`);
      
      return gap;
    } catch (error) {
      logger.error(`Error resolving gap ${gapId}:`, error);
      throw error;
    }
  }
}

module.exports = new GapDetector();
