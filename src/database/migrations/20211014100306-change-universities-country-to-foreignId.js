'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Universities', 'country');

    await queryInterface.addColumn('Universities', 'countryId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Universities', 'countryId');

    await queryInterface.addColumn('Universities', 'country', {
      type: Sequelize.STRING
    });
  }
};
