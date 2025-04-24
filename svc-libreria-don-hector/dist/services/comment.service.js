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
exports.CommentService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class CommentService {
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
    hasPurchasedProduct(client, id_cliente, id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT df.id_producto 
            FROM Factura f
            JOIN Detalle_Factura df ON f.id_factura = df.id_factura
            WHERE f.id_cliente = $1 AND df.id_producto = $2
        `;
            const result = yield client.query(query, [id_cliente, id_producto]);
            return result.rows.length > 0;
        });
    }
    getByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                Logger_1.Logger.info("Comentario para el producto con id: ", productId);
                const query = `
                SELECT c.id_comentario, c.id_cliente, cl.nombre, cl.apellido, c.calificacion, 
                      c.comentario, c.fecha_resena 
                FROM Comentario c
                JOIN Clientes cl ON c.id_cliente = cl.id_cliente
                WHERE c.id_producto = $1
                ORDER BY c.fecha_resena DESC
            `;
                const result = yield client.query(query, [productId]);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error fetching comments:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    create(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                yield client.query("BEGIN");
                const { id_cliente, id_producto, calificacion, comentario } = commentData;
                const hasPurchased = yield this.hasPurchasedProduct(client, id_cliente, id_producto);
                if (!hasPurchased) {
                    throw new Error("Solo puedes comentar productos que has comprado.");
                }
                const query = `
            INSERT INTO Comentario (id_cliente, id_producto, calificacion, comentario)
            VALUES ($1, $2, $3, $4)
            RETURNING *
          `;
                const values = [id_cliente, id_producto, calificacion, comentario];
                const result = yield client.query(query, values);
                yield client.query("COMMIT");
                return result.rows[0];
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error creating comment:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    update(id_comentario, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                Logger_1.Logger.info(`Actualizar comentario ID: ${id_comentario}`);
                const { calificacion, comentario } = updateData;
                const query = `
            UPDATE Comentario
            SET calificacion = $1, comentario = $2, fecha_resena = CURRENT_DATE
            WHERE id_comentario = $3
            RETURNING *
          `;
                const values = [calificacion, comentario, id_comentario];
                const result = yield client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                Logger_1.Logger.error("Error :", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    delete(id_comentario) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                Logger_1.Logger.info(`Deleting comment ID: ${id_comentario}`);
                const query = `DELETE FROM Comentario WHERE id_comentario = $1`;
                yield client.query(query, [id_comentario]);
            }
            catch (error) {
                Logger_1.Logger.error("Error:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.CommentService = CommentService;
