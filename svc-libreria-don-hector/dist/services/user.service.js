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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
const environment_1 = __importDefault(require("../config/environment"));
const roles_1 = require("../dictionaries/roles");
const { SUPERVISOR, EMPLEADO } = roles_1.ROLES;
class UserService {
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
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("service user", userData);
            try {
                yield client.query("BEGIN");
                const { nombre, apellido, correo_electronico, contrasena, id_rol, cui, edad, genero, telefono, fecha_ingreso, fotografia, fecha_baja, razon_baja, id_supervisor, } = userData;
                // Verificar si el usuario ya existe
                const existingUser = yield client.query("SELECT correo_electronico FROM Usuarios WHERE correo_electronico = $1", [correo_electronico]);
                if (existingUser.rows.length > 0) {
                    throw new Error("Ya existe un usuario con este correo electronico");
                }
                const hashedPassword = yield bcrypt_1.default.hash(contrasena, environment_1.default.PASSWORD.SALT_ROUNDS);
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
                const result = yield client.query(query, values);
                yield client.query("COMMIT");
                return result.rows;
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error creando usuario:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    validateUser(correo_electronico, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                // Obtener datos del usuario
                const query = `
        SELECT * FROM Usuarios 
        WHERE correo_electronico = $1
      `;
                const result = yield client.query(query, [correo_electronico]);
                const user = result.rows[0];
                if (!user) {
                    return null;
                }
                // Validar contraseña
                const isValid = yield bcrypt_1.default.compare(contrasena, user.contrasena);
                if (!isValid) {
                    return null;
                }
                let userDetails = Object.assign({}, user);
                delete userDetails.contrasena;
                if (user.id_cliente) {
                    const clienteQuery = `SELECT * FROM Clientes WHERE id_cliente = $1`;
                    const clienteResult = yield client.query(clienteQuery, [
                        user.id_cliente,
                    ]);
                    userDetails = Object.assign(Object.assign({}, userDetails), clienteResult.rows[0]);
                }
                else if (user.id_supervisor) {
                    const supervisorQuery = `SELECT * FROM Supervisor WHERE id_supervisor = $1`;
                    const supervisorResult = yield client.query(supervisorQuery, [
                        user.id_supervisor,
                    ]);
                    userDetails = Object.assign(Object.assign({}, userDetails), supervisorResult.rows[0]);
                }
                else if (user.id_empleado) {
                    const empleadoQuery = `SELECT * FROM Empleado WHERE id_empleado = $1`;
                    const empleadoResult = yield client.query(empleadoQuery, [
                        user.id_empleado,
                    ]);
                    userDetails = Object.assign(Object.assign({}, userDetails), empleadoResult.rows[0]);
                }
                // validando que usuario de tipo supervisor y empleado esten activos
                const ESTADO_INACTIVO = "0";
                if ((userDetails.id_rol === EMPLEADO || userDetails.id_rol === SUPERVISOR) &&
                    userDetails.estado === ESTADO_INACTIVO) {
                    throw new Error("El usuario no está activo");
                }
                return userDetails;
            }
            catch (error) {
                Logger_1.Logger.error("Error validating user:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getAllClients() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `
        SELECT * FROM Clientes
      `;
                const result = yield client.query(query);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error fetching clients:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.UserService = UserService;
