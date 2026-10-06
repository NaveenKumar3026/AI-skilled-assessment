import { Request, Response, NextFunction, RequestHandler } from 'express';
import prisma from '../config/database';

export interface AuditEventOptions {
  actorId?: string | null;
  actorName?: string;
  actorRole?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  requestId?: string;
  details?: string;
}

/**
 * Record a security audit event in the database
 */
export async function logAuditEvent(options: AuditEventOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: options.actorId || null,
        actorName: options.actorName || 'System',
        actorRole: options.actorRole || 'SYSTEM',
        action: options.action,
        resourceType: options.resourceType || null,
        resourceId: options.resourceId || null,
        requestId: options.requestId || null,
        details: options.details || options.action,
        entityType: options.resourceType || null,
        entityId: options.resourceId || null,
      },
    });
  } catch (err) {
    // Audit log failure must not crash critical transaction flow, but log server-side
    console.error('[AUDIT_LOG_ERROR] Failed to record audit log:', err);
  }
}

/**
 * Express middleware to automatically log route execution on response finish
 */
export function auditLog(action: string, resourceType?: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.on('finish', async () => {
      // Only log on successful operations to avoid noisy error floods
      if (res.statusCode < 400) {
        await logAuditEvent({
          actorId: req.user?.id || null,
          actorName: req.user?.name || 'Anonymous',
          actorRole: req.user?.role || 'UNKNOWN',
          action,
          resourceType,
          resourceId: req.params.id,
          requestId: req.requestId,
          details: `${req.method} ${req.baseUrl + req.path} - HTTP ${res.statusCode}`,
        });
      }
    });
    next();
  };
}
