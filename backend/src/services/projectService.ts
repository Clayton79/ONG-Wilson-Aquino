import { projectRepository } from '../repositories';
import { Project, PaginationParams } from '../models';
import { ProjectInput } from '../models/schemas';
import { paginate } from '../utils';

export class ProjectService {
  async getAll(params: PaginationParams) {
    const items = await projectRepository.findAll();
    return paginate<Project>(items, params);
  }

  async getById(id: string): Promise<Project> {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new Error('Projeto não encontrado');
    }
    return project;
  }

  async getByStatus(status: string): Promise<Project[]> {
    return projectRepository.findByStatus(status);
  }

  async create(data: ProjectInput): Promise<Project> {
    return projectRepository.create(data);
  }

  async update(id: string, data: Partial<ProjectInput>): Promise<Project> {
    const existing = await projectRepository.findById(id);
    if (!existing) {
      throw new Error('Projeto não encontrado');
    }

    const updated = await projectRepository.update(id, data);
    if (!updated) {
      throw new Error('Erro ao atualizar projeto');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const success = await projectRepository.delete(id);
    if (!success) {
      throw new Error('Projeto não encontrado');
    }
  }

  async count(): Promise<number> {
    return projectRepository.count();
  }

  async countActive(): Promise<number> {
    return projectRepository.countActive();
  }
}

export const projectService = new ProjectService();
