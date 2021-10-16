'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('Faculties', {
      fields: ['name', 'universityId'],
      type: 'unique',
      name: 'Faculty_name_unique_per_university_constraint'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'Faculties',
      'Faculty_name_unique_per_university_constraint'
    );
  }
};
