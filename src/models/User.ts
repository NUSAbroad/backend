import { Model, DataTypes, Optional } from 'sequelize';
import { hashPassword } from '../utils/users';

import sequelize from '../database';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {};
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  { sequelize }
);

User.addHook('beforeCreate', async (user: User, _options) => {
  user.password = await hashPassword(user.password);
});

User.addHook('beforeUpdate', async (user: User, _options) => {
  if (user.changed('password')) {
    user.password = await hashPassword(user.password);
  }
});

export default User;
