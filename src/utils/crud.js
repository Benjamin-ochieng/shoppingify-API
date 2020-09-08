/* eslint-disable consistent-return */
import { InvalidRequest } from './errorClasses';

export const createOne = (Model) => async (req, res, next) => {
  let doc;
  const input = req.body;
  const createdBy = req.user._id;
  try {
    doc = await Model.create({ ...input, createdBy });
  } catch (err) {
    return next(err);
  }
  if (!doc) {
    return next(
      new InvalidRequest('Cannot post', {
        type: 'post_error',
        status: 404,
        message: 'Cannot post',
        path: `${req.originalUrl}`,
      }),
    );
  }
  res.status(201).json(doc);
};

export const findMany = (Model) => async (req, res, next) => {
  let docs;
  try {
    docs = await Model.find({ createdBy: req.user._id }).lean().exec();
  } catch (error) {
    return next(error);
  }
  res.status(200).json(docs);
};

export const findOne = (Model) => async (req, res, next) => {
  let doc;
  try {
    doc = await Model.findOne({ _id: req.params.id, createdBy: req.user._id })
      .lean()
      .exec();
  } catch (error) {
    return next(error);
  }
  if (!doc) {
    return next(
      new InvalidRequest('Resource not found', {
        type: 'not_found_error',
        status: 404,
        message: 'We could not find the resource you requested',
        path: `${req.originalUrl}`, // eslint-disable-next-line comma-dangle
      }),
    );
  }
  res.status(200).json(doc);
};

export const updateOne = (Model) => async (req, res, next) => {
  let updatedDoc;
  try {
    updatedDoc = await Model.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true },
    )
      .lean()
      .exec();
  } catch (error) {
    return next(error);
  }
  if (!updatedDoc) {
    return next(
      new InvalidRequest('Cannot complete update request', {
        type: 'invalid_update_request_error',
        status: 400,
        message: 'We could not update the resource',
        path: `${req.originalUrl}`,
      }),
    );
  }
  res.status(200).json(updatedDoc);
};

export const deleteOne = (Model) => async (req, res, next) => {
  let doc;
  try {
    doc = await Model.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
  } catch (error) {
    return next(error);
  }
  if (!doc) {
    return next(
      new InvalidRequest('Cannot complete update request', {
        type: 'invalid_update_request_error',
        status: 400,
        message: 'We could not delete the resource',
        path: `${req.originalUrl}`,
      }),
    );
  }
  res.status(204).end();
};

export const crudControllers = (Model) => ({
  createOne: createOne(Model),
  findMany: findMany(Model),
  findOne: findOne(Model),
  updateOne: updateOne(Model),
  deleteOne: deleteOne(Model),
});
