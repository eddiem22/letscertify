module.exports= (sequelize, DataTypes) => {

let Website = sequelize.define('Website', {
    id:
    {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },  
    URL:
    {
    allowNull: false,
    type: DataTypes.STRING,
    },

    securityFlag: {

        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,

    },
    categoryID: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
    RSA_Key:{
        allowNull: true,
        type: DataTypes.STRING
    },
    hash:{
        allowNull: true,
        type: DataTypes.STRING
    },
    fromwhitelist:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    }

});

Website.associate = function(models) {
Website.belongsTo(models.Category, {
    foreignKey: "categoryID",
    foreignKeyConstraint: true,

})
}
Website.sync()
return Website;
}