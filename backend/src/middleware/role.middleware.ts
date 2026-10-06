import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../types';
import { errorResponse } from '../utils/response';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies that the authenticated backend user holds an authorized role.
 * Never trusts role claims supplied by frontend client payloads.
 */
export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse('Authentication required.', 'UNAUTHORIZED'));
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json(
        errorResponse(
          'Access denied: You do not have permission to access this resource.',
          'FORBIDDEN'
        )
      );
      return;
    }

    next();
  };
}

/**
 * Helper middleware shortcuts for specific roles
 */
export const requireCandidate = (): RequestHandler => requireRole('CANDIDATE');
export const requireAssessor = (): RequestHandler => requireRole('ASSESSOR', 'ADMIN');
export const requireAdmin = (): RequestHandler => requireRole('ADMIN');
