import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

const main = () => {
  app.listen(3020, () => {
    console.log('Server started on 3020');
  });
};

export default main;
