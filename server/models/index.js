import Sequelize from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.DB_CONFIG);

const models = {
  User: sequelize.import('./user'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
