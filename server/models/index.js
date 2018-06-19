import Sequelize from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.db.url);

const models = {
  Card: sequelize.import('./card'),
  User: sequelize.import('./user'),
  Operation: sequelize.import('./operation'),
  Worker: sequelize.import('./worker'),
  Group: sequelize.import('./group'),
  Product: sequelize.import('./product'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
