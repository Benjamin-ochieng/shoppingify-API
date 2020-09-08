import mongoose from 'mongoose';
import { validationErrors, invalidRequest } from '../errorHandler';
import setupReqRes from '../../../test-reqRes-setup';
import { InvalidRequest } from '../errorClasses';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
});
const Model = mongoose.model('Test', schema);
const doc = new Model({});

describe('validationErrors', () => {
  it('calls next if error is not a mongdb ValidatonError', () => {
    const { req, res, next } = setupReqRes();
    const err = () => {
      throw new Error();
    };
    validationErrors(() => err(), req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 400 with JSON representation of ValidatonError', () => {
    const { req, res, next } = setupReqRes();
    const err = doc.validateSync();
    validationErrors(err, req, res, next);
    const [data] = res.json.mock.calls[0];
    expect(res.json).toHaveBeenCalledWith(data);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('InvalidRequest', () => {
  it('calls next if error is not an InvalidRequest error', () => {
    const { req, res, next } = setupReqRes();
    const err = () => {
      throw new Error();
    };
    invalidRequest(() => err(), req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 404 with JSON representation of NotFound', () => {
    const { req, res, next } = setupReqRes();
    try {
      throw new InvalidRequest('Resource not found', {
        type: 'notFound_error',
        status: 404,
        message: 'We could not find the resource you requested',
        path: '/12345', // eslint-disable-next-line comma-dangle
      });
    } catch (error) {
      invalidRequest(error, req, res, next);
    }
    const [data] = res.json.mock.calls[0];
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});
