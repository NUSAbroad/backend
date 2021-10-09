'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('Modules', {
      fields: ['code', 'universityId'],
      type: 'unique',
      name: 'Module_Code_unique_per_university_constraint'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'Modules',
      'Module_Code_unique_per_university_constraint'
    );
  }
};
