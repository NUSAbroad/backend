import {
  Model,
  DataTypes,
  Optional,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';

import sequelize from '../database';

import University from './University';
import Faculty from './Faculty';

// Currently we will only be storing NUS modules in this schema
// However, I'm keeping universityId in the event we store information
// about PU modules, in the future.
// universityId with null values will be NUS modules

export interface ModuleAttributes {
  id: number;
  name: string;
  code: string;
  faculty: string | null;
  credits: number;
  universityId: number;
  facultyId: number;
}

export interface ModuleCreationAttributes extends Optional<ModuleAttributes, 'id'> {}

class Module extends Model<ModuleAttributes, ModuleCreationAttributes> implements ModuleAttributes {
  public id!: number;
  public name!: string;
  public faculty!: string | null;
  public code!: string;
  public credits!: number;
  public universityId!: number;
  public facultyId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Module.belongsTo(University)
  public createUniversity!: BelongsToCreateAssociationMixin<University>;
  public getUniversity!: BelongsToGetAssociationMixin<University>;
  public setUniversity!: BelongsToSetAssociationMixin<University, number>;

  // Module.belongsTo(Faculty)
  public createFaculty!: BelongsToCreateAssociationMixin<Faculty>;
  public getFaculty!: BelongsToGetAssociationMixin<Faculty>;
  public setFaculty!: BelongsToSetAssociationMixin<Faculty, number>;

  public readonly University?: University;
  public readonly Faculty?: Faculty;

  public static associations: {
    University: Association<Module, University>;
    Faculty: Association<Module, Faculty>;
  };
}

Module.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    faculty: {
      type: DataTypes.STRING
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Faculties',
        key: 'id'
      }
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Universities',
        key: 'id'
      }
    }
  },
  { sequelize }
);

export default Module;
