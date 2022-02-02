
module.exports = (sequelize, DataTypes) => {

let Category =sequelize.define('Category', {
    Name: DataTypes.STRING,
});


//ASSOCIATIONS

Category.associate = function(models) {
    Category.hasMany(models.Website, {
    foreignKey: 'categoryID',
    as: 'websites'
})
}

return Category;

}