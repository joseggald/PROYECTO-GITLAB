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
exports.ProductService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class ProductService {
    getConnection() {
        try {
            const pool = database_1.dbManager.getConnection('postgres');
            if (!pool) {
                throw new Error('Database connection not initialized');
            }
            return pool;
        }
        catch (error) {
            Logger_1.Logger.error('Failed to get database connection:', error);
            throw new Error('Database connection error');
        }
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `
                SELECT 
                p.id_producto,
                p.nombre,
                p.codigo_producto,
                p.descripcion,
                p.categoria,
                p.precio_compra,
                p.precio_venta,
                p.imagen,
                p.stock,
                p.es_libro,
                p.autor,
                p.fecha_lanzamiento,
                p.stock_minimo
                FROM Producto p;
            `;
                const result = yield client.query(query);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error('Error fetching products:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getProduct(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const { id, nombre, categoria } = filters;
                let query = "SELECT * FROM Producto WHERE ";
                const values = [];
                if (id) {
                    query += "id_producto = $" + (values.length + 1);
                    values.push(id);
                }
                if (nombre) {
                    query += "nombre ILIKE $" + (values.length + 1);
                    values.push(`%${nombre}%`);
                }
                if (categoria) {
                    query += "categoria ILIKE $" + (values.length + 1);
                    values.push(`%${categoria}%`);
                }
                const result = yield client.query(query, values);
                return result.rows[0] || null;
            }
            catch (error) {
                Logger_1.Logger.error("Error consultando producto: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    addProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const { nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento, stock_minimo } = productData;
                const query = `
              INSERT INTO Producto (
                  nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento,stock_minimo
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)
              RETURNING id_producto
          `;
                const values = [nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento, stock_minimo];
                const result = yield client.query(query, values);
                return { id_producto: result.rows[0].id_producto, message: "Producto agregado correctamente" };
            }
            catch (error) {
                Logger_1.Logger.error("Error agregando producto:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    updateProduct(id_producto, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const { nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento, stock_minimo } = productData;
                const query = `
            UPDATE Producto
            SET nombre = $1, descripcion = $2, codigo_producto = $3, categoria = $4, precio_compra = $5, 
                precio_venta = $6, stock = $7, imagen = $8, es_libro = $9, autor = $10, fecha_lanzamiento = $11, stock_minimo = $13
            WHERE id_producto = $12
            RETURNING id_producto
        `;
                const values = [nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento, id_producto, stock_minimo];
                const result = yield client.query(query, values);
                if (result.rowCount === 0) {
                    throw new Error(`El producto con ID ${id_producto} no existe.`);
                }
                return { id_producto, message: "Producto actualizado correctamente" };
            }
            catch (error) {
                Logger_1.Logger.error("Error actualizando producto:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    deleteProduct(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                // Verificar si el producto existe
                const checkQuery = `SELECT 1 FROM Producto WHERE id_producto = $1`;
                const checkResult = yield client.query(checkQuery, [id_producto]);
                if (checkResult.rowCount === 0) {
                    throw new Error(`El producto con ID ${id_producto} no existe.`);
                }
                // Eliminar el producto
                const deleteQuery = `DELETE FROM Producto WHERE id_producto = $1 RETURNING id_producto`;
                const deleteResult = yield client.query(deleteQuery, [id_producto]);
                return { id_producto: deleteResult.rows[0].id_producto, message: "Producto eliminado correctamente" };
            }
            catch (error) {
                Logger_1.Logger.error("Error eliminando producto:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getTopRatedProducts(idCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = database_1.dbManager.getConnection("postgres");
            const client = yield pool.connect();
            try {
                const query = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.categoria,
                p.precio_venta,
                p.imagen,
                COALESCE(AVG(c.calificacion), 0) AS calificacion_promedio,
                EXISTS (
                    SELECT 1 FROM Detalle_Lista_Deseos dld
                    JOIN Lista_Deseos ld ON dld.id_lista_deseos = ld.id_lista_deseos
                    WHERE ld.id_usuario = (SELECT id_usuario FROM Usuarios WHERE id_cliente = $1) 
                    AND dld.id_producto = p.id_producto
                ) AS en_wishlist,
                EXISTS (
                    SELECT 1 FROM Factura f
                    JOIN Detalle_Factura df ON f.id_factura = df.id_factura
                    WHERE f.id_cliente = $1 AND df.id_producto = p.id_producto
                    ) AS comprado
                FROM Producto p
                LEFT JOIN Comentario c ON p.id_producto = c.id_producto
                WHERE p.es_libro = TRUE
                GROUP BY p.id_producto
                ORDER BY calificacion_promedio DESC;
        `;
                const result = yield client.query(query, [idCliente]);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error obteniendo productos más votados:", error);
                throw new Error("Error en la base de datos");
            }
            finally {
                client.release();
            }
        });
    }
    updateMultipleProducts(products) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            const updatedProducts = [];
            try {
                yield client.query('BEGIN');
                for (const product of products) {
                    const { id_producto, nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento, stock_minimo } = product;
                    const query = `
                    UPDATE Producto
                    SET nombre = $1,
                        descripcion = $2,
                        codigo_producto = $3,
                        categoria = $4,
                        precio_compra = $5,
                        precio_venta = $6,
                        stock = $7,
                        imagen = $8,
                        es_libro = $9,
                        autor = $10,
                        fecha_lanzamiento = $11,
                        stock_minimo = $12
                    WHERE id_producto = $13
                    RETURNING id_producto
                `;
                    const values = [
                        nombre,
                        descripcion,
                        codigo_producto,
                        categoria,
                        precio_compra,
                        precio_venta,
                        stock,
                        imagen,
                        es_libro,
                        autor,
                        fecha_lanzamiento,
                        stock_minimo,
                        id_producto
                    ];
                    const result = yield client.query(query, values);
                    if (result.rowCount === 0) {
                        Logger_1.Logger.warn(`Producto con ID ${id_producto} no encontrado.`);
                        continue; // Opcional: puedes lanzar un error o simplemente omitirlo
                    }
                    updatedProducts.push({
                        id_producto: result.rows[0].id_producto,
                        message: 'Producto actualizado correctamente'
                    });
                }
                yield client.query('COMMIT');
                return updatedProducts;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                Logger_1.Logger.error("Error actualizando múltiples productos:", error);
                throw new Error("Error al actualizar productos.");
            }
            finally {
                client.release();
            }
        });
    }
}
exports.ProductService = ProductService;
