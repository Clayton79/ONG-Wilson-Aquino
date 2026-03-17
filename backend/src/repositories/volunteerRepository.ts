import { v4 as uuidv4 } from 'uuid';
import { Volunteer } from '../models';
import { readCollection, writeCollection, findById, insertOne, updateOne, deleteOne } from '../utils';

const COLLECTION = 'volunteers';

export class VolunteerRepository {
  async findAll(): Promise<Volunteer[]> {
    return readCollection<Volunteer>(COLLECTION);
  }

  async findById(id: string): Promise<Volunteer | undefined> {
    return findById<Volunteer>(COLLECTION, id);
  }

  async findByEmail(email: string): Promise<Volunteer | undefined> {
    const items = await readCollection<Volunteer>(COLLECTION);
    return items.find((v) => v.email.toLowerCase() === email.toLowerCase());
  }

  async findByCpf(cpf: string): Promise<Volunteer | undefined> {
    const items = await readCollection<Volunteer>(COLLECTION);
    return items.find((v) => v.cpf === cpf);
  }

  async create(data: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Volunteer> {
    const volunteer: Volunteer = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return insertOne<Volunteer>(COLLECTION, volunteer);
  }

  async update(id: string, data: Partial<Volunteer>): Promise<Volunteer | null> {
    return updateOne<Volunteer>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return deleteOne<Volunteer>(COLLECTION, id);
  }

  async count(): Promise<number> {
    const items = await readCollection<Volunteer>(COLLECTION);
    return items.length;
  }

  async countActive(): Promise<number> {
    const items = await readCollection<Volunteer>(COLLECTION);
    return items.filter((v) => v.isActive).length;
  }

  async resetCollection(data: Volunteer[]): Promise<void> {
    await writeCollection(COLLECTION, data);
  }
}

export const volunteerRepository = new VolunteerRepository();
