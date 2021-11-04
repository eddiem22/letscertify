const DataTypes= require('sequelize');
const db = require('../config/db');
const Website = require('./Website');

const Category = db.define('category', {
    ID: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Name: {
        type:DataTypes.STRING,
        allowNull: false,
    },
});


//ASSOCIATIONS
Category.hasMany(Website);
Website.belongsTo(Category, {
    foreignKey: 'CategoryID',
    allowNull: false,
});

Category.sync();

module.exports = Category;