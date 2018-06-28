export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    vendorCode: DataTypes.STRING,
    size: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    date: DataTypes.DATE,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Operation, {
      foreignKey: 'productId',
    });

    Product.belongsTo(models.Group, {
      foreignKey: 'groupId',
    });

    Product.belongsTo(models.Customer, {
      foreignKey: 'customerId',
    });
  };

  return Product;
};
