const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Club = sequelize.define('Club', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    members: { type: DataTypes.INTEGER, defaultValue: 1 },
    icon: { type: DataTypes.STRING } // emoji or url
});

module.exports = Club;
