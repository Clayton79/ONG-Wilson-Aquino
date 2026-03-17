import { v4 as uuidv4 } from 'uuid';
import { Donation, DonationType } from '../models';
import { readCollection, writeCollection, findById, insertOne, updateOne, deleteOne } from '../utils';

const COLLECTION = 'donations';

export class DonationRepository {
  async findAll(): Promise<Donation[]> {
    return readCollection<Donation>(COLLECTION);
  }

  async findById(id: string): Promise<Donation | undefined> {
    return findById<Donation>(COLLECTION, id);
  }

  async findByDonorId(donorId: string): Promise<Donation[]> {
    const items = await readCollection<Donation>(COLLECTION);
    return items.filter((d) => d.donorId === donorId);
  }

  async findByType(type: DonationType): Promise<Donation[]> {
    const items = await readCollection<Donation>(COLLECTION);
    return items.filter((d) => d.type === type);
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Donation[]> {
    const items = await readCollection<Donation>(COLLECTION);
    return items.filter((d) => d.date >= startDate && d.date <= endDate);
  }

  async create(data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation> {
    const donation: Donation = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return insertOne<Donation>(COLLECTION, donation);
  }

  async update(id: string, data: Partial<Donation>): Promise<Donation | null> {
    return updateOne<Donation>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return deleteOne<Donation>(COLLECTION, id);
  }

  async count(): Promise<number> {
    const items = await readCollection<Donation>(COLLECTION);
    return items.length;
  }

  async totalAmount(): Promise<number> {
    const items = await readCollection<Donation>(COLLECTION);
    return items.reduce((sum, d) => sum + (d.amount || 0), 0);
  }

  async resetCollection(data: Donation[]): Promise<void> {
    await writeCollection(COLLECTION, data);
  }
}

export const donationRepository = new DonationRepository();
