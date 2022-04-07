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
            type: Sequelize.BOOL,
            allowNull: true,
            defaultValue: 0
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
        RSA_Key:{
            allowNull: true,
            type: Sequelize.STRING
        },
        hash:{
            allowNull: true,
            type: Sequelize.STRING
        },
        fromwhitelist:{
            type: Sequelize.BOOL,
            allowNull: true
        }
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Websites"),
}     
 
