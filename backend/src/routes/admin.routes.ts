import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/dashboard', AdminController.getDashboard);
router.get('/candidates', AdminController.getCandidates);
router.get('/assessments', AdminController.getAssessments);
router.get('/analytics', AdminController.getAnalytics);

export default router;
