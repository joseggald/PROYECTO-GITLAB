import { TicketService } from '../../../src/services/ticket.service';
import { dbManager } from '../../../src/config/database';
import { Logger } from "../../../src/utils/Logger";

jest.mock('../../../src/config/database', () => ({
  dbManager: {
    getConnection: jest.fn()
  }
}));

jest.mock('../../../src/utils/Logger', () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn()
  }
}));

describe('TicketService', () => {
  let ticketService: TicketService;
  const mockPool = {
    connect: jest.fn()
  };
  const mockClient = {
    query: jest.fn(),
    release: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dbManager.getConnection as jest.Mock).mockReturnValue(mockPool);
    mockPool.connect.mockResolvedValue(mockClient);
    ticketService = new TicketService();
  });

  describe('crearTicket', () => {
    it('debe crear un ticket exitosamente', async () => {
      const mockTicket = {
        id_ticket: 1,
        codigo_seguimiento: 'TK-20250423-12345',
        estado: 'Pendiente',
        asunto: 'Prueba',
        descripcion: 'Prueba de ticket',
        categoria: 'Consultas de productos',
        FK_id_cliente: 1
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ codigo: 'TK-20250423-12345' }] 
      });
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockTicket] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const ticketData = {
        asunto: 'Prueba',
        descripcion: 'Prueba de ticket',
        categoria: 'Consultas de productos',
        id_cliente: 1
      };

      const result = await ticketService.crearTicket(ticketData);
      
      expect(result).toBeDefined();
      expect(result.ticket).toEqual(mockTicket);
      expect(result.mensaje).toEqual(
        expect.stringContaining('Ticket creado correctamente')
      );
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO Ticket'),
        expect.arrayContaining([ticketData.asunto])
      );
    });
    
    it('debe manejar errores en la creación de tickets', async () => {
      const ticketData = {
        asunto: 'Error',
        descripcion: 'Test de error',
        categoria: 'Problemas con la página',
        id_cliente: 1
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ codigo: 'TK-ERROR-12345' }] 
      });
      
      const error = new Error('Error de inserción');
      mockClient.query.mockRejectedValueOnce(error);
      
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(ticketService.crearTicket(ticketData)).rejects.toThrow('Error de inserción');
      
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('enviarMensaje', () => {
    it('debe agregar un mensaje a un ticket exitosamente', async () => {
      const mensajeData = {
        id_ticket: 1,
        remitente_tipo: 'cliente',
        remitente_id: 1,
        mensaje: 'Este es un mensaje de prueba'
      };
      
      const mockMensaje = {
        id_mensaje: 1,
        FK_id_ticket: 1,
        remitente_tipo: 'cliente',
        remitente_id: 1,
        mensaje: 'Este es un mensaje de prueba',
        archivo_adjunto: null,
        fecha_envio: new Date()
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockMensaje] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const result = await ticketService.enviarMensaje(mensajeData);
      
      expect(result).toEqual(mockMensaje);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO Mensaje_Ticket'),
        expect.arrayContaining([mensajeData.mensaje])
      );
      expect(Logger.info).toHaveBeenCalled();
    });
    
    it('debe manejar errores al enviar un mensaje', async () => {
      const mensajeData = {
        id_ticket: 1,
        remitente_tipo: 'cliente',
        remitente_id: 1,
        mensaje: 'Mensaje con error'
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      const error = new Error('Error al enviar mensaje');
      mockClient.query.mockRejectedValueOnce(error);
      
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(ticketService.enviarMensaje(mensajeData)).rejects.toThrow('Error al enviar mensaje');
      
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('actualizarEstadoTicket', () => {
    it('debe actualizar el estado de un ticket correctamente', async () => {
      const estadoData = {
        id_ticket: 1,
        estado: 'En proceso'
      };
      
      const mockTicketActualizado = {
        id_ticket: 1,
        estado: 'En proceso',
        fecha_actualizacion: new Date()
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockTicketActualizado] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const result = await ticketService.actualizarEstadoTicket(estadoData);
      
      expect(result).toEqual(mockTicketActualizado);
      expect(mockClient.query).toHaveBeenNthCalledWith(2, 
        expect.stringMatching(/UPDATE Ticket.*SET estado.*fecha_actualizacion/s),
        ["En proceso", 1]
      );
      expect(Logger.info).toHaveBeenCalled();
    });
    
    it('debe requerir una razón cuando se cancela un ticket', async () => {
      const estadoData = {
        id_ticket: 1,
        estado: 'Cancelado'
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(ticketService.actualizarEstadoTicket(estadoData)).rejects.toThrow(
        'Debe indicar una razón para cancelar el ticket.'
      );
      
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('obtenerTicketsPorCliente', () => {
    it('debe obtener los tickets de un cliente', async () => {
      const mockTickets = [
        { id_ticket: 1, asunto: 'Ticket 1', estado: 'Pendiente' },
        { id_ticket: 2, asunto: 'Ticket 2', estado: 'En proceso' }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockTickets });
      
      const result = await ticketService.obtenerTicketsPorCliente(1);
      
      expect(result).toEqual(mockTickets);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Ticket WHERE FK_id_cliente = $1'),
        [1]
      );
    });
    
    it('debe manejar errores al obtener tickets por cliente', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Error de conexión'));
      
      await expect(ticketService.obtenerTicketsPorCliente(1)).rejects.toThrow('Error de conexión');
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('obtenerTicketsPorEmpleado', () => {
    it('debe obtener los tickets asignados a un empleado', async () => {
      const mockTickets = [
        { id_ticket: 1, asunto: 'Ticket 1', estado: 'En proceso' },
        { id_ticket: 2, asunto: 'Ticket 2', estado: 'Aprobación' }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockTickets });
      
      const result = await ticketService.obtenerTicketsPorEmpleado(1);
      
      expect(result).toEqual(mockTickets);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Ticket WHERE FK_id_empleado = $1'),
        [1]
      );
    });
  });

  describe('getMensajesByTicketId', () => {
    it('debe obtener los mensajes de un ticket ordenados por fecha', async () => {
      const mockMensajes = [
        { id_mensaje: 1, mensaje: 'Primer mensaje', fecha_envio: new Date('2025-04-20') },
        { id_mensaje: 2, mensaje: 'Respuesta', fecha_envio: new Date('2025-04-21') }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockMensajes });
      
      const result = await ticketService.getMensajesByTicketId(1);
      
      expect(result).toEqual(mockMensajes);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM Mensaje_Ticket.*WHERE FK_id_ticket/s),
        [1]
      );
    });
  });

  describe('getAllTickets', () => {
    it('debe obtener todos los tickets', async () => {
      const mockTickets = [
        { id_ticket: 1, asunto: 'Ticket 1', estado: 'Pendiente' },
        { id_ticket: 2, asunto: 'Ticket 2', estado: 'En proceso' },
        { id_ticket: 3, asunto: 'Ticket 3', estado: 'Resuelto' }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockTickets });
      
      const result = await ticketService.getAllTickets();
      
      expect(result).toEqual(mockTickets);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Ticket')
      );
    });
  });

  describe('asignarTicketAEmpleado', () => {
    it('debe asignar un ticket a un empleado correctamente', async () => {
      const ticketId = 1;
      const empleadoId = 2;
      
      const mockTicketAsignado = {
        id_ticket: ticketId,
        fk_id_empleado: empleadoId,
        estado: 'En Proceso',
        fecha_actualizacion: new Date()
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockTicketAsignado] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const result = await ticketService.asignarTicketAEmpleado(ticketId, empleadoId);
      
      expect(result).toEqual(mockTicketAsignado);
      expect(mockClient.query).toHaveBeenNthCalledWith(2,
        expect.stringMatching(/UPDATE Ticket.*SET fk_id_empleado.*En Proceso/s),
        [2, 1]
      );
    });
  });

  describe('solicitarAprobacion', () => {
    it('debe cambiar el estado del ticket a "Aprobación"', async () => {
      const ticketId = 1;
      
      const mockTicketActualizado = {
        id_ticket: ticketId,
        estado: 'Aprobación',
        fecha_actualizacion: new Date()
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockTicketActualizado] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const result = await ticketService.solicitarAprobacion(ticketId);
      
      expect(result).toEqual(mockTicketActualizado);
      expect(mockClient.query).toHaveBeenNthCalledWith(2,
        expect.stringMatching(/UPDATE Ticket.*SET estado = 'Aprobación'/s),
        [1]
      );
    });
  });
});