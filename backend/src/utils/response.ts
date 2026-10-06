import { ApiResponse, PaginationMeta } from '../types';

export function successResponse<T>(
  data: T,
  message?: string,
  meta?: PaginationMeta
): ApiResponse<T> {
  return { success: true, data, message, meta };
}

export function errorResponse(message: string, error?: unknown): ApiResponse<never> {
  return {
    success: false,
    message,
    error: typeof error === 'string' ? error : undefined,
  };
}

export function paginateQuery(page: number, limit: number): { skip: number; take: number } {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  return { skip: (safePage - 1) * safeLimit, take: safeLimit };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
