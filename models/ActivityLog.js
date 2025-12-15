const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ActivityLog = sequelize.define('ActivityLog', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY, // YYYY-MM-DD format
        allowNull: false,
    },
    exerciseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    repsOrMinutes: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING, // 'reps' or 'minutes'
        allowNull: false,
    },
    caloriesBurned: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    weightKg: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

module.exports = ActivityLog;
