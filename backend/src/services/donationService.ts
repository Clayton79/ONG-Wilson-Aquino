import { donationRepository } from '../repositories';
import { Donation, DonationType, PaginationParams } from '../models';
import { DonationInput } from '../models/schemas';
import { paginate } from '../utils';

export class DonationService {
  async getAll(params: PaginationParams & { type?: DonationType; startDate?: string; endDate?: string }) {
    let items = await donationRepository.findAll();

    if (params.type) {
      items = items.filter((d) => d.type === params.type);
    }
    if (params.startDate) {
      items = items.filter((d) => d.date >= params.startDate!);
    }
    if (params.endDate) {
      items = items.filter((d) => d.date <= params.endDate!);
    }

    return paginate<Donation>(items, params);
  }

  async getById(id: string): Promise<Donation> {
    const donation = await donationRepository.findById(id);
    if (!donation) {
      throw new Error('Doação não encontrada');
    }
    return donation;
  }

  async getByDonorId(donorId: string): Promise<Donation[]> {
    return donationRepository.findByDonorId(donorId);
  }

  async create(data: DonationInput): Promise<Donation> {
    return donationRepository.create(data);
  }

  async update(id: string, data: Partial<DonationInput>): Promise<Donation> {
    const existing = await donationRepository.findById(id);
    if (!existing) {
      throw new Error('Doação não encontrada');
    }

    const updated = await donationRepository.update(id, data);
    if (!updated) {
      throw new Error('Erro ao atualizar doação');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const success = await donationRepository.delete(id);
    if (!success) {
      throw new Error('Doação não encontrada');
    }
  }

  async count(): Promise<number> {
    return donationRepository.count();
  }

  async totalAmount(): Promise<number> {
    return donationRepository.totalAmount();
  }
}

export const donationService = new DonationService();
