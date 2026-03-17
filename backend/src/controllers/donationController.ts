import { Request, Response } from 'express';
import { donationService } from '../services';
import { DonationType } from '../models';

export class DonationController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: (req.query.search as string) || undefined,
        sortBy: (req.query.sortBy as string) || undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || undefined,
        type: (req.query.type as DonationType) || undefined,
        startDate: (req.query.startDate as string) || undefined,
        endDate: (req.query.endDate as string) || undefined,
      };
      const result = await donationService.getAll(params);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const donation = await donationService.getById(req.params.id);
      res.json({ success: true, data: donation });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const donation = await donationService.create(req.body);
      res.status(201).json({ success: true, data: donation });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const donation = await donationService.update(req.params.id, req.body);
      res.json({ success: true, data: donation });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await donationService.delete(req.params.id);
      res.json({ success: true, message: 'Doação excluída com sucesso' });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }
}

export const donationController = new DonationController();
