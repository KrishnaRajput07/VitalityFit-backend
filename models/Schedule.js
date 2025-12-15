const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Schedule = sequelize.define('Schedule', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    day: { type: DataTypes.STRING, allowNull: false }, // Mon, Tue...
    muscleGroup: { type: DataTypes.STRING }, // e.g., "Legs", "Chest"
    exercises: { type: DataTypes.JSON }, // Array of strings: ["Squat", "Lunge"]
    time: { type: DataTypes.STRING, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    notes: { type: DataTypes.TEXT } // Optional notes
});

module.exports = Schedule;
