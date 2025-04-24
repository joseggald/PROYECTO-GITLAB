import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import { ResponseHandler } from '../utils/responses';
import { Logger } from '../utils/Logger';

const { sendSuccess, sendError } = ResponseHandler;

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const ticket = await this.ticketService.crearTicket(req.body);
      sendSuccess(res, "Ticket creado correctamente.", { ticket });
    } catch (error: any) {
      Logger.error("Error en TicketController - create:", error);
      sendError(res, error.message, 400);
    }
  }


  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const mensaje = await this.ticketService.enviarMensaje(req.body);
      sendSuccess(res, "Mensaje enviado correctamente.", { mensaje });
    } catch (error: any) {
      Logger.error("Error en TicketController - sendMessage:", error);
      sendError(res, error.message, 400);
    }
  }

  public async getByCliente(req: Request, res: Response): Promise<void> {
    try {
      const id_cliente = Number(req.params.id);
      const tickets = await this.ticketService.obtenerTicketsPorCliente(id_cliente);
      sendSuccess(res, "Tickets del cliente obtenidos.", { tickets });
    } catch (error: any) {
      Logger.error("Error en TicketController - getByCliente:", error);
      sendError(res, error.message, 400);
    }
  }

  public async getByEmpleado(req: Request, res: Response): Promise<void> {
    try {
      const id_empleado = Number(req.params.id);
      const tickets = await this.ticketService.obtenerTicketsPorEmpleado(id_empleado);
      sendSuccess(res, "Tickets asignados al empleado obtenidos.", { tickets });
    } catch (error: any) {
      Logger.error("Error en TicketController - getByEmpleado:", error);
      sendError(res, error.message, 400);
    }
  }

  // Cambiar estado de ticket (ej. resolver o cancelar)
  public async updateEstado(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.ticketService.actualizarEstadoTicket(req.body);
      sendSuccess(res, "Estado del ticket actualizado.", { ticket: result });
    } catch (error: any) {
      Logger.error("Error en TicketController - updateEstado:", error);
      sendError(res, error.message, 400);
    }
  }

  public async getMensajesByTicketId(req: Request, res: Response): Promise<void> {
    try {
      const id_ticket = Number(req.params.id);
      const mensajes = await this.ticketService.getMensajesByTicketId(id_ticket);
      sendSuccess(res, "Mensajes obtenidos correctamente.", { mensajes });
    } catch (error: any) {
      Logger.error("Error en TicketController - getMensajesByTicketId:", error);
      sendError(res, error.message, 400);
    }
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await this.ticketService.getAllTickets();
      sendSuccess(res, "Tickets obtenidos correctamente.", { tickets });
    } catch (error: any) {
      Logger.error("Error en TicketController - getAll:", error);
      sendError(res, error.message, 400);
    }
  }

  public async asignarTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id_ticket, id_empleado } = req.body;
  
      if (!id_ticket || !id_empleado) {
        sendError(res, "Faltan datos: id_ticket y/o id_empleado", 400);
        return;
      }
  
      const ticket = await this.ticketService.asignarTicketAEmpleado(id_ticket, id_empleado);
      sendSuccess(res, "Ticket asignado correctamente.", { ticket });
    } catch (error: any) {
      Logger.error("Error en TicketController - asignarTicket:", error);
      sendError(res, error.message, 400);
    }
  }

  public async solicitarAprobacion(req: Request, res: Response): Promise<void> {
    try {
      const { id_ticket } = req.body;
  
      if (!id_ticket) {
        sendError(res, "Falta el campo id_ticket", 400);
        return;
      }
  
      const ticket = await this.ticketService.solicitarAprobacion(id_ticket);
      sendSuccess(res, "Estado del ticket cambiado a 'Aprobación'.", { ticket });
    } catch (error: any) {
      Logger.error("Error en TicketController - solicitarAprobacion:", error);
      sendError(res, error.message, 400);
    }
  }
}