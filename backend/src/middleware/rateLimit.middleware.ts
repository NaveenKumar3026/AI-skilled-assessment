import rateLimit from 'express-rate-limit';
import { securityConfig } from '../config/security.config';
import { errorResponse } from '../utils/response';

const createLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (req: any) => string;
}) =>
  rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator:
      options.keyGenerator ||
      ((req) => {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        return typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : String(clientIp);
      }),
    handler: (_req, res) => {
      res.status(429).json(errorResponse(options.message, 'RATE_LIMIT_EXCEEDED'));
    },
  });

export const generalLimiter = createLimiter({
  windowMs: securityConfig.rateLimits.general.windowMs,
  max: securityConfig.rateLimits.general.max,
  message: securityConfig.rateLimits.general.message,
  keyGenerator: (req) => {
    const userId = req.user?.id;
    if (userId) return `user_${userId}`;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    return `ip_${typeof ip === 'string' ? ip.split(',')[0].trim() : ip}`;
  },
});

export const loginLimiter = createLimiter({
  windowMs: securityConfig.rateLimits.login.windowMs,
  max: securityConfig.rateLimits.login.max,
  message: securityConfig.rateLimits.login.message,
  keyGenerator: (req) => {
    const email = req.body?.email ? String(req.body.email).toLowerCase().trim() : 'anonymous';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const cleanIp = typeof ip === 'string' ? ip.split(',')[0].trim() : ip;
    return `login_${cleanIp}_${email}`;
  },
});

export const registerLimiter = createLimiter({
  windowMs: securityConfig.rateLimits.register.windowMs,
  max: securityConfig.rateLimits.register.max,
  message: securityConfig.rateLimits.register.message,
});

export const aiLimiter = createLimiter({
  windowMs: securityConfig.rateLimits.aiAnalysis.windowMs,
  max: securityConfig.rateLimits.aiAnalysis.max,
  message: securityConfig.rateLimits.aiAnalysis.message,
  keyGenerator: (req) => {
    return req.user?.id ? `ai_user_${req.user.id}` : `ai_ip_${req.socket.remoteAddress}`;
  },
});

export const assessmentLimiter = createLimiter({
  windowMs: securityConfig.rateLimits.assessmentSubmit.windowMs,
  max: securityConfig.rateLimits.assessmentSubmit.max,
  message: securityConfig.rateLimits.assessmentSubmit.message,
  keyGenerator: (req) => {
    return req.user?.id ? `assess_user_${req.user.id}` : `assess_ip_${req.socket.remoteAddress}`;
  },
});

export const uploadLimiter = createLimiter({
  windowMs: securityConfig.rateLimits.fileUpload.windowMs,
  max: securityConfig.rateLimits.fileUpload.max,
  message: securityConfig.rateLimits.fileUpload.message,
  keyGenerator: (req) => {
    return req.user?.id ? `upload_user_${req.user.id}` : `upload_ip_${req.socket.remoteAddress}`;
  },
});
