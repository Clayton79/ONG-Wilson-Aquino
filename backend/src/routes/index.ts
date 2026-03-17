import { Router } from 'express';
import authRoutes from './authRoutes';
import volunteerRoutes from './volunteerRoutes';
import projectRoutes from './projectRoutes';
import donationRoutes from './donationRoutes';
import eventRoutes from './eventRoutes';
import dashboardRoutes from './dashboardRoutes';
import reportRoutes from './reportRoutes';
import backupRoutes from './backupRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/projects', projectRoutes);
router.use('/donations', donationRoutes);
router.use('/events', eventRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/backups', backupRoutes);

export default router;
