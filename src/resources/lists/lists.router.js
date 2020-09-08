import { Router } from 'express';
import listController from './list.controller';

const router = Router();

router.route('/').get(listController.findMany).post(listController.createOne);
// eslint-disable-next-line prettier/prettier
router
  .route('/:id')
  .get(listController.findOne)
  .put(listController.updateOne)
  .delete(listController.deleteOne);

export default router;
