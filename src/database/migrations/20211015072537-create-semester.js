'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Semesters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      universityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    await queryInterface.addConstraint('Semesters', {
      fields: ['description', 'universityId'],
      type: 'unique',
      name: 'Semesters_description_unique_per_university_constraint'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'Semesters',
      'Semesters_description_unique_per_university_constraint'
    );
    await queryInterface.dropTable('Semesters');
  }
};
