import { Models } from '../../types/';

export function associate(models: Models) {
  const { University, Module, Mapping, Country, Link, Semester, Faculty } = models;

  Module.belongsTo(University, { foreignKey: 'universityId' });
  University.hasMany(Module, { foreignKey: 'universityId', onDelete: 'cascade', hooks: true });

  Mapping.belongsTo(University, { foreignKey: 'partnerUniversityId' });
  University.hasMany(Mapping, {
    foreignKey: 'partnerUniversityId',
    onDelete: 'cascade',
    hooks: true
  });

  University.belongsTo(Country, { foreignKey: 'countryId' });
  Country.hasMany(University, {
    foreignKey: 'countryId',
    onDelete: 'cascade',
    hooks: true
  });

  Link.belongsTo(University, { foreignKey: 'universityId' });
  University.hasMany(Link, { foreignKey: 'universityId', onDelete: 'cascade', hooks: true });

  Semester.belongsTo(University, { foreignKey: 'universityId' });
  University.hasMany(Semester, { foreignKey: 'universityId', onDelete: 'cascade', hooks: true });

  Faculty.belongsTo(University, { foreignKey: 'universityId' });
  University.hasMany(Faculty, { foreignKey: 'universityId', onDelete: 'cascade', hooks: true });
}
