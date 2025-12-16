const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const NutritionLog = sequelize.define('NutritionLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING, // YYYY-MM-DD
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    calories: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    protein: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    carbs: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    fat: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    quantity: {
        type: DataTypes.FLOAT, // Multiplier or grams
        defaultValue: 1
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = NutritionLog;
