import dotenv from 'dotenv';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

const operatorsAliases = { $like: Op.like, $any: Op.any, $between: Op.between };

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  SECRET: process.env.SECRET,
  db:
    process.env.NODE_ENV === 'test'
      ? {
        dialect: 'sqlite',
        storage: 'db.test',
        database: 'database_test',
        operatorsAliases,
        logging: false,
      }
      : {
        dialect: 'postgres',
        url: process.env.DATABASE_URL,
        database: 'lissa',
        operatorsAliases,
        logging: false,
      },
};
