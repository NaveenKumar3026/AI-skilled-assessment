/**
 * SkillSet AI - Backend API Client
 * Connects the React frontend to the Express/Prisma backend.
 * Hardened with automatic token refresh, safe error handling, and session rotation.
 */

const API_BASE = '/api';

// ─── Token Management ────────────────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem('skillset_token');
export const setToken = (token: string): void => localStorage.setItem('skillset_token', token);
export const removeToken = (): void => localStorage.removeItem('skillset_token');

// Helper to get CSRF token from document.cookie if present
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── HTTP Client ─────────────────────────────────────────────────────────────

type RequestOptions = {
  method?: string;
  body?: unknown;
  isFormData?: boolean;
  retryOn401?: boolean;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, isFormData = false, retryOn401 = true } = options;
  const token = getToken();
  const csrfToken = getCsrfToken();

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    credentials: 'include', // Include HttpOnly cookies in API requests
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  // Handle Token Refresh on 401 (Requirement 38)
  if (res.status === 401 && retryOn401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.data?.token;
          if (newToken) {
            setToken(newToken);
            onRefreshed(newToken);
            isRefreshing = false;
            // Retry original request with new token
            return request<T>(endpoint, { ...options, retryOn401: false });
          }
        }
      } catch {
        // Refresh failed
      } finally {
        isRefreshing = false;
      }

      // If refresh failed, force logout
      removeToken();
      window.dispatchEvent(new CustomEvent('skillset:auth:unauthorized'));
    } else {
      // Queue concurrent requests while token is refreshing
      return new Promise<T>((resolve, reject) => {
        refreshSubscribers.push((newToken) => {
          request<T>(endpoint, { ...options, retryOn401: false })
            .then(resolve)
            .catch(reject);
        });
      });
    }
  }

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Access denied: You do not have permission to perform this action.');
    }
    if (res.status === 429) {
      throw new Error('Too many requests. Please wait a moment before trying again.');
    }

    const err = await res.json().catch(() => ({ message: 'Network request failed' }));
    const errorMessage =
      (typeof err.error === 'object' && err.error?.message) ||
      err.message ||
      (typeof err.error === 'string' && err.error) ||
      `HTTP error: ${res.status}`;
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

// ─── Response shape ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | { code: string; message: string };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CANDIDATE' | 'ASSESSOR' | 'ADMIN';
  language: string;
  location: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  location: string;
  primaryTrade: string;
  yearsOfExperience: number;
  language?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  candidateProfile?: unknown;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    request<ApiResponse<AuthResponse>>('/auth/register', { method: 'POST', body: data }),

  login: (data: LoginPayload) =>
    request<ApiResponse<AuthResponse>>('/auth/login', { method: 'POST', body: data }),

  getMe: () => request<ApiResponse<AuthUser>>('/auth/me'),

  refresh: () => request<ApiResponse<{ token: string; user: AuthUser }>>('/auth/refresh', { method: 'POST' }),

  logout: async () => {
    try {
      await request<ApiResponse<{ loggedOut: boolean }>>('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  logoutAll: async () => {
    try {
      await request<ApiResponse<{ revokedCount: number }>>('/auth/logout-all', { method: 'POST' });
    } finally {
      removeToken();
    }
  },
};

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; service: string }>('/health'),
};

// ─── Candidate ────────────────────────────────────────────────────────────────

