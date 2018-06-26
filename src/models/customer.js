export default (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  Customer.associate = models => {
    Customer.hasMany(models.Product, {
      foreignKey: 'customerId'
    });
  };

  return Customer;
};
