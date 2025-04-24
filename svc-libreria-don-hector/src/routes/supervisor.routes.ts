import {Router} from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware'
import { SupervisorController } from '../controllers/supervisor.controller'
import { ROLES } from '../dictionaries/roles'

const { GERENTE } = ROLES;

const router = Router();
const controller = new SupervisorController();

router.use(authMiddleware)

router.get('/getAll', roleMiddleware([GERENTE]), controller.getAll.bind(controller))
router.put('/update', roleMiddleware([GERENTE]), controller.update.bind(controller))
router.post('/create', roleMiddleware([GERENTE]), controller.create.bind(controller));
router.post('/deactive', roleMiddleware([GERENTE]), controller.deactive.bind(controller));

export { router as supervisorRoutes };