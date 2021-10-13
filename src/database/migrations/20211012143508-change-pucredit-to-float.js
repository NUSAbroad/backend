'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Mappings', 'partnerModuleCredits', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Mappings', 'partnerModuleCredits', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
