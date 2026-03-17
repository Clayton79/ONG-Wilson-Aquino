import { Request, Response } from 'express';
import { eventService } from '../services';

export class EventController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: (req.query.search as string) || undefined,
        sortBy: (req.query.sortBy as string) || undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || undefined,
      };
      const result = await eventService.getAll(params);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.getById(req.params.id);
      res.json({ success: true, data: event });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }

  async getUpcoming(req: Request, res: Response): Promise<void> {
    try {
      const events = await eventService.getUpcoming();
      res.json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.create(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.update(req.params.id, req.body);
      res.json({ success: true, data: event });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await eventService.delete(req.params.id);
      res.json({ success: true, message: 'Evento excluído com sucesso' });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }

  async addParticipant(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.addParticipant(req.params.id, req.body.volunteerId);
      res.json({ success: true, data: event });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async removeParticipant(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.removeParticipant(req.params.id, req.params.volunteerId);
      res.json({ success: true, data: event });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }
}

export const eventController = new EventController();
