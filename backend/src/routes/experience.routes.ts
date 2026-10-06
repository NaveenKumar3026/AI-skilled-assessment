import { Router } from 'express';
import { ExperienceController } from '../controllers/experience.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', ExperienceController.list);
router.post('/', ExperienceController.add);
router.post('/analyze', aiLimiter, ExperienceController.analyze);

export default router;
