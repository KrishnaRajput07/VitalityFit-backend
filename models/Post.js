const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Post = sequelize.define('Post', {
    userName: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    userAvatar: { type: DataTypes.TEXT }, // Cache avatar to show in feed
    image: { type: DataTypes.STRING }, // URL for image
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    tags: { type: DataTypes.JSON },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Post;
