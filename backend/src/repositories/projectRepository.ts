import { v4 as uuidv4 } from 'uuid';
import { Project } from '../models';
import { readCollection, writeCollection, findById, insertOne, updateOne, deleteOne } from '../utils';

const COLLECTION = 'projects';

export class ProjectRepository {
  async findAll(): Promise<Project[]> {
    return readCollection<Project>(COLLECTION);
  }

  async findById(id: string): Promise<Project | undefined> {
    return findById<Project>(COLLECTION, id);
  }

  async findByStatus(status: string): Promise<Project[]> {
    const items = await readCollection<Project>(COLLECTION);
    return items.filter((p) => p.status === status);
  }

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const project: Project = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return insertOne<Project>(COLLECTION, project);
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    return updateOne<Project>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return deleteOne<Project>(COLLECTION, id);
  }

  async count(): Promise<number> {
    const items = await readCollection<Project>(COLLECTION);
    return items.length;
  }

  async countActive(): Promise<number> {
    const items = await readCollection<Project>(COLLECTION);
    return items.filter((p) => p.status === 'active').length;
  }

  async resetCollection(data: Project[]): Promise<void> {
    await writeCollection(COLLECTION, data);
  }
}

export const projectRepository = new ProjectRepository();
