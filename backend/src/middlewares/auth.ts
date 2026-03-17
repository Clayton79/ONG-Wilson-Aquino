import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils';
import { userRepository } from '../repositories';
import { UserRole, UserPublic } from '../models';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPublic;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado',
    });
    return;
  }

  // Attach decoded user to request
  userRepository.findById(payload.id).then((user) => {
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou desativado',
      });
      return;
    }

    const { password: _password, ...publicUser } = user;
    req.user = publicUser;
    next();
  }).catch(() => {
    res.status(500).json({
      success: false,
      message: 'Erro interno de autenticação',
    });
  });
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Não autenticado',
      });
      return;
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Acesso negado. Permissão insuficiente.',
      });
      return;
    }

    next();
  };
}
