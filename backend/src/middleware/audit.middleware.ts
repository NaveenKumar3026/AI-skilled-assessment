import { Request, Response, NextFunction, RequestHandler } from 'express';
import prisma from '../config/database';

export function auditLog(action: string, entityType?: string): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.on('finish', async () => {
      try {
        if (res.statusCode < 400) {
          await prisma.auditLog.create({
            data: {
              actorId: req.user?.id,
              actorName: req.user?.name || 'Anonymous',
              actorRole: req.user?.role || 'UNKNOWN',
              action,
              details: `${req.method} ${req.path} - Status: ${res.statusCode}`,
              entityType: entityType,
              entityId: req.params.id,
            },
          });
        }
      } catch {
        // Audit log failure should not break the request
      }
    });
    next();
  };
}
