import { Router } from 'express';
import { projectController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { validate } from '../middlewares';
import { projectSchema } from '../models/schemas';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => projectController.getAll(req, res));
router.get('/:id', (req, res) => projectController.getById(req, res));

router.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(projectSchema),
  (req, res) => projectController.create(req, res)
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => projectController.update(req, res)
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => projectController.delete(req, res)
);

export default router;
