import { Router } from 'express';
import { CertificationController } from '../controllers/certification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/recommend', CertificationController.recommend);
router.get('/:candidateId', CertificationController.getCertifications);

export default router;
