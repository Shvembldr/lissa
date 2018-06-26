import { USER_ROLE } from '../constants';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    role: {
      type: DataTypes.ENUM(USER_ROLE.USER, USER_ROLE.ADMIN)
    },
    password: DataTypes.STRING
  });

  return User;
};
