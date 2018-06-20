import dotenv from 'dotenv';

dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV,
  db: process.env.DATABASE_URL,
};
