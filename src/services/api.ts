/**
 * SkillSet AI - Backend API Client
 * Connects the React frontend to the Express/Prisma backend.
 * All API calls go through this module.
 */

const API_BASE = '/api';

// ─── Token Management ────────────────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem('skillset_token');
export const setToken = (token: string): void => localStorage.setItem('skillset_token', token);
export const removeToken = (): void => localStorage.removeItem('skillset_token');

// ─── HTTP Client ─────────────────────────────────────────────────────────────

type RequestOptions = {
  method?: string;
  body?: unknown;
  isFormData?: boolean;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, isFormData = false } = options;
  const token = getToken();

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Response shape ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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
  candidateProfile?: unknown;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    request<ApiResponse<AuthResponse>>('/auth/register', { method: 'POST', body: data }),

  login: (data: LoginPayload) =>
    request<ApiResponse<AuthResponse>>('/auth/login', { method: 'POST', body: data }),

  getMe: () => request<ApiResponse<AuthUser>>('/auth/me'),
};

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; service: string; version: string; timestamp: string }>('/health'),
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
