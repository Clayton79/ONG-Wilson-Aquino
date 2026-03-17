import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate } from '../middlewares';
import { validate } from '../middlewares';
import { loginSchema, registerSchema, recoverSchema } from '../models/schemas';

const router = Router();

router.post('/login', validate(loginSchema), (req, res) => authController.login(req, res));
router.post('/register', validate(registerSchema), (req, res) => authController.register(req, res));
router.post('/recover', validate(recoverSchema), (req, res) => authController.recover(req, res));
router.get('/profile', authenticate, (req, res) => authController.profile(req, res));
router.put('/profile', authenticate, (req, res) => authController.updateProfile(req, res));

export default router;
