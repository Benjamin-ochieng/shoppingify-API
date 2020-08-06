import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import { connectDb } from './utils/db';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

const main = async () => {
  await connectDb();
  app.listen(3020, () => {
    console.log(`Server connected on ${config.port}`);
  });
};

export default main;
