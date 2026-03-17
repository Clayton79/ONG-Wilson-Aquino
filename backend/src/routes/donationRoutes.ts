import { Router } from 'express';
import { donationController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { validate } from '../middlewares';
import { donationSchema } from '../models/schemas';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => donationController.getAll(req, res));
router.get('/:id', (req, res) => donationController.getById(req, res));

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.DONOR),
  validate(donationSchema),
  (req, res) => donationController.create(req, res)
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => donationController.update(req, res)
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => donationController.delete(req, res)
);

export default router;
