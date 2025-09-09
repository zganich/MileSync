const { sequelize } = require('../config/database');
const logger = require('../config/logger');
const { User, Trip, MileageGap } = require('../models');

async function migrate() {
  try {
    logger.info('Starting database migration...');
    
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established');
    
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ force: false });
    logger.info('Database models synchronized');
    
    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
