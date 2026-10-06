import { Router } from 'express';
import { ResultsController } from '../controllers/results.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/:assessmentId', ResultsController.getAssessmentResults);

export default router;
