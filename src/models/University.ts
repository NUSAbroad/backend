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
} from "sequelize";

import sequelize from "../database";
import Module from "./Module";

export interface UniversityAttributes {
  id: number;
  name: string;
  country: string;
  cost: string | null;
}

export interface UniversityCreationAttributes
  extends Optional<UniversityAttributes, "id"> {}

class University
  extends Model<UniversityAttributes, UniversityCreationAttributes>
  implements UniversityAttributes
{
  public id!: number;
  public name!: string;
  public country!: string;
  public cost!: string | null;

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

  public readonly Modules?: Module[];

  public static associations: {
    Modules: Association<University, Module>;
  };
}

University.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    country: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cost: { type: DataTypes.STRING },
  },
  { sequelize }
);

export default University;
