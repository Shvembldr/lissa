export default (sequelize, DataTypes) => {
  const Operation = sequelize.define('Operation', {
    code: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
  });

  Operation.associate = (models) => {
    Operation.belongsTo(models.Card, {
      foreignKey: 'cardId',
    });
    Operation.belongsTo(models.Worker, {
      foreignKey: 'workerId',
    });
  };
  return Operation;
};
