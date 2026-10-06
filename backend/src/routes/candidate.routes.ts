import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/profile', CandidateController.getProfile);
router.put('/profile', CandidateController.updateProfile);

export default router;
