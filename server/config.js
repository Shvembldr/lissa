import dotenv from 'dotenv';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  db:
    process.env.NODE_ENV === 'production'
      ? {
        dialect: 'postgres',
        url: process.env.DATABASE_URL,
        operatorsAliases: { $like: Op.like, $any: Op.any, $between: Op.between },
        logging: false,
        database: 'lissa',
      }
      : {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'lissa',
        user: 'shvembldr',
        operatorsAliases: { $like: Op.like, $any: Op.any, $between: Op.between },
        logging: false,
      },
};
