/* eslint-disable no-console */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable indent */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cuid from 'cuid';
import { map } from 'lodash';
import List from './src/resources/lists/lists.model';

const db = { List };

dotenv.config();

const remove = (collection) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve, reject) => {
    collection.deleteOne((err) => {
      if (err) return reject(err);
      resolve();
    });
  });

const clearDb = async () => {
  await Promise.all(map(mongoose.connection.collections, remove));
};

const connectDb = async (url, id, options) => {
  try {
    await mongoose.connect(`${url}${id}`, options);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

beforeEach(async (done) => {
  const url = process.env.DBURL_TEST;
  const id = cuid();
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDb(url, id, options);
      await clearDb();
      // await seedDb();
      await Promise.all(Object.keys(db).map((name) => db[name].init()));
    } else {
      await clearDb();
    }
  } catch (error) {
    console.log(error);
  }
  done();
});

afterEach(async (done) => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  return done();
});

afterAll(async (done) => done());
