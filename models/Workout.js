const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Workout = sequelize.define('Workout', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // e.g., 'Squat', 'Pushup'
    reps: { type: DataTypes.INTEGER, defaultValue: 0 },
    duration: { type: DataTypes.INTEGER }, // seconds
    calories: { type: DataTypes.FLOAT },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Workout;
