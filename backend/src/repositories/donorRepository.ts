import { v4 as uuidv4 } from 'uuid';
import { Donor } from '../models';
import { readCollection, writeCollection, findById, insertOne, updateOne, deleteOne } from '../utils';

const COLLECTION = 'donors';

export class DonorRepository {
  async findAll(): Promise<Donor[]> {
    return readCollection<Donor>(COLLECTION);
  }

  async findById(id: string): Promise<Donor | undefined> {
    return findById<Donor>(COLLECTION, id);
  }

  async findByEmail(email: string): Promise<Donor | undefined> {
    const items = await readCollection<Donor>(COLLECTION);
    return items.find((d) => d.email.toLowerCase() === email.toLowerCase());
  }

  async findByCpf(cpf: string): Promise<Donor | undefined> {
    const items = await readCollection<Donor>(COLLECTION);
    return items.find((d) => d.cpf === cpf);
  }

  async findByCnpj(cnpj: string): Promise<Donor | undefined> {
    const items = await readCollection<Donor>(COLLECTION);
    return items.find((d) => d.cnpj === cnpj);
  }

  async create(data: Omit<Donor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donor> {
    const donor: Donor = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return insertOne<Donor>(COLLECTION, donor);
  }

  async update(id: string, data: Partial<Donor>): Promise<Donor | null> {
    return updateOne<Donor>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return deleteOne<Donor>(COLLECTION, id);
  }

  async count(): Promise<number> {
    const items = await readCollection<Donor>(COLLECTION);
    return items.length;
  }

  async countActive(): Promise<number> {
    const items = await readCollection<Donor>(COLLECTION);
    return items.filter((d) => d.isActive).length;
  }

  async resetCollection(data: Donor[]): Promise<void> {
    await writeCollection(COLLECTION, data);
  }
}

export const donorRepository = new DonorRepository();
