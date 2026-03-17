import { v4 as uuidv4 } from 'uuid';
import { User } from '../models';
import { readCollection, writeCollection, findById, insertOne, updateOne, deleteOne } from '../utils';

const COLLECTION = 'users';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return readCollection<User>(COLLECTION);
  }

  async findById(id: string): Promise<User | undefined> {
    return findById<User>(COLLECTION, id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const users = await readCollection<User>(COLLECTION);
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return insertOne<User>(COLLECTION, user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return updateOne<User>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return deleteOne<User>(COLLECTION, id);
  }

  async count(): Promise<number> {
    const users = await readCollection<User>(COLLECTION);
    return users.length;
  }

  async resetCollection(data: User[]): Promise<void> {
    await writeCollection(COLLECTION, data);
  }
}

export const userRepository = new UserRepository();
