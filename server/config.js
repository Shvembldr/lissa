import dotenv from 'dotenv';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  db: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'lissa',
    user: 'shvembldr',
    operatorsAliases: { $like: Op.like },
    logging: false,
  },
};
