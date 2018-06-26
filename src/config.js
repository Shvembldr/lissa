import dotenv from 'dotenv';

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  db: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    operatorsAliases: false,
  },
};
