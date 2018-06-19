import dotenv from 'dotenv';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  db: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    operatorsAliases: { $like: Op.like, $any: Op.any, $between: Op.between },
    logging: false,
    database: 'lissa',
  },
};