export const candidateApi = {
  getProfile: () => request<ApiResponse<unknown>>('/candidates/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>('/candidates/profile', { method: 'PUT', body: data }),
};

// ─── Experience ───────────────────────────────────────────────────────────────

export const experienceApi = {
  list: () => request<ApiResponse<unknown[]>>('/experience'),
  add: (data: { description: string; yearsOfExperience: number; employer?: string; role?: string; location?: string }) =>
    request<ApiResponse<unknown>>('/experience', { method: 'POST', body: data }),
  analyze: (description: string) =>
    request<ApiResponse<unknown>>('/experience/analyze', { method: 'POST', body: { description } }),
};

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skillsApi = {
  getProfile: () => request<ApiResponse<unknown>>('/skills/profile'),
  getRecommendations: () => request<ApiResponse<unknown>>('/skills/recommendations'),
};

// ─── Job Roles ────────────────────────────────────────────────────────────────

export const jobRolesApi = {
  list: () => request<ApiResponse<unknown[]>>('/job-roles'),
  getById: (id: string) => request<ApiResponse<unknown>>(`/job-roles/${id}`),
};

// ─── Assessments ─────────────────────────────────────────────────────────────

export const assessmentsApi = {
  create: (data: { jobRoleId: string; type: string }) =>
    request<ApiResponse<unknown>>('/assessments', { method: 'POST', body: data }),
  list: () => request<ApiResponse<unknown[]>>('/assessments'),
  getById: (id: string) => request<ApiResponse<unknown>>(`/assessments/${id}`),
  submitResponse: (id: string, data: { questionId: string; selectedOptionId: string }) =>
    request<ApiResponse<unknown>>(`/assessments/${id}/responses`, { method: 'POST', body: data }),
  submit: (id: string) =>
    request<ApiResponse<unknown>>(`/assessments/${id}/submit`, { method: 'POST' }),
};

// ─── Practical Assessment ─────────────────────────────────────────────────────

export const practicalApi = {
  create: (data: { taskTitle: string; taskInstructions: string }) =>
    request<ApiResponse<unknown>>('/practical', { method: 'POST', body: data }),
  getById: (id: string) => request<ApiResponse<unknown>>(`/practical/${id}`),
  analyze: (id: string, videoFile?: File) => {
    if (videoFile) {
      const form = new FormData();
      form.append('video', videoFile);
      return request<ApiResponse<unknown>>(`/practical/${id}/analyze`, {
        method: 'POST',
        body: form,
        isFormData: true,
      });
    }
    return request<ApiResponse<unknown>>(`/practical/${id}/analyze`, { method: 'POST', body: {} });
  },
};

// ─── Evidence ─────────────────────────────────────────────────────────────────

export const evidenceApi = {
  upload: (file: File, fileType: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('fileType', fileType);
    return request<ApiResponse<unknown>>('/evidence', {
      method: 'POST',
      body: form,
      isFormData: true,
    });
  },
  list: () => request<ApiResponse<unknown[]>>('/evidence'),
  analyze: (id: string) =>
    request<ApiResponse<unknown>>(`/evidence/${id}/analyze`, { method: 'POST', body: {} }),
  getDownloadUrl: (id: string) => `${API_BASE}/evidence/${id}/download`,
};

// ─── Results ──────────────────────────────────────────────────────────────────

export const resultsApi = {
  getAssessmentResults: (assessmentId: string) =>
    request<ApiResponse<unknown>>(`/results/${assessmentId}`),
  getSkillGaps: (candidateId: string) =>
    request<ApiResponse<unknown>>(`/skill-gaps/${candidateId}`),
};

// ─── Assessor ─────────────────────────────────────────────────────────────────

export const assessorApi = {
  getCandidates: () => request<ApiResponse<unknown[]>>('/assessor/candidates'),
  getAssessment: (id: string) => request<ApiResponse<unknown>>(`/assessor/assessments/${id}`),
  createReview: (data: {
    assessmentId: string;
    decision: 'APPROVED' | 'REQUEST_REASSESSMENT' | 'REJECTED';
    remarks: string;
    scoreOverrides?: Record<string, number>;
  }) => request<ApiResponse<unknown>>('/assessor/reviews', { method: 'POST', body: data }),
  updateReview: (id: string, data: Record<string, unknown>) =>
    request<ApiResponse<unknown>>(`/assessor/reviews/${id}`, { method: 'PUT', body: data }),
};

// ─── Certification ────────────────────────────────────────────────────────────

export const certificationApi = {
  recommend: (candidateId: string) =>
    request<ApiResponse<unknown>>('/certifications/recommend', {
      method: 'POST',
      body: { candidateId },
    }),
  getCertifications: (candidateId: string) =>
    request<ApiResponse<unknown>>(`/certifications/${candidateId}`),
  verify: (verificationId: string) =>
    request<ApiResponse<unknown>>(`/certifications/verify/${verificationId}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () => request<ApiResponse<unknown>>('/admin/dashboard'),
  getCandidates: (page = 1, limit = 20) =>
    request<ApiResponse<unknown>>(`/admin/candidates?page=${page}&limit=${limit}`),
  getAssessments: (page = 1, limit = 20) =>
    request<ApiResponse<unknown>>(`/admin/assessments?page=${page}&limit=${limit}`),
  getAnalytics: () => request<ApiResponse<unknown>>('/admin/analytics'),
};

// ─── Backend connectivity check ───────────────────────────────────────────────

export async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await healthApi.check();
    return res.status === 'ok';
  } catch {
    return false;
  }
}
