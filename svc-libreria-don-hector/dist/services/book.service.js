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
exports.BookService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class BookService {
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
    searchBooks(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                let query = `SELECT * FROM Producto WHERE es_libro = TRUE`;
                const values = [];
                let index = 1;
                if (filters.titulo) {
                    query += ` AND LOWER(nombre) LIKE LOWER($${index})`;
                    values.push(`%${filters.titulo}%`);
                    index++;
                }
                if (filters.autor) {
                    query += ` AND LOWER(autor) LIKE LOWER($${index})`;
                    values.push(`%${filters.autor}%`);
                    index++;
                }
                if (filters.genero) {
                    query += ` AND LOWER(categoria) LIKE LOWER($${index})`;
                    values.push(`%${filters.genero}%`);
                    index++;
                }
                if (filters.precio_min) {
                    query += ` AND precio_venta >= $${index}`;
                    values.push(filters.precio_min);
                    index++;
                }
                if (filters.precio_max) {
                    query += ` AND precio_venta <= $${index}`;
                    values.push(filters.precio_max);
                    index++;
                }
                query += " ORDER BY nombre ASC";
                const result = yield client.query(query, values);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error fetching books:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    addBook(bookData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                yield client.query("BEGIN");
                const { nombre, autor, codigo_producto, fecha_lanzamiento, descripcion, categoria, stock, precio_compra, precio_venta } = bookData;
                const query = `
        INSERT INTO Producto (
          nombre, codigo_producto, descripcion, categoria, 
          precio_compra, precio_venta, stock, es_libro, 
          autor, fecha_lanzamiento
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8, $9)
        RETURNING *
      `;
                const values = [
                    nombre, codigo_producto, descripcion, categoria,
                    precio_compra, precio_venta, stock,
                    autor, fecha_lanzamiento
                ];
                const result = yield client.query(query, values);
                yield client.query("COMMIT");
                return result.rows[0];
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error adding book:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    updateBook(id_producto, bookData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                yield client.query("BEGIN");
                const bookCheck = yield client.query("SELECT * FROM Producto WHERE id_producto = $1 AND es_libro = TRUE", [id_producto]);
                if (bookCheck.rows.length === 0) {
                    throw new Error("El producto no existe o no es un libro.");
                }
                const { nombre, autor, fecha_lanzamiento, descripcion, categoria, stock, precio_compra, precio_venta, imagen } = bookData;
                const query = `
            UPDATE Producto 
            SET 
                nombre = COALESCE($1, nombre),
                descripcion = COALESCE($2, descripcion),
                categoria = COALESCE($3, categoria),
                precio_compra = COALESCE($4, precio_compra),
                precio_venta = COALESCE($5, precio_venta),
                stock = COALESCE($6, stock),
                autor = COALESCE($7, autor),
                fecha_lanzamiento = COALESCE($8, fecha_lanzamiento),
                imagen = COALESCE($9, imagen)
            WHERE id_producto = $10 AND es_libro = TRUE
            RETURNING *;
        `;
                const values = [
                    nombre, descripcion, categoria, precio_compra, precio_venta, stock, autor, fecha_lanzamiento, imagen, id_producto
                ];
                const result = yield client.query(query, values);
                yield client.query("COMMIT");
                return result.rows[0];
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error updating book:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    deleteBook(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                yield client.query("BEGIN");
                const bookCheck = yield client.query("SELECT * FROM Producto WHERE id_producto = $1 AND es_libro = TRUE", [id_producto]);
                if (bookCheck.rows.length === 0) {
                    throw new Error("El producto no existe o no es un libro.");
                }
                yield client.query(`DELETE FROM Detalle_Lista_Deseos WHERE id_producto = $1`, [id_producto]);
                yield client.query(`DELETE FROM Producto WHERE id_producto = $1`, [id_producto]);
                yield client.query("COMMIT");
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error deleting book:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.BookService = BookService;
