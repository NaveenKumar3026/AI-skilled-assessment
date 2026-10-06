import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';
import { securityConfig } from '../config/security.config';

/**
 * Authentication Middleware
 * Supports both standard Authorization: Bearer <token> headers and
 * secure HttpOnly cookies (skillset_access_token).
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Check Bearer Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback to HttpOnly cookie
  if (!token && req.cookies) {
    token = req.cookies[securityConfig.tokens.cookieAccessName];
  }

  if (!token) {
    res.status(401).json(errorResponse('Authentication required. Please login.', 'UNAUTHORIZED'));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
    req.sessionId = payload.sessionId;
    next();
  } catch (err) {
    res.status(401).json(
      errorResponse('Invalid or expired authentication token. Please refresh or login again.', 'INVALID_TOKEN')
    );
  }
}

// Backward-compatible alias for existing routes
export const authenticate = requireAuth;
