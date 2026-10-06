import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Redact sensitive fields from objects before logging
 */
export function sanitizeLogData(data: any): any {
  if (!data) return data;
  if (typeof data !== 'object') return data;

  const sensitiveKeys = [
    'password',
    'passwordhash',
    'token',
    'tokenhash',
    'refreshtoken',
    'authorization',
    'cookie',
    'secret',
    'extracteddata',
  ];

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizeLogData(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

/**
 * Request ID & Structured Logging Middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // 1. Generate or extract standard X-Request-ID
  const incomingId = req.headers['x-request-id'];
  const requestId =
    typeof incomingId === 'string' && incomingId.length <= 64
      ? incomingId
      : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    // Structured JSON log output
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      path: req.baseUrl + req.path,
      statusCode: res.statusCode,
      durationMs,
      clientIp: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : clientIp,
      userAgent: req.headers['user-agent'] ? req.headers['user-agent'].substring(0, 100) : 'unknown',
      userId: req.user?.id || 'anonymous',
      role: req.user?.role || 'none',
    };

    if (res.statusCode >= 400) {
      console.warn(`[WARN] ${JSON.stringify(logEntry)}`);
    } else {
      console.log(`[INFO] ${JSON.stringify(logEntry)}`);
    }
  });

  next();
}
