const User = require('./User');
const Trip = require('./Trip');
const MileageGap = require('./MileageGap');

// Define associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(MileageGap, { foreignKey: 'userId', as: 'mileageGaps' });
MileageGap.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Self-referencing association for resolved by
MileageGap.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

module.exports = {
  User,
  Trip,
  MileageGap
};
