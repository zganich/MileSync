const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startMileage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  endMileage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalMiles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  startLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  purpose: {
    type: DataTypes.ENUM('business', 'personal', 'mixed'),
    allowNull: false,
    defaultValue: 'business'
  },
  businessMiles: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  personalMiles: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  source: {
    type: DataTypes.ENUM('manual', 'pdf_upload', 'gps_tracking'),
    allowNull: false,
    defaultValue: 'manual'
  },
  sourceFile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'trips',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'startDate']
    },
    {
      fields: ['startDate', 'endDate']
    }
  ]
});

// Virtual field for calculating total miles
Trip.addHook('beforeValidate', (trip) => {
  if (trip.startMileage && trip.endMileage) {
    trip.totalMiles = trip.endMileage - trip.startMileage;
  }
});

module.exports = Trip;
