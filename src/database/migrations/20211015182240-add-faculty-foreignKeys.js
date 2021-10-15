'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Modules', 'facultyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Faculties',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Mappings', 'nusFacultyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Faculties',
        key: 'id'
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Modules', 'facultyId');
    await queryInterface.removeColumn('Mappings', 'nusFacultyId');
  }
};
