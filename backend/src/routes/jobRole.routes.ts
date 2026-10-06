import { Router } from 'express';
import { JobRoleController } from '../controllers/jobRole.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', JobRoleController.list);
router.get('/:id', JobRoleController.getById);

export default router;
