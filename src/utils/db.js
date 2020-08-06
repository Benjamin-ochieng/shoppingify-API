import mongoose from 'mongoose';
import config from '../config';

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
// eslint-disable-next-line import/prefer-default-export
export const connectDb = async () => {
  try {
    await mongoose.connect(config.DBURL_DEV, options);
    console.log('connected to the database');
  } catch (error) {
    console.log(error);
  }
};
