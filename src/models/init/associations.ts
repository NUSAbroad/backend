import { Models } from '../../types/';

export function associate(models: Models) {
  const { University, Module, Mapping } = models;

  Module.belongsTo(University, { foreignKey: 'universityId' });
  University.hasMany(Module, { foreignKey: 'universityId', onDelete: 'cascade', hooks: true });

  Mapping.belongsTo(University, { foreignKey: 'partnerUniversityId' });
  University.hasMany(Mapping, {
    foreignKey: 'partnerUniversityId',
    onDelete: 'cascade',
    hooks: true
  });
}
