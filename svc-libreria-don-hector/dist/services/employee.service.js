"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class EmployeeService {
    getConnection() {
        try {
            const pool = database_1.dbManager.getConnection("postgres");
            if (!pool) {
                throw new Error("Database connection not initialized");
            }
            return pool;
        }
        catch (error) {
            Logger_1.Logger.error("Failed to get database connection:", error);
            throw new Error("Database connection error");
        }
    }
    getAllEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
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
                const response = yield client.query(query);
                return response.rows;
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error creando empleado: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    createEmployee(employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("employee: ", employeeData);
            try {
                yield client.query("BEGIN");
                const { nombre, apellido, cui, telefono, edad, genero, fecha_contratacion, fotografia, estado, razon_baja, fecha_baja, id_supervisor, } = employeeData;
                const existingEmployee = yield client.query("SELECT 1 FROM Empleado WHERE cui = $1", [cui]);
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
                const result = yield client.query(query, values);
                yield client.query("COMMIT");
                return result.rows[0];
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error creando empleado: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    updateEmployee(employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("employee: ", employeeData);
            try {
                yield client.query("BEGIN");
                const { id_empleado, correo_electronico, telefono } = employeeData;
                const checkQuery = `
      SELECT 
        (CASE WHEN EXISTS (SELECT 1 FROM Empleado WHERE id_empleado = $1) THEN 1 ELSE 0 END) AS empleado_existe,
        (CASE WHEN EXISTS (SELECT 1 FROM Empleado WHERE telefono = $2 AND id_empleado != $1) THEN 1 ELSE 0 END) AS telefono_existe,
        (CASE WHEN NOT EXISTS (SELECT 1 FROM Usuarios WHERE id_empleado = $1) THEN 1 ELSE 0 END) AS empleado_no_usuario,
        (CASE WHEN EXISTS (SELECT 1 FROM Usuarios WHERE correo_electronico = $3 AND id_empleado != $1) THEN 1 ELSE 0 END) AS email_existe;
    `;
                const checkResult = yield client.query(checkQuery, [
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
                const updatedEmployee = yield client.query(updateEmployeeQuery, [
                    id_empleado,
                    telefono,
                ]);
                const updatedUser = yield client.query(updateUserQuery, [
                    id_empleado,
                    correo_electronico,
                ]);
                yield client.query("COMMIT");
                return {
                    empleado: updatedEmployee.rows[0],
                    usuario: updatedUser.rows[0],
                };
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error creando empleado: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    deactivateEmployee(employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("employee: ", employeeData);
            try {
                yield client.query("BEGIN");
                const { id_empleado, razon_baja, fecha_baja } = employeeData;
                const existingEmployee = yield client.query("SELECT 1 FROM Empleado WHERE id_empleado = $1", [id_empleado]);
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
                const result = yield client.query(query, values);
                yield client.query("COMMIT");
                return result.rows[0];
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error desactivando empleado: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.EmployeeService = EmployeeService;
