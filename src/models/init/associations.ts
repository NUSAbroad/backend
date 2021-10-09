import { Models } from '../../types/';

export function associate(models: Models) {
  const { University, Module, Mapping } = models;

  Module.belongsTo(University, { foreignKey: 'universityId' });
  University.hasMany(Module, { foreignKey: 'universityId' });

  Mapping.belongsTo(University, { foreignKey: 'partnerUniversityId' });
  University.hasMany(Mapping, { foreignKey: 'partnerUniversityId' });
}
