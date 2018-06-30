import dotenv from 'dotenv';

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  db:
    process.env.NODE_ENV === 'test'
      ? {
        dialect: 'sqlite',
        storage: 'db.test',
      }
      : {
        dialect: 'postgres',
        url: process.env.DATABASE_URL,
        operatorsAliases: false,
      },
};
