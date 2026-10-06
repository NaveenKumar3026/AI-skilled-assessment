import { Router } from 'express';
import { PracticalController } from '../controllers/practical.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);
router.post('/', PracticalController.create);
router.get('/:id', PracticalController.getById);
router.post('/:id/analyze', uploadSingle('video'), PracticalController.analyze);

export default router;
