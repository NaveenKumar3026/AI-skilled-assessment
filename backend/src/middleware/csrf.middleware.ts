import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { securityConfig } from '../config/security.config';
import { errorResponse } from '../utils/response';

/**
 * Double Submit Cookie CSRF Protection
 * For state-changing requests authenticated via HttpOnly cookies, verifies
 * that the X-CSRF-Token or X-XSRF-Token header matches the XSRF-TOKEN cookie.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Safe idempotent HTTP methods do not require CSRF validation
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    // If client does not have a CSRF cookie yet, provide one
    if (!req.cookies?.[securityConfig.tokens.cookieCsrfName]) {
      const csrfToken = crypto.randomBytes(24).toString('hex');
      res.cookie(securityConfig.tokens.cookieCsrfName, csrfToken, {
        httpOnly: false, // Must be readable by client JavaScript to mirror into header
        sameSite: securityConfig.cookies.sameSite,
        secure: securityConfig.cookies.secure,
        path: '/',
      });
    }
    return next();
  }

  // If request utilizes Bearer token in Authorization header,
  // browsers NEVER attach this header cross-origin automatically, making it CSRF-immune.
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // If request relies on cookie authentication, verify CSRF token
  const hasAuthCookie = !!req.cookies?.[securityConfig.tokens.cookieAccessName];
  if (hasAuthCookie) {
    const cookieToken = req.cookies?.[securityConfig.tokens.cookieCsrfName];
    const headerToken =
      (req.headers['x-csrf-token'] as string) ||
      (req.headers['x-xsrf-token'] as string);

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      res.status(403).json(
        errorResponse('CSRF token validation failed.', 'CSRF_INVALID')
      );
      return;
    }
  }

  next();
}
