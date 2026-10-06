import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator';
import { successResponse, errorResponse } from '../utils/response';
import { securityConfig } from '../config/security.config';

function setAuthCookies(res: Response, accessToken: string, refreshToken?: string): void {
  // Set access token cookie
  res.cookie(securityConfig.tokens.cookieAccessName, accessToken, {
    httpOnly: securityConfig.cookies.httpOnly,
    sameSite: securityConfig.cookies.sameSite,
    secure: securityConfig.cookies.secure,
    path: securityConfig.cookies.path,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set refresh token cookie if provided
  if (refreshToken) {
    res.cookie(securityConfig.tokens.cookieRefreshName, refreshToken, {
      httpOnly: securityConfig.cookies.httpOnly,
      sameSite: securityConfig.cookies.sameSite,
      secure: securityConfig.cookies.secure,
      path: securityConfig.cookies.path,
      maxAge: securityConfig.tokens.refreshLifetimeMs,
    });
  }
}

function clearAuthCookies(res: Response): void {
  res.clearCookie(securityConfig.tokens.cookieAccessName, { path: '/' });
  res.clearCookie(securityConfig.tokens.cookieRefreshName, { path: '/' });
}

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = registerSchema.parse({
        ...req.body,
        yearsOfExperience: Number(req.body.yearsOfExperience),
      });

      const result = await AuthService.register(data, req);
      setAuthCookies(res, result.token, result.refreshToken);

      res.status(201).json(successResponse(result, 'Registration successful. Welcome to SkillSet AI!'));
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data, req);
      setAuthCookies(res, result.token, result.refreshToken);

      res.status(200).json(successResponse(result, 'Login successful.'));
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = refreshSchema.safeParse(req.body);
      const tokenFromBody = parsed.success ? parsed.data.refreshToken : undefined;
      const tokenFromCookie = req.cookies?.[securityConfig.tokens.cookieRefreshName];
      const refreshToken = tokenFromBody || tokenFromCookie;

      if (!refreshToken) {
        res.status(401).json(errorResponse('Refresh token required.', 'UNAUTHORIZED'));
        return;
      }

      const result = await AuthService.refresh(refreshToken, req);
      setAuthCookies(res, result.accessToken, result.refreshToken);

      res.status(200).json(
        successResponse(
          {
            token: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user,
          },
          'Token refreshed successfully.'
        )
      );
    } catch (err) {
      clearAuthCookies(res);
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.logout(req.sessionId, req.user?.id, req);
      clearAuthCookies(res);
      res.status(200).json(successResponse({ loggedOut: true }, 'Logged out successfully.'));
    } catch (err) {
      clearAuthCookies(res);
      next(err);
    }
  }

  static async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.logoutAll(req.user!.id, req);
      clearAuthCookies(res);
      res.status(200).json(
        successResponse(result, 'All active sessions have been revoked.')
      );
    } catch (err) {
      clearAuthCookies(res);
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await AuthService.getMe(userId);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }
}
