import {
  Model,
  DataTypes,
  Optional,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from "sequelize";

import sequelize from "../database";

import University from "./University";

export interface ModuleAttributes {
  id: number;
  name: string;
  code: string;
  faculty: string | null;
  credits: number;
  universityId: number;
}

export interface ModuleCreationAttributes
  extends Optional<ModuleAttributes, "id"> {}

class Module
  extends Model<ModuleAttributes, ModuleCreationAttributes>
  implements ModuleAttributes
{
  public id!: number;
  public name!: string;
  public faculty!: string | null;
  public code!: string;
  public credits!: number;
  public universityId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Module.belongsTo(University)
  public createUniversity!: BelongsToCreateAssociationMixin<University>;
  public getUniversity!: BelongsToGetAssociationMixin<University>;
  public setUniversity!: BelongsToSetAssociationMixin<University, number>;
}

Module.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    faculty: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Universities",
        key: "id",
      },
    },
  },
  { sequelize }
);

export default Module;
