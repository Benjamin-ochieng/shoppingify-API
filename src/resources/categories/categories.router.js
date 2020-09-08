import { Router } from 'express';
import categoriesController from './categories.controller';

const router = Router();

router
  .route('/')
  .get(categoriesController.findMany)
  .post(categoriesController.createOne);

router
  .route('/:id')
  .get(categoriesController.findOne)
  .put(categoriesController.updateOne)
  .delete(categoriesController.deleteOne);

export default router;
