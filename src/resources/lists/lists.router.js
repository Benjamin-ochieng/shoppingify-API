import { Router } from 'express';

const router = Router();
const getter = (req, res) => res.send('got something');
const poster = (req, res) => res.send('posted something');
const editer = (req, res) => res.send('edited something');
const remover = (req, res) => res.send('posted something');

router.route('/').get(getter).post(poster);
// eslint-disable-next-line prettier/prettier
router.route('/:id')
  .get(getter)
  .post(poster)
  .put(editer)
  .delete(remover);

export default router;
