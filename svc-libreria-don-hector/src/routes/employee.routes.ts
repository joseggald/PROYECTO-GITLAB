import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware'
import { ROLES } from '../dictionaries/roles'

const { SUPERVISOR } = ROLES;

const router = Router();
const controller = new EmployeeController();

router.use(authMiddleware)

router.get('/getAll', controller.getAll.bind(controller))
router.post('/create', roleMiddleware([SUPERVISOR]), controller.create.bind(controller));
router.put('/update', roleMiddleware([SUPERVISOR]), controller.update.bind(controller));
router.post('/deactivate', roleMiddleware([SUPERVISOR]), controller.deactivate.bind(controller));

export { router as employeeRoutes }