import { donorRepository } from '../repositories';
import { Donor, PaginationParams } from '../models';
import { DonorInput } from '../models/schemas';
import { paginate } from '../utils';

export class DonorService {
  async getAll(params: PaginationParams & { type?: string }) {
    let items = await donorRepository.findAll();
    if (params.type) items = items.filter((d) => d.type === params.type);
    return paginate<Donor>(items, params);
  }

  async getById(id: string): Promise<Donor> {
    const donor = await donorRepository.findById(id);
    if (!donor) throw new Error('Doador não encontrado');
    return donor;
  }

  async create(data: DonorInput): Promise<Donor> {
    const existingEmail = await donorRepository.findByEmail(data.email);
    if (existingEmail) throw new Error('Email já cadastrado');

    if (data.cpf) {
      const existingCpf = await donorRepository.findByCpf(data.cpf);
      if (existingCpf) throw new Error('CPF já cadastrado');
    }

    if (data.cnpj) {
      const existingCnpj = await donorRepository.findByCnpj(data.cnpj);
      if (existingCnpj) throw new Error('CNPJ já cadastrado');
    }

    return donorRepository.create({ ...data, isActive: data.isActive ?? true });
  }

  async update(id: string, data: Partial<DonorInput>): Promise<Donor> {
    const existing = await donorRepository.findById(id);
    if (!existing) throw new Error('Doador não encontrado');

    if (data.email && data.email !== existing.email) {
      const emailExists = await donorRepository.findByEmail(data.email);
      if (emailExists) throw new Error('Email já cadastrado por outro doador');
    }

    const updated = await donorRepository.update(id, data);
    if (!updated) throw new Error('Erro ao atualizar doador');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const success = await donorRepository.delete(id);
    if (!success) throw new Error('Doador não encontrado');
  }

  async count(): Promise<number> {
    return donorRepository.count();
  }

  async countActive(): Promise<number> {
    return donorRepository.countActive();
  }

  async getActiveList(): Promise<Donor[]> {
    const items = await donorRepository.findAll();
    return items.filter((d) => d.isActive);
  }
}

export const donorService = new DonorService();
