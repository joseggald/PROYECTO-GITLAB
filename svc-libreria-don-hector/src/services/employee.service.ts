import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class EmployeeService {
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

  public async getAllEmployees(): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      const query = `
        SELECT
          e.id_empleado,
          e.nombre,
          e.apellido,
          e.cui,
          e.telefono,
          e.edad,
          e.genero,
          e.fecha_contratacion,
          e.fotografia,
          e.estado,
          e.razon_baja,
          e.fecha_baja,
          e.id_supervisor,
          u.correo_electronico,
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id_factura', f.id_factura,
              'fecha_emision', f.fecha_emision,
              'total_venta', f.total_venta
            )
          ) AS facturas
        FROM Empleado e
        LEFT JOIN Factura f ON e.id_empleado = f.id_empleado
        INNER JOIN Usuarios u ON u.id_empleado = e.id_empleado
        GROUP BY e.id_empleado, e.nombre, e.apellido, u.correo_electronico;
      `;

      const response = await client.query(query)

      return response.rows
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error creando empleado: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async createEmployee(employeeData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("employee: ", employeeData);

    try {
      await client.query("BEGIN");

      const {
        nombre,
        apellido,
        cui,
        telefono,
        edad,
        genero,
        fecha_contratacion,
        fotografia,
        estado,
        razon_baja,
        fecha_baja,
        id_supervisor,
      } = employeeData;

      const existingEmployee = await client.query(
        "SELECT 1 FROM Empleado WHERE cui = $1",
        [cui]
      );

      if (existingEmployee.rows.length > 0) {
        throw new Error("Ya existe un empleado con este CUI");
      }

      const query = `
        INSERT INTO Empleado (
          nombre, apellido, cui, telefono, edad, genero, fecha_contratacion, fotografia, estado, razon_baja, fecha_baja, id_supervisor  
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING nombre, apellido, cui, telefono, edad, genero, fecha_contratacion, fotografia, estado, razon_baja, fecha_baja, id_supervisor
      `;

      const values = [
        nombre,
        apellido,
        cui,
        telefono,
        edad,
        genero,
        fecha_contratacion,
        fotografia,
        estado,
        razon_baja,
        fecha_baja,
        id_supervisor,
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

  public async updateEmployee(employeeData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("employee: ", employeeData);

    try {
      await client.query("BEGIN");

      const { id_empleado, correo_electronico, telefono } = employeeData;

      const checkQuery = `
      SELECT 
        (CASE WHEN EXISTS (SELECT 1 FROM Empleado WHERE id_empleado = $1) THEN 1 ELSE 0 END) AS empleado_existe,
        (CASE WHEN EXISTS (SELECT 1 FROM Empleado WHERE telefono = $2 AND id_empleado != $1) THEN 1 ELSE 0 END) AS telefono_existe,
        (CASE WHEN NOT EXISTS (SELECT 1 FROM Usuarios WHERE id_empleado = $1) THEN 1 ELSE 0 END) AS empleado_no_usuario,
        (CASE WHEN EXISTS (SELECT 1 FROM Usuarios WHERE correo_electronico = $3 AND id_empleado != $1) THEN 1 ELSE 0 END) AS email_existe;
    `;

      const checkResult = await client.query(checkQuery, [
        id_empleado,
        telefono,
        correo_electronico,
      ]);

      if (!checkResult.rows[0].empleado_existe) {
        throw new Error(`No existe ningún empleado con el ID ${id_empleado}`);
      }
      if (checkResult.rows[0].telefono_existe) {
        throw new Error("Ya existe un empleado con este número de teléfono.");
      }
      if (checkResult.rows[0].email_existe) {
        throw new Error("Ya existe un usuario con este email.");
      }
      if (checkResult.rows[0].empleado_no_usuario) {
        throw new Error("El empleado no tiene un usuario asociado.");
      }

      const updateEmployeeQuery = `
      UPDATE Empleado
      SET telefono = $2
      WHERE id_empleado = $1
      RETURNING *;
    `;

      const updateUserQuery = `
      UPDATE Usuarios
      SET correo_electronico = $2
      WHERE id_empleado = $1
      RETURNING *;
    `;

      const updatedEmployee = await client.query(updateEmployeeQuery, [
        id_empleado,
        telefono,
      ]);
      const updatedUser = await client.query(updateUserQuery, [
        id_empleado,
        correo_electronico,
      ]);

      await client.query("COMMIT");

      return {
        empleado: updatedEmployee.rows[0],
        usuario: updatedUser.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error creando empleado: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async deactivateEmployee(employeeData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("employee: ", employeeData);

    try {
      await client.query("BEGIN");

      const { id_empleado, razon_baja, fecha_baja } = employeeData;

      const existingEmployee = await client.query(
        "SELECT 1 FROM Empleado WHERE id_empleado = $1",
        [id_empleado]
      );

      if (existingEmployee.rows.length === 0) {
        throw new Error("No existe ningún empleado con este ID.");
      }

      const query = `
        UPDATE Empleado
        SET estado = B'0',
            razon_baja = $2,
            fecha_baja = $3
        WHERE id_empleado = $1
        RETURNING *;
      `;

      const values = [id_empleado, razon_baja, fecha_baja];

      const result = await client.query(query, values);

      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error desactivando empleado: ", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
