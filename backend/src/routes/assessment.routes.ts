import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { assessmentLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', AssessmentController.create);
router.get('/', AssessmentController.list);
router.get('/:id', AssessmentController.getById);
router.post('/:id/responses', AssessmentController.submitResponse);
router.post('/:id/submit', assessmentLimiter, AssessmentController.submit);

export default router;
