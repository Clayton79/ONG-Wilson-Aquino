import { Request, Response } from 'express';
import { authService } from '../services';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const session = await authService.login(req.body);
      res.json({ success: true, data: session });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const session = await authService.register(req.body);
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async recover(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.recover(req.body.email);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async profile(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.getProfile(req.user!.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user!.id, req.body);
      if (!user) {
        res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}

export const authController = new AuthController();
