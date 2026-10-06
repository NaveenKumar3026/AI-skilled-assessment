import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { config } from '../config/env';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
    });
    return;
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'A record with this value already exists.',
        error: `Unique constraint violation on: ${(err.meta?.target as string[])?.join(', ')}`,
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Record not found.', error: err.message });
      return;
    }
  }

  // JWT errors
  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token.', error: err.message });
    return;
  }
  if (err instanceof Error && err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired. Please login again.', error: err.message });
    return;
  }

  // Multer errors
  if (err instanceof Error && err.name === 'MulterError') {
    res.status(400).json({ success: false, message: 'File upload error.', error: err.message });
    return;
  }

  // Generic error
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({
    success: false,
    message,
    ...(config.isDev && err instanceof Error ? { stack: err.stack } : {}),
  });
}
