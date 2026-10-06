import { Router } from 'express';
import { ExperienceController } from '../controllers/experience.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', ExperienceController.list);
router.post('/', ExperienceController.add);
router.post('/analyze', ExperienceController.analyze);

export default router;
