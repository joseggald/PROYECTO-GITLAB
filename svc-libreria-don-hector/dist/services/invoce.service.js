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
exports.InvoiceService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class InvoiceService {
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
    createInvoice(invoiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            Logger_1.Logger.info("invoice data", invoiceData);
            try {
                yield client.query("BEGIN");
                const { fecha_emision, nombre_comprador, id_cliente, id_metodo_pago, total_venta, detalles, direccion_entrega, id_empleado } = invoiceData;
                if (!id_cliente && !id_empleado) {
                    throw new Error("Debe proporcionar al menos un id_cliente o un id_empleado.");
                }
                const invoiceQuery = `
         INSERT INTO Factura (
        fecha_emision, nombre_comprador, id_cliente, id_metodo_pago, total_venta, direccion_entrega,id_empleado
        ) VALUES ($1, $2, $3, $4, $5, $6,$7)
        RETURNING id_factura
      `;
                const invoiceValues = [fecha_emision, nombre_comprador, id_cliente || null, id_metodo_pago, total_venta, direccion_entrega, id_empleado || null];
                const invoiceResult = yield client.query(invoiceQuery, invoiceValues);
                const idFactura = invoiceResult.rows[0].id_factura;
                for (const detalle of detalles) {
                    const { id_producto, cantidad, precio_unitario } = detalle;
                    // **1️⃣ Verificar si hay suficiente stock**
                    const stockResult = yield client.query(`SELECT stock FROM Producto WHERE id_producto = $1`, [id_producto]);
                    if (stockResult.rowCount === 0) {
                        throw new Error(`El producto con ID ${id_producto} no existe.`);
                    }
                    const stockDisponible = stockResult.rows[0].stock;
                    if (stockDisponible < cantidad) {
                        throw new Error(`Stock insuficiente para el producto con ID ${id_producto}. Stock actual: ${stockDisponible}, requerido: ${cantidad}.`);
                    }
                    // **2️⃣ Insertar en `Detalle_Factura`**
                    const subtotal = cantidad * precio_unitario;
                    const detalleQuery = `
            INSERT INTO Detalle_Factura (
                id_factura, id_producto, cantidad, precio_unitario, subtotal
            ) VALUES ($1, $2, $3, $4, $5)
        `;
                    const detalleValues = [idFactura, id_producto, cantidad, precio_unitario, subtotal];
                    yield client.query(detalleQuery, detalleValues);
                    // **3️⃣ Rebajar el stock del producto**
                    const updateStockQuery = `
            UPDATE Producto
            SET stock = stock - $1
            WHERE id_producto = $2
        `;
                    yield client.query(updateStockQuery, [cantidad, id_producto]);
                }
                yield client.query("COMMIT");
                return { id_factura: idFactura };
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error creando factura y detalle_factura: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getInvoicesByUser(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `
        SELECT 
    f.id_factura, 
    f.fecha_emision, 
    f.nombre_comprador, 
    f.total_venta, 
    f.direccion_entrega, 
    c.id_cliente, 
    c.nombre AS cliente_nombre, 
    c.apellido AS cliente_apellido, 
    c.edad AS cliente_edad, 
    c.fecha_registro AS cliente_fecha_registro,

    e.id_empleado, 
    e.nombre AS empleado_nombre, 
    e.apellido AS empleado_apellido, 
    e.telefono AS empleado_telefono, 
    e.genero AS empleado_genero, 
    e.fecha_contratacion AS empleado_fecha_contratacion,
    mp.id_metodo_pago, 
    mp.tipo AS metodo_pago_tipo,

     COALESCE(
        json_agg(
            json_build_object(
                'id_producto', p.id_producto,
                'nombre', p.nombre,
                'descripcion', p.descripcion,
                'codigo_producto', p.codigo_producto,
                'categoria', p.categoria,
                'precio_compra', p.precio_compra,
                'precio_venta', p.precio_venta,
                'stock', p.stock,
                'imagen', p.imagen,
                'es_libro', p.es_libro,
                'autor', p.autor,
                'fecha_lanzamiento', p.fecha_lanzamiento,
                'cantidad', d.cantidad,
                'precio_unitario', d.precio_unitario,
                'subtotal', d.subtotal
              )
            ) FILTER (WHERE d.id_producto IS NOT NULL), '[]'
          ) AS detalles
    FROM Factura f
    LEFT JOIN Clientes c ON f.id_cliente = c.id_cliente
    LEFT JOIN Empleado e ON f.id_empleado = e.id_empleado
    LEFT JOIN Metodo_Pago mp ON f.id_metodo_pago = mp.id_metodo_pago
    LEFT JOIN Detalle_Factura d ON f.id_factura = d.id_factura
    LEFT JOIN Producto p ON d.id_producto = p.id_producto
    WHERE f.id_cliente = $1
    GROUP BY 
        f.id_factura, c.id_cliente, e.id_empleado, mp.id_metodo_pago;
    `;
                const result = yield client.query(query, [id_usuario]);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error listando facturas del usuario: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getInvoiceById(id_factura) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `
       SELECT 
    f.id_factura, 
    f.fecha_emision, 
    f.nombre_comprador, 
    f.total_venta, 
    f.direccion_entrega, 


    c.id_cliente, 
    c.nombre AS cliente_nombre, 
    c.apellido AS cliente_apellido, 
    c.edad AS cliente_edad, 
    c.fecha_registro AS cliente_fecha_registro,


    e.id_empleado, 
    e.nombre AS empleado_nombre, 
    e.apellido AS empleado_apellido, 
    e.telefono AS empleado_telefono, 
    e.genero AS empleado_genero, 
    e.fecha_contratacion AS empleado_fecha_contratacion,

    -- Información del Método de Pago
    mp.id_metodo_pago, 
    mp.tipo AS metodo_pago_tipo,

    COALESCE(
        json_agg(
            json_build_object(
                'id_producto', p.id_producto,
                'nombre', p.nombre,
                'descripcion', p.descripcion,
                'codigo_producto', p.codigo_producto,
                'categoria', p.categoria,
                'precio_compra', p.precio_compra,
                'precio_venta', p.precio_venta,
                'stock', p.stock,
                'imagen', p.imagen,
                'es_libro', p.es_libro,
                'autor', p.autor,
                'fecha_lanzamiento', p.fecha_lanzamiento,
                'cantidad', d.cantidad,
                'precio_unitario', d.precio_unitario,
                'subtotal', d.subtotal
            )
        ) FILTER (WHERE d.id_producto IS NOT NULL), '[]'
    ) AS detalles
    FROM Factura f
    LEFT JOIN Clientes c ON f.id_cliente = c.id_cliente
    LEFT JOIN Empleado e ON f.id_empleado = e.id_empleado
    LEFT JOIN Metodo_Pago mp ON f.id_metodo_pago = mp.id_metodo_pago
    LEFT JOIN Detalle_Factura d ON f.id_factura = d.id_factura
    LEFT JOIN Producto p ON d.id_producto = p.id_producto
    WHERE f.id_factura = $1
    GROUP BY 
        f.id_factura, c.id_cliente, e.id_empleado, mp.id_metodo_pago;
      `;
                const result = yield client.query(query, [id_factura]);
                return result.rows[0] || null;
            }
            catch (error) {
                Logger_1.Logger.error("Error consultando factura: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getPaymentMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `SELECT * FROM Metodo_Pago`;
                const result = yield client.query(query);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error consultando métodos de pago: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getAllInvoices() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `
          SELECT 
    f.id_factura, 
    f.fecha_emision, 
    f.nombre_comprador, 
    f.total_venta, 
    f.direccion_entrega, 

    c.id_cliente, 
    c.nombre AS cliente_nombre, 
    c.apellido AS cliente_apellido, 
    c.edad AS cliente_edad, 
    c.fecha_registro AS cliente_fecha_registro,


    e.id_empleado, 
    e.nombre AS empleado_nombre, 
    e.apellido AS empleado_apellido, 
    e.telefono AS empleado_telefono, 
    e.genero AS empleado_genero, 
    e.fecha_contratacion AS empleado_fecha_contratacion,

    -- Información del Método de Pago
    mp.id_metodo_pago, 
    mp.tipo AS metodo_pago_tipo,

    COALESCE(
    jsonb_agg(
        DISTINCT jsonb_build_object(
                'id_producto', p.id_producto,
                'nombre', p.nombre,
                'descripcion', p.descripcion,
                'codigo_producto', p.codigo_producto,
                'categoria', p.categoria,
                'precio_compra', p.precio_compra,
                'precio_venta', p.precio_venta,
                'stock', p.stock,
                'imagen', p.imagen,
                'es_libro', p.es_libro,
                'autor', p.autor,
                'fecha_lanzamiento', p.fecha_lanzamiento,
                'cantidad', d.cantidad,
                'precio_unitario', d.precio_unitario,
                'subtotal', d.subtotal
            )
        ) FILTER (WHERE d.id_producto IS NOT NULL), '[]'::jsonb
    ) AS detalles
    FROM Factura f
    LEFT JOIN Clientes c ON f.id_cliente = c.id_cliente
    LEFT JOIN Empleado e ON f.id_empleado = e.id_empleado
    LEFT JOIN Metodo_Pago mp ON f.id_metodo_pago = mp.id_metodo_pago
    LEFT JOIN Detalle_Factura d ON f.id_factura = d.id_factura
    LEFT JOIN Producto p ON d.id_producto = p.id_producto
    GROUP BY 
        f.id_factura, c.id_cliente, e.id_empleado, mp.id_metodo_pago;`;
                const result = yield client.query(query);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error consultando todas las facturas: ", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.InvoiceService = InvoiceService;
