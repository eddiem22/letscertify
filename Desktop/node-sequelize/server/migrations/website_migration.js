module.exports = {
      up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Websites", {

        id: {
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
            type: Sequelize.ENUM(0,1),
            allowNull: false,
            defaultValue: 1
        },
        categoryID: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: true,
            onDelete: "CASCADE",
            references: {
                model: "Categories",
                key: "id",
                as: "categoryID",
            },
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
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Websites"),
}     
 