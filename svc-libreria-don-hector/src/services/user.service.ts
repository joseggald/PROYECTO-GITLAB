import { Pool } from "pg";
import bcrypt from "bcrypt";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";
import environment from "../config/environment";
import { ROLES } from "../dictionaries/roles";

const { SUPERVISOR, EMPLEADO } = ROLES;

export class UserService {
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

  public async createUser(userData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("service user", userData);
    try {
      await client.query("BEGIN");

      const {
        nombre,
        apellido,
        correo_electronico,
        contrasena,
        id_rol,
        cui,
        edad,
        genero,
        telefono,
        fecha_ingreso,
        fotografia,
        fecha_baja,
        razon_baja,
        id_supervisor,
      } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await client.query(
        "SELECT correo_electronico FROM Usuarios WHERE correo_electronico = $1",
        [correo_electronico]
      );

      if (existingUser && existingUser.rows && existingUser.rows.length > 0) {
        throw new Error("Ya existe un usuario con este correo electronico");
      }

      const hashedPassword = await bcrypt.hash(
        contrasena,
        10
      );

      const query = `
      SELECT registrar_usuario(
        $1,  -- p_nombre
        $2,  -- p_apellido
        $3,  -- p_correo_electronico
        $4,  -- p_contrasena
        $5,  -- p_id_rol
        $6,  -- p_cui
        $7,  -- p_edad
        $8,  -- p_genero
        $9,  -- p_telefono
        $10, -- p_fecha_ingreso
        $11, -- p_fotografia
        $12, -- p_fecha_baja
        $13, -- p_razon_baja
        $14  -- p_id_supervisor
      )
    `;

      const values = [
        nombre,
        apellido,
        correo_electronico,
        hashedPassword,
        id_rol,
        cui,
        edad,
        genero,
        telefono,
        fecha_ingreso,
        fotografia,
        fecha_baja,
        razon_baja,
        id_supervisor,
      ];

      const result = await client.query(query, values);
      await client.query("COMMIT");

      return result && result.rows ? result.rows : [];
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error creando usuario:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async validateUser(
    correo_electronico: string,
    contrasena: string
  ): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      // Obtener datos del usuario
      const query = `
        SELECT * FROM Usuarios 
        WHERE correo_electronico = $1
      `;
      const result = await client.query(query, [correo_electronico]);
      const user = result.rows[0];

      if (!user) {
        return null;
      }

      // Validar contraseña
      const isValid = await bcrypt.compare(contrasena, user.contrasena);
      if (!isValid) {
        return null;
      }

      let userDetails = { ...user };
      delete userDetails.contrasena;

      if (user.id_cliente) {
        const clienteQuery = `SELECT * FROM Clientes WHERE id_cliente = $1`;
        const clienteResult = await client.query(clienteQuery, [
          user.id_cliente,
        ]);
        userDetails = { ...userDetails, ...clienteResult.rows[0] };
      } else if (user.id_supervisor) {
        const supervisorQuery = `SELECT * FROM Supervisor WHERE id_supervisor = $1`;
        const supervisorResult = await client.query(supervisorQuery, [
          user.id_supervisor,
        ]);
        userDetails = { ...userDetails, ...supervisorResult.rows[0] };
      } else if (user.id_empleado) {
        const empleadoQuery = `SELECT * FROM Empleado WHERE id_empleado = $1`;
        const empleadoResult = await client.query(empleadoQuery, [
          user.id_empleado,
        ]);
        userDetails = { ...userDetails, ...empleadoResult.rows[0] };
      }

      // validando que usuario de tipo supervisor y empleado esten activos
      const ESTADO_INACTIVO = "0";
      if (
        (userDetails.id_rol === EMPLEADO || userDetails.id_rol === SUPERVISOR) &&
        userDetails.estado === ESTADO_INACTIVO
      ) {
        throw new Error("El usuario no está activo");
      }

      return userDetails;
    } catch (error) {
      Logger.error("Error validating user:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getAllClients(): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      const query = `
        SELECT * FROM Clientes
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      Logger.error("Error fetching clients:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
