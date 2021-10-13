'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Universities', 'slug', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Universities', 'slug');
  }
};
