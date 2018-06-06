import dotenv from 'dotenv';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  DB_CONFIG: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'lissa',
    user: 'shvembldr',
    operatorsAliases: { $and: Op.and },
    logging: false, // TODO: посмотреть что с логгингом
  },
};
