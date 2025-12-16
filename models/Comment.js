const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Comment = sequelize.define('Comment', {
    postId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // Added for ownership
    userName: { type: DataTypes.STRING, allowNull: false },
    userAvatar: { type: DataTypes.TEXT },
    content: { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Comment;
