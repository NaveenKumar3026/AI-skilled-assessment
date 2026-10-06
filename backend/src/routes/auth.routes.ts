import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public auth endpoints protected by dedicated rate limiters
router.post('/register', registerLimiter, AuthController.register);
router.post('/login', loginLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);

// Authenticated session management endpoints
router.post('/logout', requireAuth, AuthController.logout);
router.post('/logout-all', requireAuth, AuthController.logoutAll);
router.get('/me', requireAuth, AuthController.getMe);

export default router;
