import { Request, Response } from 'express';
import { dashboardService } from '../services';

export class DashboardController {
  async getSummary(_req: Request, res: Response): Promise<void> {
    try {
      const summary = await dashboardService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}

export const dashboardController = new DashboardController();
