import { Router } from 'express';
import { AssessorController } from '../controllers/assessor.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('ASSESSOR', 'ADMIN'));

router.get('/candidates', AssessorController.getCandidates);
router.get('/assessments/:id', AssessorController.getAssessment);
router.post('/reviews', AssessorController.createReview);
router.put('/reviews/:id', AssessorController.updateReview);

export default router;
