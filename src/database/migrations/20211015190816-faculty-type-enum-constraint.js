'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('Faculties', {
      fields: ['type'],
      type: 'check',
      where: {
        type: ['NUS', 'PU']
      },
      name: 'Faculty_type_enum_per_university_constraint'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'Faculties',
      'Faculty_type_enum_per_university_constraint'
    );
  }
};
