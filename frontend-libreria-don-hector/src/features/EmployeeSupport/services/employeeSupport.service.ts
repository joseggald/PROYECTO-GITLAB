import { serviceApi } from '@/services/auth';
import { Ticket, TicketMessage, ClientInfo } from '../types/support.types';

export const EmployeeSupportService = {
    async getAssignedTickets(empleadoId: number): Promise<Ticket[]> {
        // 1. Obtener todos los tickets asignados al empleado
        const { data: ticketsData } = await serviceApi.get(`/ticket/ticket/empleado/${empleadoId}`);
        const tickets = ticketsData.data.tickets;

        // 2. Obtener todos los clientes
        const { data: clientsData } = await serviceApi.get('/users/getAllCliente');
        const clientes: ClientInfo[] = clientsData.data.clients;

        // 3. Mapear y asignar el cliente correspondiente a cada ticket
        return tickets.map((ticket: Ticket) => {
            const client = clientes.find(c => c.id_cliente === ticket.fk_id_cliente);

            const formattedClient: ClientInfo | undefined = client
                ? {
                    id_cliente: client.id_cliente,
                    nombre: client.nombre,
                    apellido: client.apellido,
                    edad: client.edad,
                    email: client.correo_electronico || ''
                }
                : undefined;

            return {
                ...ticket,
                cliente: formattedClient, // ← Asociamos el cliente al ticket
                fecha_creacion: new Date(ticket.fecha_creacion).toISOString(),
                fecha_actualizacion: new Date(ticket.fecha_actualizacion).toISOString()
            };
        });
    },

    async getTicketDetails(ticketId: number, employeeId: number): Promise<{
        ticket: Ticket;
        messages: TicketMessage[];
        client: ClientInfo;
    }> {

        try {
            // 1. Obtener todos los tickets del empleado
            const { data: ticketsData } = await serviceApi.get(`/ticket/ticket/empleado/${employeeId}`);
            const tickets = ticketsData.data.tickets;
            const ticket = tickets.find((t: Ticket) => t.id_ticket === ticketId);
            if (!ticket) {
                throw new Error('Ticket no encontrado o no asignado');
            }

            // 2. Obtener mensajes del ticket
            const { data: messagesData } = await serviceApi.get(`/ticket/ticket/${ticketId}/mensajes`);
            // 3. Obtener información del cliente
            const { data: clientsData } = await serviceApi.get('/users/getAllCliente');
            const clientes = clientsData.data.clients;
            const client = clientes.find(
                (c: ClientInfo) => c.id_cliente === ticket.fk_id_cliente
            );

            if (!client) {
                throw new Error('Cliente no encontrado');
            }
            // Formatear los datos para coincidir con los tipos
            const formattedClient: ClientInfo = {
                id_cliente: client.id_cliente,
                nombre: client.nombre,
                apellido: client.apellido,
                edad: client.edad,
                email: client.correo_electronico || ''
            };
            ticket.cliente = formattedClient;
            return {
                ticket,
                messages: messagesData.data.mensajes,
                client: formattedClient
            };
        } catch (error) {
            console.error('Error fetching ticket details:', error);
            throw error;
        }
    },


    async sendMessage(message: {
        id_ticket: number;
        mensaje: string;
        id_empleado: number;
    }): Promise<TicketMessage> {
        const { data } = await serviceApi.post('/ticket/ticket/mensaje', {
            ...message,
            remitente_tipo: 'Empleado',
            remitente_id: message.id_empleado
        });
        return data.mensaje;
    },

    async updateTicketStatus(
        ticketId: number
    ): Promise<Ticket> {
        const { data } = await serviceApi.put('/ticket/ticket/aprobacion', {
            id_ticket: ticketId
        });
        console.log('Ticket actualizado:', data.data.ticket);
        return data.data.ticket;
    }
};