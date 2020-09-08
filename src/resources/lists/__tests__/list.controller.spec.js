import { isFunction } from 'lodash';
import listController from '../list.controller';

describe('listController', () => {
  it('has all the crud methods', () => {
    const crudMethods = [
      'createOne',
      'findMany',
      'findOne',
      'updateOne',
      'updateOne',
      'deleteOne',
    ];
    crudMethods.forEach((method) => {
      expect(isFunction(listController[method])).toBe(true);
    });
  });
});
