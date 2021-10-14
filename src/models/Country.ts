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
  HasManySetAssociationsMixin
} from 'sequelize';

import sequelize from '../database';
import University from './University';

export interface CountryAttributes {
  id: number;
  name: string;
}

export interface CountryCreationAttributes extends Optional<CountryAttributes, 'id'> {}

class Country
  extends Model<CountryAttributes, CountryCreationAttributes>
  implements CountryAttributes
{
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Country.hasMany(University)
  public addUniversity!: HasManyAddAssociationMixin<University, number>;
  public addUnivresitys!: HasManyAddAssociationsMixin<University, number>;
  public countUniversitys!: HasManyCountAssociationsMixin;
  public createUniversitys!: HasManyCreateAssociationMixin<University>;
  public getUniversitys!: HasManyGetAssociationsMixin<University>;
  public hasUniversity!: HasManyHasAssociationMixin<University, number>;
  public hasUniversitys!: HasManyHasAssociationsMixin<University, number>;
  public removeUniversity!: HasManyRemoveAssociationMixin<University, number>;
  public removeUniversitys!: HasManyRemoveAssociationsMixin<University, number>;
  public setUniversitys!: HasManySetAssociationsMixin<University, number>;

  public readonly Universities?: University[];

  public static associations: {
    Universities: Association<Country, University>;
  };
}

Country.init(
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
    }
  },
  { sequelize }
);

export default Country;
