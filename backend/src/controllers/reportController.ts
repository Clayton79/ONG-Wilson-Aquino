import { Request, Response } from 'express';
import { reportService } from '../services';

export class ReportController {
  async generate(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const filters = req.query as Record<string, string>;
      const report = await reportService.generateReport(
        type as 'volunteers' | 'donations' | 'projects' | 'events',
        filters
      );

      const format = req.query.format as string;
      if (format === 'csv') {
        const csv = reportService.toCSV(report.data as Record<string, unknown>[]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${type}-report.csv`);
        res.send(csv);
        return;
      }

      res.json({ success: true, data: report });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }
}

export const reportController = new ReportController();
