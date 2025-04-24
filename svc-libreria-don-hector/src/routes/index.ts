import { Application, Router } from 'express';
import { healthRoutes } from './health.routes';
import {bookRoutes} from './book.routes';
import { wishlistRoutes } from './wishlist.routes';
import { userRoutes } from './user.routes';
import {commentRoutes} from './comment.routes';
import { employeeRoutes } from './employee.routes';
import { supervisorRoutes } from './supervisor.routes';
import { ResponseHandler } from '../utils/responses';
import { productoRoutes } from './producto.routes';
import { invoiceRoutes } from './invoice.routes';
import {salesReportRoutes} from './salesReport.routes'
import {ticketRoutes} from './ticket.routes'

const { sendError } = ResponseHandler;

export const initializeRoutes = (app: Application): void => {
  const apiRouter = Router();
  
  // Rutas de API
  apiRouter.use('/', healthRoutes);
  apiRouter.use('/users', userRoutes);
  apiRouter.use('/clients', employeeRoutes)
  apiRouter.use('/invoice', invoiceRoutes);
  // Agrega aquí otras rutas cuando las crees
  apiRouter.use('/productos', productoRoutes);  
  apiRouter.use('/comentarios', commentRoutes);
  apiRouter.use('/libros', bookRoutes);
  apiRouter.use('/wishlist', wishlistRoutes);
  apiRouter.use('/supervisor', supervisorRoutes);
  apiRouter.use('/reports',salesReportRoutes);
  apiRouter.use('/ticket',ticketRoutes);
  
  // Prefijo global para todas las rutas de API
  app.use('', apiRouter);
  
  // Manejador de rutas no encontradas
  app.use('*', (req, res) => {
    sendError(res, `Route ${req.originalUrl} not found`, 404);
  });
};