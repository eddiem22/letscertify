module.exports = (sequelize, Sequelize) => {
const Website = sequelize.define('website', {
    ID: {
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    URL: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    securityFlag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    fromWhitelist:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

return Website;
};