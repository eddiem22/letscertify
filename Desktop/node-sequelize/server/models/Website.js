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

        type: DataTypes.INTEGER(0,1),
        allowNull: true,
        defaultValue: 1,

    },
    categoryID: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
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