import { Request, Response } from 'express';
import { volunteerService } from '../services';

export class VolunteerController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: (req.query.search as string) || undefined,
        sortBy: (req.query.sortBy as string) || undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || undefined,
      };
      const result = await volunteerService.getAll(params);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const volunteer = await volunteerService.getById(req.params.id);
      res.json({ success: true, data: volunteer });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const volunteer = await volunteerService.create(req.body);
      res.status(201).json({ success: true, data: volunteer });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const volunteer = await volunteerService.update(req.params.id, req.body);
      res.json({ success: true, data: volunteer });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await volunteerService.delete(req.params.id);
      res.json({ success: true, message: 'Voluntário excluído com sucesso' });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }
}

export const volunteerController = new VolunteerController();
