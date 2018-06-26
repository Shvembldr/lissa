export default (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    vendorCode: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Card.associate = (models) => {
    Card.hasMany(models.Operation, {
      foreignKey: 'cardId',
    });

    Card.belongsTo(models.Group, {
      foreignKey: 'groupId',
    });
  };

  return Card;
};
