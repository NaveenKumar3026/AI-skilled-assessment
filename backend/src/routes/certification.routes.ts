import { Router } from 'express';
import { CertificationController } from '../controllers/certification.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public verification endpoint
router.get('/verify/:verificationId', CertificationController.verify);

// Authenticated certification management endpoints
router.use(requireAuth);
router.post('/recommend', aiLimiter, CertificationController.recommend);
router.get('/:candidateId', CertificationController.getCertifications);

export default router;
