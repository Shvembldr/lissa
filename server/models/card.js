export default (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    vendorCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    size: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    date: DataTypes.DATE,
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
