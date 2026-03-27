import { Router } from 'express';
import authRoutes from './authRoutes';
import volunteerRoutes from './volunteerRoutes';
import donorRoutes from './donorRoutes';
import projectRoutes from './projectRoutes';
import donationRoutes from './donationRoutes';
import eventRoutes from './eventRoutes';
import dashboardRoutes from './dashboardRoutes';
import reportRoutes from './reportRoutes';
import backupRoutes from './backupRoutes';

const router = Router();

// API root — lista de endpoints disponíveis
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'CUFA Pernambuco API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Login',
        'POST /api/auth/register': 'Registrar usuário',
        'POST /api/auth/recover': 'Recuperar senha',
        'GET /api/auth/profile': 'Perfil do usuário (auth)',
        'PUT /api/auth/profile': 'Atualizar perfil (auth)',
      },
      volunteers: {
        'GET /api/volunteers': 'Listar voluntários (auth)',
        'GET /api/volunteers/:id': 'Buscar voluntário (auth)',
        'POST /api/volunteers': 'Criar voluntário (admin)',
        'PUT /api/volunteers/:id': 'Atualizar voluntário (admin)',
        'DELETE /api/volunteers/:id': 'Remover voluntário (admin)',
      },
      donors: {
        'GET /api/donors': 'Listar doadores (auth)',
        'GET /api/donors/active': 'Listar doadores ativos (auth)',
        'GET /api/donors/:id': 'Buscar doador (auth)',
        'POST /api/donors': 'Criar doador (admin)',
        'PUT /api/donors/:id': 'Atualizar doador (admin)',
        'DELETE /api/donors/:id': 'Remover doador (admin)',
      },
      projects: {
        'GET /api/projects': 'Listar projetos (auth)',
        'GET /api/projects/:id': 'Buscar projeto (auth)',
        'POST /api/projects': 'Criar projeto (admin)',
        'PUT /api/projects/:id': 'Atualizar projeto (admin)',
        'DELETE /api/projects/:id': 'Remover projeto (admin)',
      },
      donations: {
        'GET /api/donations': 'Listar doações (auth)',
        'GET /api/donations/:id': 'Buscar doação (auth)',
        'POST /api/donations': 'Registrar doação (admin/donor)',
        'PUT /api/donations/:id': 'Atualizar doação (admin)',
        'DELETE /api/donations/:id': 'Remover doação (admin)',
      },
      events: {
        'GET /api/events': 'Listar eventos (auth)',
        'GET /api/events/upcoming': 'Próximos eventos (auth)',
        'GET /api/events/:id': 'Buscar evento (auth)',
        'POST /api/events': 'Criar evento (admin)',
        'PUT /api/events/:id': 'Atualizar evento (admin)',
        'DELETE /api/events/:id': 'Remover evento (admin)',
        'POST /api/events/:id/participants': 'Adicionar participante (admin/volunteer)',
        'DELETE /api/events/:id/participants/:volunteerId': 'Remover participante (admin)',
      },
      dashboard: {
        'GET /api/dashboard/summary': 'Resumo do painel (auth)',
      },
      reports: {
        'GET /api/reports/:type': 'Gerar relatório - types: volunteers, donors, donations, projects, events (admin)',
      },
      backups: {
        'GET /api/backups': 'Listar backups (admin)',
        'POST /api/backups': 'Criar backup (admin)',
        'POST /api/backups/restore/:backupName': 'Restaurar backup (admin)',
      },
    },
  });
});

router.use('/auth', authRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/donors', donorRoutes);
router.use('/projects', projectRoutes);
router.use('/donations', donationRoutes);
router.use('/events', eventRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/backups', backupRoutes);

export default router;
