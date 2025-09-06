const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const { Trip, MileageGap } = require('../models');
const { auth } = require('../middleware/auth');
const gapDetector = require('../services/gapDetector');
const logger = require('../config/logger');

const router = express.Router();

// Validation schemas
const tripSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  startMileage: Joi.number().integer().min(0).required(),
  endMileage: Joi.number().integer().min(0).required(),
  startLocation: Joi.string().max(255).optional(),
  endLocation: Joi.string().max(255).optional(),
  purpose: Joi.string().valid('business', 'personal', 'mixed').default('business'),
  businessMiles: Joi.number().integer().min(0).optional(),
  personalMiles: Joi.number().integer().min(0).optional(),
  notes: Joi.string().max(1000).optional()
});

// @route   GET /api/mileage/trips
// @desc    Get user's trips with optional filtering
// @access  Private
router.get('/trips', auth, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      purpose, 
      page = 1, 
      limit = 50,
      sortBy = 'startDate',
      sortOrder = 'DESC'
    } = req.query;

    const whereClause = { userId: req.user.id };

    // Add date filters
    if (startDate || endDate) {
      whereClause.startDate = {};
      if (startDate) whereClause.startDate[Op.gte] = new Date(startDate);
      if (endDate) whereClause.startDate[Op.lte] = new Date(endDate);
    }

    // Add purpose filter
    if (purpose) {
      whereClause.purpose = purpose;
    }

    const offset = (page - 1) * limit;

    const { count, rows: trips } = await Trip.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error retrieving trips'
    });
  }
});

// @route   POST /api/mileage/trips
// @desc    Create a new trip
// @access  Private
router.post('/trips', auth, async (req, res) => {
  try {
    const { error, value } = tripSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Validate that end mileage is greater than start mileage
    if (value.endMileage <= value.startMileage) {
      return res.status(400).json({
        success: false,
        error: 'End mileage must be greater than start mileage'
      });
    }

    // Validate that end date is not before start date
    if (new Date(value.endDate) < new Date(value.startDate)) {
      return res.status(400).json({
        success: false,
        error: 'End date cannot be before start date'
      });
    }

    const trip = await Trip.create({
      ...value,
      userId: req.user.id,
      source: 'manual'
    });

    // Run gap detection after creating trip
    try {
      await gapDetector.detectGaps(req.user.id);
    } catch (gapError) {
      logger.error('Error running gap detection after trip creation:', gapError);
    }

    logger.info(`Trip created for user ${req.user.id}: ${trip.id}`);

    res.status(201).json({
      success: true,
      data: { trip }
    });

  } catch (error) {
    logger.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating trip'
    });
  }
});

// @route   PUT /api/mileage/trips/:id
// @desc    Update a trip
// @access  Private
router.put('/trips/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = tripSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const trip = await Trip.findOne({
      where: { id, userId: req.user.id }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    await trip.update(value);

    // Run gap detection after updating trip
    try {
      await gapDetector.detectGaps(req.user.id);
    } catch (gapError) {
      logger.error('Error running gap detection after trip update:', gapError);
    }

    logger.info(`Trip updated for user ${req.user.id}: ${trip.id}`);

    res.json({
      success: true,
      data: { trip }
    });

  } catch (error) {
    logger.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating trip'
    });
  }
});

// @route   DELETE /api/mileage/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/trips/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findOne({
      where: { id, userId: req.user.id }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    await trip.destroy();

    // Run gap detection after deleting trip
    try {
      await gapDetector.detectGaps(req.user.id);
    } catch (gapError) {
      logger.error('Error running gap detection after trip deletion:', gapError);
    }

    logger.info(`Trip deleted for user ${req.user.id}: ${id}`);

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    logger.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting trip'
    });
  }
});

// @route   GET /api/mileage/gaps
// @desc    Get user's mileage gaps
// @access  Private
router.get('/gaps', auth, async (req, res) => {
  try {
    const { 
      status = 'open',
      severity,
      gapType,
      page = 1,
      limit = 50
    } = req.query;

    const whereClause = { userId: req.user.id };

    if (status) whereClause.status = status;
    if (severity) whereClause.severity = severity;
    if (gapType) whereClause.gapType = gapType;

    const offset = (page - 1) * limit;

    const { count, rows: gaps } = await MileageGap.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        gaps,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get gaps error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error retrieving gaps'
    });
  }
});

// @route   POST /api/mileage/gaps/detect
// @desc    Manually trigger gap detection
// @access  Private
router.post('/gaps/detect', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const result = await gapDetector.detectGaps(
      req.user.id,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );

    logger.info(`Manual gap detection completed for user ${req.user.id}: ${result.summary.totalGaps} gaps found`);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Gap detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during gap detection'
    });
  }
});

// @route   PUT /api/mileage/gaps/:id/resolve
// @desc    Resolve a mileage gap
// @access  Private
router.put('/gaps/:id/resolve', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    if (!resolutionNotes || resolutionNotes.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Resolution notes are required'
      });
    }

    const gap = await MileageGap.findOne({
      where: { id, userId: req.user.id }
    });

    if (!gap) {
      return res.status(404).json({
        success: false,
        error: 'Gap not found'
      });
    }

    const resolvedGap = await gapDetector.resolveGap(
      id,
      resolutionNotes,
      req.user.id
    );

    logger.info(`Gap resolved by user ${req.user.id}: ${id}`);

    res.json({
      success: true,
      data: { gap: resolvedGap }
    });

  } catch (error) {
    logger.error('Resolve gap error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error resolving gap'
    });
  }
});

// @route   GET /api/mileage/summary
// @desc    Get mileage summary for user
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = { userId: req.user.id };

    if (startDate || endDate) {
      whereClause.startDate = {};
      if (startDate) whereClause.startDate[Op.gte] = new Date(startDate);
      if (endDate) whereClause.startDate[Op.lte] = new Date(endDate);
    }

    const trips = await Trip.findAll({
      where: whereClause,
      attributes: ['totalMiles', 'businessMiles', 'personalMiles', 'purpose', 'startDate']
    });

    const summary = {
      totalTrips: trips.length,
      totalMiles: trips.reduce((sum, trip) => sum + trip.totalMiles, 0),
      businessMiles: trips.reduce((sum, trip) => sum + (trip.businessMiles || 0), 0),
      personalMiles: trips.reduce((sum, trip) => sum + (trip.personalMiles || 0), 0),
      byPurpose: {
        business: trips.filter(t => t.purpose === 'business').length,
        personal: trips.filter(t => t.purpose === 'personal').length,
        mixed: trips.filter(t => t.purpose === 'mixed').length
      },
      averageDailyMiles: trips.length > 0 ? 
        Math.round(trips.reduce((sum, trip) => sum + trip.totalMiles, 0) / trips.length) : 0
    };

    // Get open gaps count
    const openGaps = await MileageGap.count({
      where: { userId: req.user.id, status: 'open' }
    });

    summary.openGaps = openGaps;

    res.json({
      success: true,
      data: { summary }
    });

  } catch (error) {
    logger.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error retrieving summary'
    });
  }
});

module.exports = router;
