/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

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

export const productionErrors = (error, req, res) => {
  res.status(error.status || 500);
  // eslint-disable-next-line no-console
  console.log(error);
};
