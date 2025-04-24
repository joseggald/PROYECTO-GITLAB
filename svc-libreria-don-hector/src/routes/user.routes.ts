import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new UserController();

router.post('/register', controller.create.bind(controller));
router.post('/login', controller.login.bind(controller));
router.get('/getAllCliente', controller.getAllCliente.bind(controller));

export { router as userRoutes };