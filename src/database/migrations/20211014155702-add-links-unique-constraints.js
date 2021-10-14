'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('Links', {
      fields: ['name', 'universityId'],
      type: 'unique',
      name: 'Links_name_unique_per_university_constraint'
    });

    await queryInterface.addConstraint('Links', {
      fields: ['link', 'universityId'],
      type: 'unique',
      name: 'Links_link_unique_per_university_constraint'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint('Links', 'Links_name_unique_per_university_constraint');
    await queryInterface.removeConstraint('Links', 'Links_link_unique_per_university_constraint');
  }
};
