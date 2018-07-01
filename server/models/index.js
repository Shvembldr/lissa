import Sequelize from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.db);

const models = {
  Card: sequelize.import('./card'),
  User: sequelize.import('./user'),
  Operation: sequelize.import('./operation'),
  Worker: sequelize.import('./worker'),
  Group: sequelize.import('./group'),
  Product: sequelize.import('./product'),
  Customer: sequelize.import('./customer'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export { sequelize };

export default models;
