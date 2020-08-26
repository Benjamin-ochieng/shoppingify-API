/* eslint-disable no-underscore-dangle */
import { merge } from 'lodash';
import mongoose from 'mongoose';
import List from '../../resources/lists/lists.model';
// eslint-disable-next-line object-curly-newline
import { createOne, findMany, findOne, updateOne, deleteOne } from '../crud';
import setupReqRes from '../../../test-reqRes-setup';

describe('crud methods', () => {
  describe('createOne', () => {
    it('throws error for bad request', async () => {
      const { req, res, next } = setupReqRes();
      const createList = createOne(List);
      await createList(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('creates a document', async () => {
      const { req, res, next } = setupReqRes();
      const body = { req: { body: { name: "Chela's birthday" } } };
      merge({ req, res, next }, body);
      const createList = createOne(List);
      await createList(req, res, next);
      const [doc] = res.json.mock.calls[0];
      expect(res.json).toHaveBeenCalledWith(doc);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('findMany', () => {
    it('returns an array of documents', async () => {
      const { req, res, next } = setupReqRes();
      const lists = [
        { name: "Chela's birthday" },
        { name: "Benja's birthday" },
      ];
      // eslint-disable-next-line no-restricted-syntax
      for (const list of lists) {
        const newList = new List(list);
        // eslint-disable-next-line no-await-in-loop
        await newList.save();
      }
      const getLists = findMany(List);
      await getLists(req, res, next);
      const [docs] = res.json.mock.calls[0];
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(docs);
    });
  });

  describe('findOne', () => {
    it('Throws error if document is not found', async () => {
      const { req, res, next } = setupReqRes();
      const params = {
        req: { params: { id: mongoose.Types.ObjectId() } },
      };
      merge({ req, res, next }, params);
      const getList = findOne(List);
      await getList(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('Returns specific document', async () => {
      const { req, res, next } = setupReqRes();
      const testList = await List.create({ name: "Chela's birthday" });
      const params = {
        req: { params: { id: testList._id } },
      };
      merge({ req, res, next }, params);
      await findOne(List)(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      const [doc] = res.json.mock.calls[0];
      expect(res.json).toHaveBeenCalledWith(doc);
    });
  });

  describe('updateOne', () => {
    it('Throws error for incorrect document id', async () => {
      const { req, res, next } = setupReqRes();
      const params = {
        req: { params: { id: mongoose.Types.ObjectId() } },
      };
      merge({ req, res, next }, params);
      await updateOne(List)(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('Updates specific document', async () => {
      const testList = await List.create({ name: 'House decor' });
      const { req, res, next } = setupReqRes();
      const params = {
        req: { params: { id: testList._id } },
      };
      const body = {
        req: { body: { name: 'Home decor' } },
      };
      merge({ req, res, next }, params, body);
      await updateOne(List)(req, res, next);
      const [updatedList] = res.json.mock.calls[0];
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(updatedList);
    });
  });

  describe('deleteOne', () => {
    it('Throws error for incorrect document id', async () => {
      const { req, res, next } = setupReqRes();
      const params = {
        req: { params: { id: mongoose.Types.ObjectId() } },
      };
      merge({ req, res, next }, params);
      await deleteOne(List)(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('deletes a specific document', async () => {
      const testList = await List.create({ name: 'House decor' });
      const { req, res, next } = setupReqRes();
      const params = {
        req: { params: { id: testList._id } },
      };
      merge({ req, res, next }, params);
      await deleteOne(List)(req, res, next);
      expect(res.status).toBeCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
    });
  });
});
