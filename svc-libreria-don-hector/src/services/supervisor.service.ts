import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class SupervisorService {
  private getConnection(): Pool {
    try {
      const pool = dbManager.getConnection("postgres");
      if (!pool) {
        throw new Error("Database connection not initialized");
      }
      return pool;
    } catch (error) {
      Logger.error("Failed to get database connection:", error);
      throw new Error("Database connection error");
    }
  }

  public async getAllSupervisor(): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM Supervisor')

      return result.rows;
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error modificando supervisor: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async updateSupervisor(supervisorData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("employee: ", supervisorData);

    try {
      await client.query("BEGIN");

      const { id_supervisor, correo_electronico, telefono } = supervisorData;

      const checkQuery = `
      SELECT 
        (CASE WHEN EXISTS (SELECT 1 FROM Supervisor WHERE id_supervisor = $1) THEN 1 ELSE 0 END) AS supervisor_existe,
        (CASE WHEN EXISTS (SELECT 1 FROM Supervisor WHERE telefono = $2 AND id_supervisor != $1) THEN 1 ELSE 0 END) AS telefono_existe,
        (CASE WHEN NOT EXISTS (SELECT 1 FROM Usuarios WHERE id_supervisor = $1) THEN 1 ELSE 0 END) AS supervisor_no_usuario,
        (CASE WHEN EXISTS (SELECT 1 FROM Usuarios WHERE correo_electronico = $3 AND id_supervisor != $1) THEN 1 ELSE 0 END) AS email_existe;
    `;

      const checkResult = await client.query(checkQuery, [
        id_supervisor,
        telefono,
        correo_electronico,
      ]);

      if (!checkResult.rows[0].supervisor_existe) {
        throw new Error(
          `No existe ningún supervisor con el ID ${id_supervisor}`
        );
      }
      if (checkResult.rows[0].telefono_existe) {
        throw new Error("Ya existe un supervisor con este número de teléfono.");
      }
      if (checkResult.rows[0].email_existe) {
        throw new Error("Ya existe un usuario con este email.");
      }
      if (checkResult.rows[0].supervisor_no_usuario) {
        throw new Error("El supervisor no tiene un usuario asociado.");
      }

      const updateSupervisorQuery = `
      UPDATE Supervisor
      SET telefono = $2
      WHERE id_supervisor = $1
      RETURNING *;
    `;

      const updateUserQuery = `
      UPDATE Usuarios
      SET correo_electronico = $2
      WHERE id_supervisor = $1
      RETURNING *;
    `;

      const updatedSupervisor = await client.query(updateSupervisorQuery, [
        id_supervisor,
        telefono,
      ]);
      const updatedUser = await client.query(updateUserQuery, [
        id_supervisor,
        correo_electronico,
      ]);

      await client.query("COMMIT");

      return {
        supervisor: updatedSupervisor.rows[0],
        usuario: updatedUser.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error modificando supervisor: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async deactivateSupervisor(supervisorData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("supervisor: ", supervisorData);

    try {
      await client.query("BEGIN");

      const { id_supervisor, razon_baja, fecha_baja } = supervisorData;

      const existingSupervisor = await client.query(
        "SELECT 1 FROM Supervisor WHERE id_supervisor = $1",
        [id_supervisor]
      );

      if (existingSupervisor.rows.length === 0) {
        throw new Error("No existe ningún supervisor con este ID.");
      }

      const query = `
        UPDATE Supervisor
        SET estado = B'0',
            razon_baja = $2,
            fecha_baja = $3
        WHERE id_supervisor = $1
        RETURNING *;
      `;

      const values = [id_supervisor, razon_baja, fecha_baja];

      const result = await client.query(query, values);

      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error desactivando supervisor: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async createSupervisor(supervisorData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("supervisor: ", supervisorData);

    try {
      await client.query("BEGIN");

      const {
        nombre,
        apellido,
        cui,
        edad,
        genero,
        telefono,
        fecha_ingreso,
        fecha_baja,
        razon_baja,
      } = supervisorData;

      const query = `
        INSERT INTO Supervisor (
        nombre, apellido, cui, edad, genero, telefono, fecha_ingreso, fecha_baja, razon_baja
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;

      const values = [
        nombre,
        apellido,
        cui,
        edad,
        genero,
        telefono,
        fecha_ingreso,
        fecha_baja,
        razon_baja,
      ];

      const result = await client.query(query, values);

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error creando empleado: ", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
