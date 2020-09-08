/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';
import { InvalidRequest } from './errorClasses';

export const invalidRequest = (error, req, res, next) => {
  if (error instanceof InvalidRequest === false) {
    return next(error);
  }
  // eslint-disable-next-line object-curly-newline
  const { type, status, message, path } = error;
  // eslint-disable-next-line object-curly-newline
  res.status(status).json({ type, status, message, path });
};

const errorToJson = (error) => {
  const { errors } = error;
  const fields = Object.keys(errors);
  return fields.map((field) => {
    const { properties } = errors[field];
    const { message, path, value } = properties;
    return { path, value, message };
  });
};

export const validationErrors = (error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError === false) {
    return next(error);
  }
  const type = 'validation_error';
  const title = "Your request parameters didn't validate";
  const err = errorToJson(error);
  res.status(400).json({ type, title, errors: err });
};

// eslint-disable-next-line no-unused-vars
export const productionErrors = (error, req, res, next) => {
  console.log(error);
  // res.status(500).json({ status: 500, message: 'something went wrong' });
};
