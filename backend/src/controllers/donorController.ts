import { Request, Response } from 'express';
import { donorService } from '../services';

export class DonorController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: (req.query.search as string) || undefined,
        sortBy: (req.query.sortBy as string) || undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || undefined,
        type: (req.query.type as string) || undefined,
      };
      const result = await donorService.getAll(params);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const donor = await donorService.getById(req.params.id);
      res.json({ success: true, data: donor });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const donor = await donorService.create(req.body);
      res.status(201).json({ success: true, data: donor });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const donor = await donorService.update(req.params.id, req.body);
      res.json({ success: true, data: donor });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await donorService.delete(req.params.id);
      res.json({ success: true, message: 'Doador excluído com sucesso' });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }

  async getActiveList(_req: Request, res: Response): Promise<void> {
    try {
      const donors = await donorService.getActiveList();
      res.json({ success: true, data: donors });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}

export const donorController = new DonorController();
