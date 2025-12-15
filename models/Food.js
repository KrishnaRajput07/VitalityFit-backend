const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Food = sequelize.define('Food', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    calories: { type: DataTypes.FLOAT },
    protein: { type: DataTypes.FLOAT },
    carbs: { type: DataTypes.FLOAT },
    fat: { type: DataTypes.FLOAT },
    image: { type: DataTypes.STRING }
});

module.exports = Food;
