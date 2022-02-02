module.exports= (sequelize, DataTypes) => {

let Website = sequelize.define('Website', {
    URL:
    {
    allowNull: false,
    type: DataTypes.STRING,
    },
    id:
    {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    securityFlag: {
        type: DataTypes.ENUM(0,1),
        allowNull: false,
        defaultValue: 1,
    },
    categoryID: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true,
    },
})
Website.associate = function(models) {
Website.belongsTo(models.Category, {
    foreignKey: 'categoryID',
    onDelete: "CASCADE"
})
}

return Website;
}