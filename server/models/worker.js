export default (sequelize, DataTypes) => {
  const Worker = sequelize.define('Worker', {
    code: DataTypes.INTEGER,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
  });

  Worker.associate = (models) => {
    Worker.hasMany(models.Operation, {
      foreignKey: 'workerId',
    });
  };

  return Worker;
};
