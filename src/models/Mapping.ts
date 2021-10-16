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

export interface MappingAttributes {
  id: number;
  nusFacultyId: number;
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
  public nusFacultyId!: number;
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

  // Mapping.belongsTo(Faculty)
  public createFaculty!: BelongsToCreateAssociationMixin<Faculty>;
  public getFaculty!: BelongsToGetAssociationMixin<Faculty>;
  public setFaculty!: BelongsToSetAssociationMixin<Faculty, number>;

  public readonly University?: University;
  public readonly Faculty?: Faculty;

  public static associations: {
    University: Association<Mapping, University>;
    Faculty: Association<Mapping, Faculty>;
  };
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
    },
    nusFacultyId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Faculties',
        key: 'id'
      }
    }
  },
  { sequelize }
);

export default Mapping;
