import List from '../../resources/lists/lists.model';
import { createOne } from '../crud';
import setupReqRes from '../../../test-reqRes-setup';

describe('crud methods', () => {
  describe('createOne', () => {
    it('Creates an empty list', async () => {
      // eslint-disable-next-line no-unused-vars
      const { req, res } = setupReqRes();
      const createList = createOne(List);
      await createList(req, res);
      const [newDoc] = res.json.mock.calls[0];
      console.log(newDoc);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newDoc);
    });
  });
});
