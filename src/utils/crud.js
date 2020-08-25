/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import { NotFound } from './errorClasses';

export const createOne = (Model) => async (req, res, next) => {
  let doc;
  const input = req.body;
  try {
    doc = await Model.create(input);
  } catch (err) {
    return next(err);
  }
  res.status(201).json(doc);
};

export const findMany = (Model) => async (req, res, next) => {
  let docs;
  try {
    docs = await Model.find({});
  } catch (error) {
    return next(error);
  }
  res.status(200).json(docs);
};

export const findOne = (Model) => async (req, res, next) => {
  let doc;
  try {
    doc = await Model.findOne({ _id: req.params.id });
  } catch (error) {
    return next(error);
  }
  if (!doc) {
    return next(
      new NotFound('Resource not found', {
        type: 'notFound_error',
        status: 404,
        message: 'We could not find the resource you requested',
        path: `/${req.params.path}`, // eslint-disable-next-line comma-dangle
      })
    );
  }
  res.status(200).json(doc);
};
