import { Router } from 'express';
import { eventController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { validate } from '../middlewares';
import { eventSchema } from '../models/schemas';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => eventController.getAll(req, res));
router.get('/upcoming', (req, res) => eventController.getUpcoming(req, res));
router.get('/:id', (req, res) => eventController.getById(req, res));

router.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(eventSchema),
  (req, res) => eventController.create(req, res)
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => eventController.update(req, res)
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  (req, res) => eventController.delete(req, res)
);

// Participant management
router.post(
  '/:id/participants',
  authorize(UserRole.ADMIN, UserRole.VOLUNTEER),
  (req, res) => eventController.addParticipant(req, res)
);

router.delete(
  '/:id/participants/:volunteerId',
  authorize(UserRole.ADMIN),
  (req, res) => eventController.removeParticipant(req, res)
);

export default router;
