import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class TicketService {
  private getConnection(): Pool {
    try {
      const pool = dbManager.getConnection("postgres");
      if (!pool) {
        throw new Error("No se ha inicializado la conexión a la base de datos");
      }
      return pool;
    } catch (error) {
      Logger.error("No se pudo obtener la conexión a la base de datos", error);
      throw new Error("Error de conexión a la base de datos");
    }
  }

  public async crearTicket(ticketData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const {
        asunto,
        descripcion,
        categoria,
        id_cliente,
        id_producto = null,
        archivo_adjunto = null,
      } = ticketData;

      const resultCodigo = await client.query(
        "SELECT CONCAT('TK-', TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'), '-', FLOOR(RANDOM()*10000)::INT) AS codigo"
      );
      const codigo_seguimiento = resultCodigo.rows[0].codigo;

      const insertQuery = `
        INSERT INTO Ticket (
          codigo_seguimiento,
          asunto,
          descripcion,
          categoria,
          estado,
          FK_id_cliente,
          FK_id_producto,
          archivo_adjunto
        ) VALUES ($1, $2, $3, $4, 'Pendiente', $5, $6, $7)
        RETURNING *
      `;

      const values = [
        codigo_seguimiento,
        asunto,
        descripcion,
        categoria,
        id_cliente,
        id_producto,
        archivo_adjunto,
      ];

      const result = await client.query(insertQuery, values);
      await client.query("COMMIT");

      return {
        ticket: result.rows[0],
        mensaje:
          "Ticket creado correctamente. Se ha enviado el código de seguimiento al correo del cliente.",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error al crear el ticket:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async enviarMensaje(data: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("service ticket - enviarMensaje", data);

    try {
      await client.query("BEGIN");

      const {
        id_ticket,
        remitente_tipo,
        remitente_id,
        mensaje,
        archivo_adjunto = null,
      } = data;

      const insertMessage = `
        INSERT INTO Mensaje_Ticket (
          FK_id_ticket,
          remitente_tipo,
          remitente_id,
          mensaje,
          archivo_adjunto
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [
        id_ticket,
        remitente_tipo,
        remitente_id,
        mensaje,
        archivo_adjunto,
      ];

      const result = await client.query(insertMessage, values);
      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error al enviar mensaje del ticket:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async actualizarEstadoTicket(data: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("service ticket - actualizarEstado", data);

    try {
      await client.query("BEGIN");

      const { id_ticket, estado, razon = null } = data;

      // Validación: si cancela, guardar razón
      if (estado === "Cancelado" && !razon) {
        throw new Error("Debe indicar una razón para cancelar el ticket.");
      }

      const updateQuery = `
        UPDATE Ticket
        SET estado = $1,
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_ticket = $2
        RETURNING *
      `;

      const result = await client.query(updateQuery, [estado, id_ticket]);

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error al actualizar estado del ticket:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async obtenerTicketsPorCliente(id_cliente: number): Promise<any[]> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      const result = await client.query(
        "SELECT * FROM Ticket WHERE FK_id_cliente = $1 ORDER BY fecha_creacion DESC",
        [id_cliente]
      );
      return result.rows;
    } catch (error) {
      Logger.error("Error al obtener tickets por cliente:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async obtenerTicketsPorEmpleado(id_empleado: number): Promise<any[]> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      const result = await client.query(
        "SELECT * FROM Ticket WHERE FK_id_empleado = $1 ORDER BY fecha_creacion DESC",
        [id_empleado]
      );
      return result.rows;
    } catch (error) {
      Logger.error("Error al obtener tickets por empleado:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getMensajesByTicketId(id_ticket: number): Promise<any[]> {
    const pool = this.getConnection();
    const client = await pool.connect();
  
    try {
      const query = `
        SELECT * FROM Mensaje_Ticket 
        WHERE FK_id_ticket = $1
        ORDER BY fecha_envio ASC
      `;
      const result = await client.query(query, [id_ticket]);
      return result.rows;
    } catch (error) {
      Logger.error("Error al obtener mensajes del ticket:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getAllTickets(): Promise<any[]> {
    const pool = this.getConnection();
    const client = await pool.connect();
  
    try {
      const query = `
        SELECT * FROM Ticket
        ORDER BY fecha_creacion DESC
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      Logger.error("Error al obtener todos los tickets:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async asignarTicketAEmpleado(id_ticket: number, id_empleado: number): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
  
    try {
      await client.query("BEGIN");
  
      const result = await client.query(
        `
        UPDATE Ticket
        SET fk_id_empleado = $1,
            estado = 'En Proceso',
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_ticket = $2
        RETURNING *
        `,
        [id_empleado, id_ticket]
      );
  
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error al asignar ticket:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async solicitarAprobacion(id_ticket: number): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
  
    try {
      await client.query("BEGIN");
  
      const result = await client.query(
        `
        UPDATE Ticket
        SET estado = 'Aprobación',
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_ticket = $1
        RETURNING *
        `,
        [id_ticket]
      );
  
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error al solicitar aprobación de ticket:", error);
      throw error;
    } finally {
      client.release();
    }
  }

}
