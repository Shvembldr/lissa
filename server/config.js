import dotenv from 'dotenv';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

const operatorsAliases = { $like: Op.like, $any: Op.any, $between: Op.between };

dotenv.config();

const dbConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return {
        url: process.env.TEST_DATABASE_URL,
        options: {
          dialect: 'postgres',
          database: 'database_test',
          operatorsAliases,
          logging: false,
        },
      };
    case 'production':
      return {
        url: process.env.DATABASE_URL,
        options: {
          dialect: 'postgres',
          operatorsAliases,
          logging: false,
        },
      };
    default:
      return {
        url: process.env.DATABASE_URL,
        options: {
          dialect: 'postgres',
          database: 'lissa',
          operatorsAliases,
          logging: false,
        },
      };
  }
};

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  SECRET: process.env.SECRET,
  db: dbConfig(),
};
