import { Router } from 'express';
import { backupController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.get('/', (req, res) => backupController.list(req, res));
router.post('/', (req, res) => backupController.create(req, res));
router.post('/restore/:backupName', (req, res) => backupController.restore(req, res));

export default router;
