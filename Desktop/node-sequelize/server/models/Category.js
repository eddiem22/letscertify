
module.exports = (sequelize, DataTypes) => {

let Category =sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}
);


//ASSOCIATIONS

Category.associate = function(models) {
    Category.hasMany(models.Website, {
    foreignKey: "categoryID",
    foreignKeyConstraint: true,
})
}
Category.sync()
return Category;


}