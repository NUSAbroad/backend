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

// Currently we will only be storing NUS modules in this schema
// However, I'm keeping universityId in the event we store information
// about PU modules, in the future.
// universityId with null values will be NUS modules

export interface SemesterAttributes {
  id: number;
  description: string;
  universityId: number;
}

export interface SemesterCreationAttributes extends Optional<SemesterAttributes, 'id'> {}

class Semester
  extends Model<SemesterAttributes, SemesterCreationAttributes>
  implements SemesterAttributes
{
  public id!: number;
  public description!: string;
  public universityId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Semester.belongsTo(University)
  public createUniversity!: BelongsToCreateAssociationMixin<University>;
  public getUniversity!: BelongsToGetAssociationMixin<University>;
  public setUniversity!: BelongsToSetAssociationMixin<University, number>;

  public readonly University?: University;

  public static associations: {
    University: Association<Semester, University>;
  };
}

Semester.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    description: {
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

export default Semester;
