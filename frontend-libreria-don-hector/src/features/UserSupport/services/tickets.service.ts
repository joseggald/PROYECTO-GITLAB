import { serviceApi } from '@/services/auth';
import { Ticket, TicketMessage } from '../types/tickets.types';

const STATUS_COLORS = {
  'Pendiente': 'bg-yellow-100 text-yellow-800',
  'En Proceso': 'bg-blue-100 text-blue-800',
  'Resuelto': 'bg-green-100 text-green-800',
  'Cancelado': 'bg-red-100 text-red-800',
};

export const ticketsService = {
  STATUS_COLORS,

  getClientTickets: async (id_cliente: number): Promise<Ticket[]> => {
    try {
      const { data } = await serviceApi.get(`/ticket/ticket/cliente/${id_cliente}`);
      return data.data.tickets || [];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  createTicket: async (ticketData: {
    asunto: string;
    descripcion: string;
    categoria: string;
    id_cliente: number;
    id_producto?: number;
    archivo_adjunto?: string;
  }): Promise<Ticket> => {
    try {
      const { data } = await serviceApi.post('/ticket/ticket', ticketData);
      return data.ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  getTicketMessages: async (ticketId: number): Promise<TicketMessage[]> => {
    try {
      const { data } = await serviceApi.get(`/ticket/ticket/${ticketId}/mensajes`); 
      return data.data.mensajes || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },
 

  async sendMessage(message: {
          id_ticket: number;
          mensaje: string;
          id_usuario: number;
          remitente_tipo: 'Cliente' | 'Empleado';
          remitente_id: number;
      }): Promise<TicketMessage> {
          const { data } = await serviceApi.post('/ticket/ticket/mensaje', {
              ...message,
              remitente_tipo: 'Cliente',
              remitente_id: message.id_usuario
          });
          return data.mensaje;
      },

  updateTicketStatus: async (ticketId: number, estado: string, razon?: string): Promise<Ticket> => {
    try {
      const { data } = await serviceApi.put('/ticket/ticket/estado', { 
        id_ticket: ticketId, 
        estado, 
        razon 
      });
      return data.ticket;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  }
};