const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Trip } = require('../models');
const { auth } = require('../middleware/auth');
const pdfProcessor = require('../services/pdfProcessor');
const gapDetector = require('../services/gapDetector');
const logger = require('../config/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `mileage-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// @route   POST /api/upload/pdf
// @desc    Upload and process PDF mileage document
// @access  Private
router.post('/pdf', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file uploaded'
      });
    }

    logger.info(`Processing PDF upload for user ${req.user.id}: ${req.file.filename}`);

    // Process the PDF
    const result = await pdfProcessor.processPDF(req.file.path);

    if (!result.success) {
      // Clean up uploaded file
      await fs.unlink(req.file.path);
      
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    // Validate extracted data
    const validation = pdfProcessor.validateExtractedData(result.data);
    
    if (!validation.isValid) {
      logger.warn(`PDF validation issues for user ${req.user.id}:`, validation.issues);
    }

    // Save trips to database
    const savedTrips = [];
    if (result.data.trips && result.data.trips.length > 0) {
      for (const tripData of result.data.trips) {
        try {
          const trip = await Trip.create({
            userId: req.user.id,
            startDate: tripData.date,
            endDate: tripData.date, // Single day trip
            startMileage: tripData.startMileage,
            endMileage: tripData.endMileage,
            totalMiles: tripData.totalMiles,
            purpose: 'business',
            businessMiles: tripData.totalMiles,
            source: 'pdf_upload',
            sourceFile: req.file.filename,
            isVerified: false
          });
          
          savedTrips.push(trip);
        } catch (error) {
          logger.error(`Error saving trip for user ${req.user.id}:`, error);
        }
      }
    }

    // Run gap detection after processing
    let gapResults = null;
    if (savedTrips.length > 0) {
      try {
        gapResults = await gapDetector.detectGaps(req.user.id);
      } catch (error) {
        logger.error(`Error running gap detection for user ${req.user.id}:`, error);
      }
    }

    logger.info(`PDF processing complete for user ${req.user.id}: ${savedTrips.length} trips saved`);

    res.json({
      success: true,
      data: {
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          uploadedAt: new Date()
        },
        processing: {
          textLength: result.data.textContent.length,
          pageCount: result.data.pageCount,
          fileSize: result.data.fileSize
        },
        extracted: {
          mileageEntries: result.data.mileageData.length,
          dates: result.data.dates.length,
          trips: result.data.trips.length
        },
        saved: {
          trips: savedTrips.length,
          tripsData: savedTrips.map(trip => ({
            id: trip.id,
            date: trip.startDate,
            startMileage: trip.startMileage,
            endMileage: trip.endMileage,
            totalMiles: trip.totalMiles
          }))
        },
        validation: validation,
        gaps: gapResults ? {
          totalGaps: gapResults.summary.totalGaps,
          totalMissingMiles: gapResults.summary.totalMissingMiles,
          bySeverity: gapResults.summary.bySeverity
        } : null
      }
    });

  } catch (error) {
    logger.error('PDF upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error('Error cleaning up uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error during PDF processing'
    });
  }
});

// @route   GET /api/upload/files
// @desc    Get list of uploaded files for user
// @access  Private
router.get('/files', auth, async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { 
        userId: req.user.id,
        source: 'pdf_upload'
      },
      attributes: ['sourceFile', 'createdAt'],
      group: ['sourceFile', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const files = trips.map(trip => ({
      filename: trip.sourceFile,
      uploadedAt: trip.createdAt
    }));

    res.json({
      success: true,
      data: { files }
    });

  } catch (error) {
    logger.error('Get uploaded files error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error retrieving uploaded files'
    });
  }
});

// @route   DELETE /api/upload/files/:filename
// @desc    Delete uploaded file and associated trips
// @access  Private
router.delete('/files/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;

    // Find trips associated with this file
    const trips = await Trip.findAll({
      where: {
        userId: req.user.id,
        sourceFile: filename
      }
    });

    if (trips.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found or no trips associated with this file'
      });
    }

    // Delete trips
    await Trip.destroy({
      where: {
        userId: req.user.id,
        sourceFile: filename
      }
    });

    // Delete physical file
    const filePath = path.join(__dirname, '../../uploads', filename);
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      logger.warn(`Could not delete physical file ${filename}:`, unlinkError);
    }

    logger.info(`Deleted file ${filename} and ${trips.length} associated trips for user ${req.user.id}`);

    res.json({
      success: true,
      message: `Deleted file and ${trips.length} associated trips`
    });

  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during file deletion'
    });
  }
});

module.exports = router;
