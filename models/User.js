const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.STRING },
    height: { type: DataTypes.FLOAT },
    weight: { type: DataTypes.FLOAT },
    googleId: { type: DataTypes.STRING },
    avatar: { type: DataTypes.TEXT },
    xp: { type: DataTypes.INTEGER, defaultValue: 0 },
    level: { type: DataTypes.INTEGER, defaultValue: 1 }
});

module.exports = User;
