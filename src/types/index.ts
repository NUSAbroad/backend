import { Model, BuildOptions } from 'sequelize/types';

export type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Model;
};

export type Models = { [key: string]: ModelStatic };
