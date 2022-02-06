
module.exports = {
up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Categories", {

    id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    Name: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        },
    updatedAt: {
         allowNull: false,
        type: Sequelize.DATE,
        },
}),
down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Categories"),
}
