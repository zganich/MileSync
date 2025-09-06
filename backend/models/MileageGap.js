const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MileageGap = sequelize.define('MileageGap', {
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
  gapStartDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gapEndDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startMileage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  endMileage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  missingMiles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  gapType: {
    type: DataTypes.ENUM('missing_trip', 'mileage_inconsistency', 'date_gap', 'odometer_rollover'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('open', 'investigating', 'resolved', 'ignored'),
    allowNull: false,
    defaultValue: 'open'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  suggestedAction: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'mileage_gaps',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'status']
    },
    {
      fields: ['gapStartDate', 'gapEndDate']
    },
    {
      fields: ['severity', 'status']
    }
  ]
});

module.exports = MileageGap;
