// ============================================================
// ONG Wilson Aquino — Shared Type Definitions
// ============================================================

// ---- Enums ----

export enum UserRole {
  ADMIN = 'admin',
  VOLUNTEER = 'volunteer',
  DONOR = 'donor',
  VISITOR = 'visitor',
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DonationType {
  FINANCIAL = 'financial',
  MATERIAL = 'material',
}

export enum EventStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ---- Base Entity ----

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ---- User ----

export interface User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
}

export type UserPublic = Omit<User, 'password'>;

// ---- Volunteer ----

export interface Volunteer extends BaseEntity {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  skills: string[];
  availability: string;
  notes?: string;
  isActive: boolean;
}

// ---- Donor ----

export interface Donor extends BaseEntity {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  type: 'individual' | 'company';
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  isActive: boolean;
}

// ---- Donation ----

export interface Donation extends BaseEntity {
  donorId: string;
  donorName: string;
  type: DonationType;
  amount?: number;
  description: string;
  items?: string[];
  date: string;
  projectId?: string;
  projectName?: string;
  receiptNumber?: string;
  notes?: string;
}

// ---- Project ----

export interface Project extends BaseEntity {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  budget?: number;
  raised?: number;
  coordinator: string;
  volunteerIds: string[];
  goals: string[];
  category: string;
  location?: string;
  beneficiaries?: number;
  notes?: string;
}

// ---- Event ----

export interface OngEvent extends BaseEntity {
  name: string;
  description: string;
  status: EventStatus;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants?: number;
  participantIds: string[];
  projectId?: string;
  projectName?: string;
  category: string;
  notes?: string;
}

// ---- Participation ----

export interface Participation extends BaseEntity {
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  eventName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  checkedIn: boolean;
  checkedInAt?: string;
}

// ---- Dashboard ----

export interface DashboardSummary {
  totalVolunteers: number;
  activeVolunteers: number;
  totalDonations: number;
  totalDonationAmount: number;
  activeProjects: number;
  totalProjects: number;
  upcomingEvents: number;
  totalEvents: number;
  recentDonations: Donation[];
  recentVolunteers: Volunteer[];
  upcomingEventsList: OngEvent[];
  donationsByMonth: { month: string; amount: number }[];
  volunteersByMonth: { month: string; count: number }[];
  projectsByStatus: { status: string; count: number }[];
}

// ---- Auth ----

export interface AuthSession {
  user: UserPublic;
  token: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
}

export interface RecoverRequest {
  email: string;
}

// ---- API Response ----

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---- Query Params ----

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
