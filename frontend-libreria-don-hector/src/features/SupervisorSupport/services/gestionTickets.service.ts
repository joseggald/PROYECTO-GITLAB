import { serviceApi } from '@/services/auth';
import { Ticket, CancelTicketData, AssignTicketData } from '../types/gestionTickets.types';

export const gestionTicketsService = {
  getAllTickets: async (): Promise<Ticket[]> => {
    const { data } = await serviceApi.get('/ticket/tickets');
    return data.data.tickets || [];
  },

  cancelTicket: async ({ id_ticket, razon }: CancelTicketData): Promise<Ticket> => {
    const { data } = await serviceApi.put('/ticket/ticket/estado', {
      id_ticket,
      estado: 'Cancelado',
      razon
    });
    return data.ticket;
  },

  assignEmployee: async ({ id_ticket, id_empleado }: AssignTicketData): Promise<Ticket> => {
    const { data } = await serviceApi.put('/ticket/ticket/asignar', {
      id_ticket,
      id_empleado
    });
    return data.ticket;
  },

  completeTicket: async (id_ticket: number): Promise<Ticket> => {
    const { data } = await serviceApi.put('/ticket/ticket/estado', {
      id_ticket,
      estado: 'Resuelto'
    });
    return data.ticket;
  }
};