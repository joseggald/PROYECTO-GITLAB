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
exports.SupervisorService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class SupervisorService {
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
    getAllSupervisor() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const result = yield client.query('SELECT * FROM Supervisor');
                return result.rows;
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error modificando supervisor: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    updateSupervisor(supervisorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("employee: ", supervisorData);
            try {
                yield client.query("BEGIN");
                const { id_supervisor, correo_electronico, telefono } = supervisorData;
                const checkQuery = `
      SELECT 
        (CASE WHEN EXISTS (SELECT 1 FROM Supervisor WHERE id_supervisor = $1) THEN 1 ELSE 0 END) AS supervisor_existe,
        (CASE WHEN EXISTS (SELECT 1 FROM Supervisor WHERE telefono = $2 AND id_supervisor != $1) THEN 1 ELSE 0 END) AS telefono_existe,
        (CASE WHEN NOT EXISTS (SELECT 1 FROM Usuarios WHERE id_supervisor = $1) THEN 1 ELSE 0 END) AS supervisor_no_usuario,
        (CASE WHEN EXISTS (SELECT 1 FROM Usuarios WHERE correo_electronico = $3 AND id_supervisor != $1) THEN 1 ELSE 0 END) AS email_existe;
    `;
                const checkResult = yield client.query(checkQuery, [
                    id_supervisor,
                    telefono,
                    correo_electronico,
                ]);
                if (!checkResult.rows[0].supervisor_existe) {
                    throw new Error(`No existe ningún supervisor con el ID ${id_supervisor}`);
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
                const updatedSupervisor = yield client.query(updateSupervisorQuery, [
                    id_supervisor,
                    telefono,
                ]);
                const updatedUser = yield client.query(updateUserQuery, [
                    id_supervisor,
                    correo_electronico,
                ]);
                yield client.query("COMMIT");
                return {
                    supervisor: updatedSupervisor.rows[0],
                    usuario: updatedUser.rows[0],
                };
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error modificando supervisor: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    deactivateSupervisor(supervisorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("supervisor: ", supervisorData);
            try {
                yield client.query("BEGIN");
                const { id_supervisor, razon_baja, fecha_baja } = supervisorData;
                const existingSupervisor = yield client.query("SELECT 1 FROM Supervisor WHERE id_supervisor = $1", [id_supervisor]);
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
                const result = yield client.query(query, values);
                yield client.query("COMMIT");
                return result.rows[0];
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error desactivando supervisor: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    createSupervisor(supervisorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("supervisor: ", supervisorData);
            try {
                yield client.query("BEGIN");
                const { nombre, apellido, cui, edad, genero, telefono, fecha_ingreso, fecha_baja, razon_baja, } = supervisorData;
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
}
exports.SupervisorService = SupervisorService;
