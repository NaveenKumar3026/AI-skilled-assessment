import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { errorResponse } from '../utils/response';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.requestId || (req.headers['x-request-id'] as string) || 'unknown';

  // Server-side structured error logging ONLY (never leak sensitive info to client)
  console.error(`[ERROR] [Req: ${requestId}] ${req.method} ${req.path}:`, {
    name: err instanceof Error ? err.name : 'UnknownError',
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  // 1. Zod input validation errors
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json(
      errorResponse(
        'Validation failed: Please check the supplied input parameters.',
        'VALIDATION_ERROR',
        formatted
      )
    );
    return;
  }

  // 2. Prisma Database Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json(
        errorResponse(
          'A record with this unique identifier or information already exists.',
          'RESOURCE_CONFLICT'
        )
      );
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json(
        errorResponse(
          'The requested resource was not found.',
          'RESOURCE_NOT_FOUND'
        )
      );
      return;
    }
    // Generic database error without leaking Prisma metadata
    res.status(500).json(
      errorResponse(
        'A database error occurred while processing the request.',
        'DATABASE_ERROR'
      )
    );
    return;
  }

  // 3. JWT / Authentication Errors
  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    res.status(401).json(
      errorResponse('Invalid authentication token provided.', 'INVALID_TOKEN')
    );
    return;
  }

  if (err instanceof Error && err.name === 'TokenExpiredError') {
    res.status(401).json(
      errorResponse('Authentication token has expired. Please refresh or login again.', 'TOKEN_EXPIRED')
    );
    return;
  }

  // 4. Multer / File Upload Errors
  if (err instanceof Error && (err.name === 'MulterError' || err.message.includes('File type not allowed') || err.message.includes('file size'))) {
    res.status(400).json(
      errorResponse(
        err.message || 'File upload rejected due to size or format policy.',
        'FILE_UPLOAD_ERROR'
      )
    );
    return;
  }

  // 5. Custom application business exceptions
  if (err instanceof Error) {
    const msg = err.message;
    // Client-safe application errors (bad request / not found / unauthorized)
    if (msg.includes('not found') || msg.includes('Not found')) {
      res.status(404).json(errorResponse(msg, 'RESOURCE_NOT_FOUND'));
      return;
    }
    if (msg.includes('Unauthorized') || msg.includes('unauthorized') || msg.includes('Access denied') || msg.includes('Forbidden')) {
      res.status(403).json(errorResponse(msg, 'FORBIDDEN'));
      return;
    }
    if (msg.includes('Invalid credentials') || msg.includes('Please login') || msg.includes('Authentication required')) {
      res.status(401).json(errorResponse(msg, 'UNAUTHORIZED'));
      return;
    }
    if (msg.includes('already completed') || msg.includes('already submitted') || msg.includes('already reviewed') || msg.includes('already registered') || msg.includes('immutable') || msg.includes('cannot be modified')) {
      res.status(409).json(errorResponse(msg, 'CONFLICT'));
      return;
    }
    if (msg.includes('throttled') || msg.includes('Too many attempts')) {
      res.status(429).json(errorResponse(msg, 'RATE_LIMIT_EXCEEDED'));
      return;
    }
  }

  // 6. Generic Internal Server Error (Zero Stack/Path/Secret Leaks)
  res.status(500).json(
    errorResponse(
      'An unexpected internal error occurred. Please contact support.',
      'INTERNAL_SERVER_ERROR'
    )
  );
}
