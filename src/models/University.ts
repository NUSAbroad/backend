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
import Module from './Module';
import Mapping from './Mapping';
import Country from './Country';

export interface UniversityAttributes {
  id: number;
  name: string;
  countryId: number;
  state: string | null;
  slug: string;
  additionalInfo: JSON | null;
}

export interface UniversityCreationAttributes extends Optional<UniversityAttributes, 'id'> {}

class University
  extends Model<UniversityAttributes, UniversityCreationAttributes>
  implements UniversityAttributes
{
  public id!: number;
  public name!: string;
  public countryId!: number;
  public state!: string | null;
  public slug!: string;
  public additionalInfo!: JSON | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // University.hasMany(Module)
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

  // University.hasMany(Module)
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

  // University.belongsTo(Country)
  public createCountry!: BelongsToCreateAssociationMixin<Country>;
  public getCountry!: BelongsToGetAssociationMixin<Country>;
  public setCountry!: BelongsToSetAssociationMixin<Country, number>;

  public readonly Modules?: Module[];
  public readonly Mappings?: Mapping[];
  public readonly Country?: Country;

  public static associations: {
    Modules: Association<University, Module>;
    Mappings: Association<University, Mapping>;
    Country: Association<University, Country>;
  };
}

University.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    countryId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    state: {
      type: DataTypes.STRING
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    additionalInfo: {
      type: DataTypes.JSON
    }
  },
  { sequelize }
);

export default University;
