import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import { connectDb } from './utils/db';
import listRouter from './resources/lists/lists.router';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/lists', listRouter);

const main = async () => {
  const port = Number(config.PORT);
  await connectDb();
  app.listen(3020, () => {
    console.log(`Server connected on ${port}`);
  });
};

export default main;
