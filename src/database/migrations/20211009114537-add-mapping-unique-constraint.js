'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('Mappings', {
      fields: ['nusModuleCode', 'partnerModuleCode', 'partnerUniversityId'],
      type: 'unique',
      name: 'Mapping_Code_unique_per_university_constraint'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'Mappings',
      'Mapping_Code_unique_per_university_constraint'
    );
  }
};
