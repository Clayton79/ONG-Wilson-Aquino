import { z } from 'zod';
import { UserRole, ProjectStatus, DonationType, EventStatus } from '../models';

// ---- Auth Schemas ----

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.VISITOR),
  phone: z.string().optional(),
});

export const recoverSchema = z.object({
  email: z.string().email('Email inválido'),
});

// ---- Volunteer Schemas ----

export const volunteerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatória'),
  address: z.string().min(5, 'Endereço obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório').max(2, 'Use a sigla do estado'),
  zipCode: z.string().min(8, 'CEP inválido'),
  skills: z.array(z.string()).default([]),
  availability: z.string().min(1, 'Disponibilidade obrigatória'),
  notes: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  userId: z.string().optional(),
});

// ---- Donor Schemas ----

export const donorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  type: z.enum(['individual', 'company']),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  userId: z.string().optional(),
});

// ---- Donation Schemas ----

export const donationSchema = z.object({
  donorId: z.string().min(1, 'Doador obrigatório'),
  donorName: z.string().min(1, 'Nome do doador obrigatório'),
  type: z.nativeEnum(DonationType),
  amount: z.number().positive('Valor deve ser positivo').optional(),
  description: z.string().min(1, 'Descrição obrigatória'),
  items: z.array(z.string()).optional(),
  date: z.string().min(1, 'Data obrigatória'),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
});

// ---- Project Schemas ----

export const projectSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PLANNING),
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().optional(),
  budget: z.number().positive().optional(),
  raised: z.number().min(0).optional(),
  coordinator: z.string().min(2, 'Coordenador obrigatório'),
  volunteerIds: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  category: z.string().min(1, 'Categoria obrigatória'),
  location: z.string().optional(),
  beneficiaries: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

// ---- Event Schemas ----

export const eventSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  status: z.nativeEnum(EventStatus).default(EventStatus.SCHEDULED),
  date: z.string().min(1, 'Data obrigatória'),
  startTime: z.string().min(1, 'Horário de início obrigatório'),
  endTime: z.string().min(1, 'Horário de término obrigatório'),
  location: z.string().min(2, 'Local obrigatório'),
  maxParticipants: z.number().int().positive().optional(),
  participantIds: z.array(z.string()).default([]),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  category: z.string().min(1, 'Categoria obrigatória'),
  notes: z.string().optional(),
});

// ---- Participation Schema ----

export const participationSchema = z.object({
  eventId: z.string().min(1, 'Evento obrigatório'),
  volunteerId: z.string().min(1, 'Voluntário obrigatório'),
  volunteerName: z.string().min(1, 'Nome do voluntário obrigatório'),
  eventName: z.string().min(1, 'Nome do evento obrigatório'),
  status: z.enum(['confirmed', 'pending', 'cancelled']).default('pending'),
  checkedIn: z.boolean().default(false),
  checkedInAt: z.string().optional(),
});

// Export types derived from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RecoverInput = z.infer<typeof recoverSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type DonorInput = z.infer<typeof donorSchema>;
export type DonationInput = z.infer<typeof donationSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type ParticipationInput = z.infer<typeof participationSchema>;
