import { volunteerRepository } from '../repositories';
import { Volunteer, PaginationParams } from '../models';
import { VolunteerInput } from '../models/schemas';
import { paginate } from '../utils';

export class VolunteerService {
  async getAll(params: PaginationParams) {
    const items = await volunteerRepository.findAll();
    return paginate<Volunteer>(items, params);
  }

  async getById(id: string): Promise<Volunteer> {
    const volunteer = await volunteerRepository.findById(id);
    if (!volunteer) {
      throw new Error('Voluntário não encontrado');
    }
    return volunteer;
  }

  async create(data: VolunteerInput): Promise<Volunteer> {
    const existingEmail = await volunteerRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Email já cadastrado');
    }

    const existingCpf = await volunteerRepository.findByCpf(data.cpf);
    if (existingCpf) {
      throw new Error('CPF já cadastrado');
    }

    return volunteerRepository.create({
      ...data,
      isActive: data.isActive ?? true,
    });
  }

  async update(id: string, data: Partial<VolunteerInput>): Promise<Volunteer> {
    const existing = await volunteerRepository.findById(id);
    if (!existing) {
      throw new Error('Voluntário não encontrado');
    }

    if (data.email && data.email !== existing.email) {
      const emailExists = await volunteerRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error('Email já cadastrado por outro voluntário');
      }
    }

    const updated = await volunteerRepository.update(id, data);
    if (!updated) {
      throw new Error('Erro ao atualizar voluntário');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const success = await volunteerRepository.delete(id);
    if (!success) {
      throw new Error('Voluntário não encontrado');
    }
  }

  async count(): Promise<number> {
    return volunteerRepository.count();
  }

  async countActive(): Promise<number> {
    return volunteerRepository.countActive();
  }
}

export const volunteerService = new VolunteerService();
