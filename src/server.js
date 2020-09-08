import express from 'express';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import { connectDb } from './utils/db';
import {
  validationErrors,
  productionErrors,
  invalidRequest,
} from './utils/errorHandler';
import * as auth from './utils/auth';
import userRouter from './resources/users/user.router';
import listRouter from './resources/lists/lists.router';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));

app.use('/signup', auth.signUp);
app.use('/signin', auth.signIn);
app.use(auth.authorize);
app.use('/accounts', userRouter);
app.use('/lists', listRouter);

app.use(invalidRequest);
app.use(validationErrors);
app.use(productionErrors);

const main = async () => {
  const port = Number(config.PORT);
  await connectDb();
  app.listen(3020, () => {
    // eslint-disable-next-line no-console
    console.log(`Server connected on ${port}`);
  });
};

export default main;
