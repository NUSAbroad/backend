import {
  Model,
  DataTypes,
  Optional,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';

import sequelize from '../database';

import University from './University';

export interface MappingAttributes {
  id: number;
  nusModuleFaculty: string;
  nusModuleCode: string;
  nusModuleName: string;
  nusModuleCredits: number;
  partnerModuleCode: string;
  partnerModuleName: string;
  partnerModuleCredits: number;
  partnerUniversityId: number;
}

export interface MappingCreationAttributes extends Optional<MappingAttributes, 'id'> {}

class Mapping
  extends Model<MappingAttributes, MappingCreationAttributes>
  implements MappingAttributes
{
  public id!: number;
  public nusModuleFaculty!: string;
  public nusModuleCode!: string;
  public nusModuleName!: string;
  public nusModuleCredits!: number;
  public partnerModuleCode!: string;
  public partnerModuleName!: string;
  public partnerModuleCredits!: number;
  public partnerUniversityId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Mapping.belongsTo(University)
  public createUniversity!: BelongsToCreateAssociationMixin<University>;
  public getUniversity!: BelongsToGetAssociationMixin<University>;
  public setUniversity!: BelongsToSetAssociationMixin<University, number>;
}

Mapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nusModuleFaculty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nusModuleCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nusModuleName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nusModuleCredits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    partnerModuleCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    partnerModuleName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    partnerModuleCredits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    partnerUniversityId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Universities',
        key: 'id'
      }
    }
  },
  { sequelize }
);

export default Mapping;
