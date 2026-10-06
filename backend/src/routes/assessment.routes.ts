import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', AssessmentController.create);
router.get('/', AssessmentController.list);
router.get('/:id', AssessmentController.getById);
router.post('/:id/responses', AssessmentController.submitResponse);
router.post('/:id/submit', AssessmentController.submit);

export default router;
