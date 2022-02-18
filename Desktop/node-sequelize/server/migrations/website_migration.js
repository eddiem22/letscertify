module.exports = {
      up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Websites", {
        id: {
            type:Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,

        },
        URL: {
            type:Sequelize.STRING,
            allowNull: false,
         
        },
        securityFlag: {
            type: Sequelize.INTEGER(0,1),
            allowNull: true,
            defaultValue: 1
        },
        categoryID: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: true,
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
  //down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Websites"),
}     
 