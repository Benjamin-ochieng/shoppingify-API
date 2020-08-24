import mongoose from 'mongoose';
import { validationErrors } from '../errorHandler';
import setupReqRes from '../../../test-reqRes-setup';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
});
const Model = mongoose.model('Test', schema);
const doc = new Model({});

describe('validationErrors', () => {
  it('calls next if error is not a mongdb validatonError', () => {
    const { req, res, next } = setupReqRes();
    const err = () => {
      throw new Error();
    };
    validationErrors(() => err(), req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 400 with consumable JSON error representation', () => {
    const { req, res, next } = setupReqRes();
    const err = doc.validateSync();
    validationErrors(err, req, res, next);
    const [data] = res.json.mock.calls[0];
    expect(res.json).toHaveBeenCalledWith(data);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
