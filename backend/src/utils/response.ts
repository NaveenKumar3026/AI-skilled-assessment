import { ApiResponse, PaginationMeta, ApiErrorDetail } from '../types';
import { sanitizeData } from './sanitize';
import { securityConfig } from '../config/security.config';

export function successResponse<T>(
  data: T,
  message?: string,
  meta?: PaginationMeta
): ApiResponse<T> {
  return {
    success: true,
    data: sanitizeData(data),
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
  };
}

export function errorResponse(
  message: string,
  code = 'BAD_REQUEST',
  details?: unknown
): ApiResponse<never> {
  const errorObj: ApiErrorDetail = {
    code,
    message,
    ...(details ? { details } : {}),
  };

  return {
    success: false,
    message, // Preserves backward compatibility with clients reading res.message
    error: errorObj,
  };
}

export function paginateQuery(page: number, limit: number): { skip: number; take: number } {
  const safePage = Math.max(1, Math.floor(page || 1));
  const maxLimit = securityConfig.pagination.maxLimit;
  const safeLimit = Math.min(maxLimit, Math.max(1, Math.floor(limit || securityConfig.pagination.defaultLimit)));
  return { skip: (safePage - 1) * safeLimit, take: safeLimit };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const maxLimit = securityConfig.pagination.maxLimit;
  const safeLimit = Math.min(maxLimit, Math.max(1, Math.floor(limit || securityConfig.pagination.defaultLimit)));
  return {
    page: Math.max(1, Math.floor(page || 1)),
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
  };
}
