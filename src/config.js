import dotenv from 'dotenv';

dotenv.config();

const config = {
  DBURL_DEV: process.env.DBURL_DEV,
  PORT: process.env.PORT,
};

export default config;
