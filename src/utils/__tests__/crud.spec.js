import { merge } from 'lodash';
import List from '../../resources/lists/lists.model';
import { createOne } from '../crud';
import setupReqRes from '../../../test-reqRes-setup';

describe('crud methods', () => {
  describe('createOne', () => {
    it('calls next errors', async () => {
      const { req, res, next } = setupReqRes();
      const createList = createOne(List);
      await createList(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('creates a documents', async () => {
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
});
