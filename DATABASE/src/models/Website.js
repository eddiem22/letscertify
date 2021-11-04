const { DataTypes, Deferrable } = require('sequelize');
const db = require('../config/db');


const Website = db.define('website', {
    ID: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    URL: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    securityFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    fromWhitelist:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    CategoryID: {
        type: DataTypes.INTEGER,
        deferrable: Deferrable.INITIALLY_DEFERRED,
        allowNull: false,
    },
});

Website.sync();

module.exports = Website;