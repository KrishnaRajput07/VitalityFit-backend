const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Comment = sequelize.define('Comment', {
    postId: { type: DataTypes.INTEGER, allowNull: false },
    userName: { type: DataTypes.STRING, allowNull: false },
    userAvatar: { type: DataTypes.TEXT },
    content: { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Comment;
