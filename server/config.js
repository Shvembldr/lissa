import dotenv from 'dotenv';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

const operatorsAliases = { $like: Op.like, $any: Op.any, $between: Op.between };

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  SECRET: process.env.SECRET,
  db: {
    url: process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
    options: {
      dialect: 'postgres',
      operatorsAliases,
      logging: false,
    },
  },
};
