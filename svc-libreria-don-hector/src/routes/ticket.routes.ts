import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { ROLES } from '../dictionaries/roles';

const { EMPLEADO, SUPERVISOR, CLIENTE, GERENTE } = ROLES;

const router = Router();
const controller = new TicketController();


router.post('/ticket', controller.create.bind(controller));


router.use(authMiddleware);


router.post('/ticket/mensaje', roleMiddleware([EMPLEADO, CLIENTE]), controller.sendMessage.bind(controller));
router.get('/ticket/cliente/:id', roleMiddleware([CLIENTE]), controller.getByCliente.bind(controller));
router.get('/ticket/empleado/:id', roleMiddleware([EMPLEADO]), controller.getByEmpleado.bind(controller));
router.put('/ticket/estado', roleMiddleware([SUPERVISOR]), controller.updateEstado.bind(controller));
router.get('/ticket/:id/mensajes', roleMiddleware([EMPLEADO, SUPERVISOR, CLIENTE]), controller.getMensajesByTicketId.bind(controller));
router.get('/tickets',roleMiddleware([SUPERVISOR, EMPLEADO, GERENTE]), controller.getAll.bind(controller));
router.put("/ticket/asignar", roleMiddleware([SUPERVISOR]), controller.asignarTicket.bind(controller));
router.put("/ticket/aprobacion",roleMiddleware([EMPLEADO]), controller.solicitarAprobacion.bind(controller));
  


export { router as ticketRoutes };