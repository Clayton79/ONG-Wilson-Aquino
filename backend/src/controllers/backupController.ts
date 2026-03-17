import { Request, Response } from 'express';
import { createBackup, restoreBackup, listBackups } from '../utils';

export class BackupController {
  async create(_req: Request, res: Response): Promise<void> {
    try {
      const backupPath = await createBackup();
      res.json({ success: true, data: { path: backupPath }, message: 'Backup criado com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async restore(req: Request, res: Response): Promise<void> {
    try {
      const { backupName } = req.params;
      const success = await restoreBackup(backupName);
      if (!success) {
        res.status(404).json({ success: false, message: 'Backup não encontrado' });
        return;
      }
      res.json({ success: true, message: 'Backup restaurado com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const backups = await listBackups();
      res.json({ success: true, data: backups });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}

export const backupController = new BackupController();
