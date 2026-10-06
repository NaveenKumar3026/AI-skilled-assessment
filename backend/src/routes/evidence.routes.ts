import { Router } from 'express';
import { EvidenceController } from '../controllers/evidence.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { uploadLimiter, aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', uploadLimiter, uploadSingle('file'), EvidenceController.upload);
router.get('/', EvidenceController.list);
router.post('/:id/analyze', aiLimiter, EvidenceController.analyze);
router.get('/:id/download', EvidenceController.download);

export default router;
