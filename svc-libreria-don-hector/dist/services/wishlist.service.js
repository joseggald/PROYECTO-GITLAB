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
exports.WishlistService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class WishlistService {
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
    addToWishlist(id_usuario, id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                yield client.query("BEGIN");
                const bookCheck = yield client.query("SELECT * FROM Producto WHERE id_producto = $1 AND es_libro = TRUE", [id_producto]);
                if (bookCheck.rows.length === 0) {
                    throw new Error("El producto no existe o no es un libro.");
                }
                let wishlist = yield client.query("SELECT id_lista_deseos FROM Lista_Deseos WHERE id_usuario = $1", [id_usuario]);
                let id_lista_deseos;
                if (wishlist.rows.length === 0) {
                    const result = yield client.query("INSERT INTO Lista_Deseos (id_usuario) VALUES ($1) RETURNING id_lista_deseos", [id_usuario]);
                    id_lista_deseos = result.rows[0].id_lista_deseos;
                }
                else {
                    id_lista_deseos = wishlist.rows[0].id_lista_deseos;
                }
                const existing = yield client.query("SELECT * FROM Detalle_Lista_Deseos WHERE id_lista_deseos = $1 AND id_producto = $2", [id_lista_deseos, id_producto]);
                if (existing.rows.length > 0) {
                    throw new Error("El libro ya está en la lista de deseos.");
                }
                yield client.query("INSERT INTO Detalle_Lista_Deseos (id_lista_deseos, id_producto) VALUES ($1, $2)", [id_lista_deseos, id_producto]);
                yield client.query("COMMIT");
                return { message: "Libro agregado a la lista de deseos." };
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error adding book to wishlist:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getWishlist(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `
        SELECT p.id_producto, p.nombre, p.autor, p.precio_venta, p.imagen 
        FROM Detalle_Lista_Deseos d
        JOIN Lista_Deseos l ON d.id_lista_deseos = l.id_lista_deseos
        JOIN Producto p ON d.id_producto = p.id_producto
        WHERE l.id_usuario = $1;
      `;
                const result = yield client.query(query, [id_usuario]);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error al obtener lista de deseos:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    removeFromWishlist(id_usuario, id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                yield client.query("BEGIN");
                const query = `
        DELETE FROM Detalle_Lista_Deseos
        WHERE id_lista_deseos = (
          SELECT id_lista_deseos FROM Lista_Deseos WHERE id_usuario = $1
        )
        AND id_producto = $2;
      `;
                yield client.query(query, [id_usuario, id_producto]);
                yield client.query("COMMIT");
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error al eliminar libro de lista de deseos:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.WishlistService = WishlistService;
