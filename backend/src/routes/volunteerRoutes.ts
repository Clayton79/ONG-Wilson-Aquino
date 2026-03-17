import { Router } from 'express';
import { volunteerController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { validate } from '../middlewares';
import { volunteerSchema } from '../models/schemas';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => volunteerController.getAll(req, res));
router.get('/:id', (req, res) => volunteerController.getById(req, res));

router.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(volunteerSchema),
  (req, res) => volunteerController.create(req, res)
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => volunteerController.update(req, res)
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => volunteerController.delete(req, res)
);

export default router;
