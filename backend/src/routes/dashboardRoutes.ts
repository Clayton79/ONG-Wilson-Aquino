import { Router } from 'express';
import { dashboardController } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.use(authenticate);

router.get('/summary', (req, res) => dashboardController.getSummary(req, res));

export default router;
