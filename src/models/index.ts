import fs from 'fs';
import path from 'path';
import { Models } from '../types';
import { associate } from './init/associations';

const basename = path.basename(__filename);
const models: Models = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file !== 'init' &&
      !file.endsWith('d.ts') &&
      !file.endsWith('.map')
    );
  })
  .forEach(file => {
    const clazzName = file.substring(0, file.length - 3);
    const model = require(path.join(__dirname, clazzName));
    models[model.default.name] = model.default;
  });

associate(models);

export { default as University } from './University';
export { default as Module } from './Module';
export { default as Mapping } from './Mapping';
export { default as Country } from './Country';
export { default as Link } from './Link';
export { default as Semester } from './Semester';
export { default as Faculty } from './Faculty';
export { default as User } from './User';
