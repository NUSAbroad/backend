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

export interface LinkAttributes {
  id: number;
  name: string;
  link: string;
  universityId: number;
}

export interface LinkCreationAttributes extends Optional<LinkAttributes, 'id'> {}

class Link extends Model<LinkAttributes, LinkCreationAttributes> implements LinkAttributes {
  public id!: number;
  public name!: string;
  public link!: string;
  public universityId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Link.belongsTo(University)
  public createUniversity!: BelongsToCreateAssociationMixin<University>;
  public getUniversity!: BelongsToGetAssociationMixin<University>;
  public setUniversity!: BelongsToSetAssociationMixin<University, number>;

  public readonly University?: University;

  public static associations: {
    University: Association<Link, University>;
  };
}

Link.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Universities',
        key: 'id'
      },
      onDelete: 'cascade'
    }
  },
  { sequelize }
);

export default Link;
