import { Router } from 'express';
import { SkillsController } from '../controllers/skills.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/profile', SkillsController.getProfile);
router.get('/recommendations', SkillsController.getRecommendations);

export default router;
