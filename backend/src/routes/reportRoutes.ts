import { Router } from 'express';
import { reportController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.get('/:type', (req, res) => reportController.generate(req, res));

export default router;
