export default (sequelize, DataTypes) => {
  const Operation = sequelize.define('Operation', {
    code: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
  });

  return Operation;
};
