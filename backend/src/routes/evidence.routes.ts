import { Router } from 'express';
import { EvidenceController } from '../controllers/evidence.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);
router.post('/', uploadSingle('file'), EvidenceController.upload);
router.get('/', EvidenceController.list);
router.post('/:id/analyze', EvidenceController.analyze);

export default router;
