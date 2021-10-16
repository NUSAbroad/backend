import {
  Model,
  DataTypes,
  Optional,
  Association,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';

import sequelize from '../database';
import University from './University';
import Mapping from './Mapping';
import Module from './Module';

export interface FacultyAttributes {
  id: number;
  name: string;
  type: string;
  universityId: number;
}

export interface FacultyCreationAttributes extends Optional<FacultyAttributes, 'id'> {}

class Faculty
  extends Model<FacultyAttributes, FacultyCreationAttributes>
  implements FacultyAttributes
{
  public id!: number;
  public name!: string;
  public type!: string;
  public universityId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Faculty.belongsTo(University)
  public createUniversity!: BelongsToCreateAssociationMixin<University>;
  public getUniversity!: BelongsToGetAssociationMixin<University>;
  public setUniversity!: BelongsToSetAssociationMixin<University, number>;

  // Faculty.hasMany(Mapping)
  public addMapping!: HasManyAddAssociationMixin<Mapping, number>;
  public addMappings!: HasManyAddAssociationsMixin<Mapping, number>;
  public countMappings!: HasManyCountAssociationsMixin;
  public createMappings!: HasManyCreateAssociationMixin<Mapping>;
  public getMappings!: HasManyGetAssociationsMixin<Mapping>;
  public hasMapping!: HasManyHasAssociationMixin<Mapping, number>;
  public hasMappings!: HasManyHasAssociationsMixin<Mapping, number>;
  public removeMapping!: HasManyRemoveAssociationMixin<Mapping, number>;
  public removeMappings!: HasManyRemoveAssociationsMixin<Mapping, number>;
  public setMappings!: HasManySetAssociationsMixin<Mapping, number>;

  // Faculty.hasMany(Module)
  public addModule!: HasManyAddAssociationMixin<Module, number>;
  public addModules!: HasManyAddAssociationsMixin<Module, number>;
  public countModules!: HasManyCountAssociationsMixin;
  public createModules!: HasManyCreateAssociationMixin<Module>;
  public getModules!: HasManyGetAssociationsMixin<Module>;
  public hasModule!: HasManyHasAssociationMixin<Module, number>;
  public hasModules!: HasManyHasAssociationsMixin<Module, number>;
  public removeModule!: HasManyRemoveAssociationMixin<Module, number>;
  public removeModules!: HasManyRemoveAssociationsMixin<Module, number>;
  public setModules!: HasManySetAssociationsMixin<Module, number>;

  public readonly University?: University;
  public readonly Modules?: Module[];
  public readonly Mappings?: Mapping[];

  public static associations: {
    University: Association<Faculty, University>;
    Modules: Association<Faculty, Module>;
    Mappings: Association<Faculty, Mapping>;
  };
}

Faculty.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
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

export default Faculty;
