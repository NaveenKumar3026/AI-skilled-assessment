import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../types';
import { errorResponse } from '../utils/response';

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse('Authentication required.'));
      return;
    }
    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json(
        errorResponse(`Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`)
      );
      return;
    }
    next();
  };
}
