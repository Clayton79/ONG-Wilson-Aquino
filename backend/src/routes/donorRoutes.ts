import { Router } from 'express';
import { donorController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { validate } from '../middlewares';
import { donorSchema } from '../models/schemas';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => donorController.getAll(req, res));
router.get('/active', (req, res) => donorController.getActiveList(req, res));
router.get('/:id', (req, res) => donorController.getById(req, res));

router.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(donorSchema),
  (req, res) => donorController.create(req, res)
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => donorController.update(req, res)
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => donorController.delete(req, res)
);

export default router;
