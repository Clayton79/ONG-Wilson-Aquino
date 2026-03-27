import { api } from './api';
import type {
  ApiResponse,
  AuthSession,
  PaginatedResponse,
  Volunteer,
  Donor,
  Project,
  Donation,
  OngEvent,
  DashboardSummary,
} from '../types';

// ---- Auth ----
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthSession>>('/auth/login', data),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<AuthSession>>('/auth/register', data),
  recover: (data: { email: string }) =>
    api.post<ApiResponse<{ message: string }>>('/auth/recover', data),
  profile: () => api.get<ApiResponse<AuthSession['user']>>('/auth/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    api.put<ApiResponse<AuthSession['user']>>('/auth/profile', data),
};

// ---- Volunteers ----
export const volunteerApi = {
  getAll: (params?: string) =>
    api.get<PaginatedResponse<Volunteer>>(`/volunteers${params ? `?${params}` : ''}`),
  getById: (id: string) =>
    api.get<ApiResponse<Volunteer>>(`/volunteers/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Volunteer>>('/volunteers', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<Volunteer>>(`/volunteers/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/volunteers/${id}`),
};

// ---- Donors ----
export const donorApi = {
  getAll: (params?: string) =>
    api.get<PaginatedResponse<Donor>>(`/donors${params ? `?${params}` : ''}`),
  getById: (id: string) =>
    api.get<ApiResponse<Donor>>(`/donors/${id}`),
  getActive: () =>
    api.get<ApiResponse<Donor[]>>('/donors/active'),
  create: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Donor>>('/donors', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<Donor>>(`/donors/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/donors/${id}`),
};

// ---- Projects ----
export const projectApi = {
  getAll: (params?: string) =>
    api.get<PaginatedResponse<Project>>(`/projects${params ? `?${params}` : ''}`),
  getById: (id: string) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Project>>('/projects', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/projects/${id}`),
};

// ---- Donations ----
export const donationApi = {
  getAll: (params?: string) =>
    api.get<PaginatedResponse<Donation>>(`/donations${params ? `?${params}` : ''}`),
  getById: (id: string) =>
    api.get<ApiResponse<Donation>>(`/donations/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Donation>>('/donations', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<Donation>>(`/donations/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/donations/${id}`),
};

// ---- Events ----
export const eventApi = {
  getAll: (params?: string) =>
    api.get<PaginatedResponse<OngEvent>>(`/events${params ? `?${params}` : ''}`),
  getById: (id: string) =>
    api.get<ApiResponse<OngEvent>>(`/events/${id}`),
  getUpcoming: () =>
    api.get<ApiResponse<OngEvent[]>>('/events/upcoming'),
  create: (data: Record<string, unknown>) =>
    api.post<ApiResponse<OngEvent>>('/events', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<OngEvent>>(`/events/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/events/${id}`),
  addParticipant: (eventId: string, volunteerId: string) =>
    api.post<ApiResponse<OngEvent>>(`/events/${eventId}/participants`, { volunteerId }),
  removeParticipant: (eventId: string, volunteerId: string) =>
    api.delete<ApiResponse<OngEvent>>(`/events/${eventId}/participants/${volunteerId}`),
};

// ---- Dashboard ----
export const dashboardApi = {
  getSummary: () =>
    api.get<ApiResponse<DashboardSummary>>('/dashboard/summary'),
};

// ---- Reports ----
export const reportApi = {
  generate: (type: string, params?: string) =>
    api.get<ApiResponse<unknown>>(`/reports/${type}${params ? `?${params}` : ''}`),
  generateCSV: (type: string, params?: string) =>
    api.get<string>(`/reports/${type}?format=csv${params ? `&${params}` : ''}`),
};

// ---- Backups ----
export const backupApi = {
  list: () => api.get<ApiResponse<string[]>>('/backups'),
  create: () => api.post<ApiResponse<{ path: string }>>('/backups'),
  restore: (backupName: string) =>
    api.post<ApiResponse<void>>(`/backups/restore/${backupName}`),
};
