import { Models } from '../../types/';

export function associate(models: Models) {
  const { University, Module } = models;

  Module.belongsTo(University, { foreignKey: 'universityId' });
  University.hasMany(Module, { foreignKey: 'universityId' });
}
