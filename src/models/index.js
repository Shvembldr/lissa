import Sequelize from 'sequelize';
import config from '../config';

const { Op } = Sequelize;

const sequelize = new Sequelize(config.db.url, {
  operatorsAliases: { $like: Op.like, $any: Op.any, $between: Op.between },
  logging: false
});

const models = {
  Card: sequelize.import('./card'),
  User: sequelize.import('./user'),
  Operation: sequelize.import('./operation'),
  Worker: sequelize.import('./worker'),
  Group: sequelize.import('./group'),
  Product: sequelize.import('./product'),
  Customer: sequelize.import('./customer')
};

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
