import { Router } from 'express';
import { findAccount } from './user.controller';

const router = Router();

router.route('/me').get(findAccount);

export default router;
