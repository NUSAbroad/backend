'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mappings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nusModuleFaculty: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nusModuleCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nusModuleName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nusModuleCredits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      partnerModuleCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      partnerModuleName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      partnerModuleCredits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      partnerUniversityId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Universities',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('Mappings');
  }
};
