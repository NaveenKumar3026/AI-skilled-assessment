import { Router } from 'express';
import { PracticalController } from '../controllers/practical.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', PracticalController.create);
router.get('/:id', PracticalController.getById);
router.post('/:id/analyze', aiLimiter, uploadSingle('video'), PracticalController.analyze);

export default router;
