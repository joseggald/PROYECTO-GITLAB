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
exports.SalesReportService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class SalesReportService {
    getConnection() {
        try {
            if (!database_1.dbManager) {
                throw new Error("Database manager not initialized");
            }
            const pool = database_1.dbManager.getConnection("postgres");
            if (!pool) {
                throw new Error("Database connection not initialized");
            }
            return pool;
        }
        catch (error) {
            Logger_1.Logger.error("Failed to get database connection:", error.message);
            throw new Error("Database connection error: " + error.message);
        }
    }
    // Generar reporte detallado de ventas con filtros opcionales
    getSalesReport(startDate, endDate, id_cliente, id_empleado) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                let query = `
                SELECT 
                    f.id_factura,
                    f.fecha_emision,
                    f.nombre_comprador,
                    c.id_cliente,
                    c.nombre AS cliente_nombre,
                    c.apellido AS cliente_apellido,
                    e.id_empleado,
                    e.nombre AS empleado_nombre,
                    e.apellido AS empleado_apellido,
                    f.total_venta,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id_producto', p.id_producto,
                                'nombre', p.nombre,
                                'categoria', p.categoria,
                                'cantidad', d.cantidad,
                                'precio_unitario', d.precio_unitario,
                                'subtotal', d.subtotal
                            )
                        ) FILTER (WHERE d.id_producto IS NOT NULL), '[]'
                    ) AS detalles
                FROM Factura f
                LEFT JOIN Clientes c ON f.id_cliente = c.id_cliente
                LEFT JOIN Empleado e ON f.id_empleado = e.id_empleado
                LEFT JOIN Detalle_Factura d ON f.id_factura = d.id_factura
                LEFT JOIN Producto p ON d.id_producto = p.id_producto
                WHERE 1=1
            `;
                const params = [];
                if (startDate) {
                    params.push(startDate);
                    query += ` AND f.fecha_emision >= $${params.length}`;
                }
                if (endDate) {
                    params.push(endDate);
                    query += ` AND f.fecha_emision <= $${params.length}`;
                }
                if (id_cliente) {
                    params.push(id_cliente);
                    query += ` AND f.id_cliente = $${params.length}`;
                }
                if (id_empleado) {
                    params.push(id_empleado);
                    query += ` AND f.id_empleado = $${params.length}`;
                }
                query += ` GROUP BY f.id_factura, c.id_cliente, e.id_empleado`;
                const result = yield client.query(query, params);
                return result.rows;
            }
            catch (error) {
                Logger_1.Logger.error("Error obteniendo reporte de ventas:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Obtener estadísticas generales para el dashboard
    getSalesDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                const query = `
                WITH productos_vendidos AS (
                SELECT 
                    p.id_producto, 
                    p.nombre, 
                    SUM(d.cantidad) AS total_vendido
                FROM Detalle_Factura d
                JOIN Producto p ON d.id_producto = p.id_producto
                GROUP BY p.id_producto
            )
            SELECT 
                COUNT(DISTINCT f.id_factura) AS total_ventas,
                SUM(f.total_venta) AS ingresos_totales,
                COUNT(DISTINCT c.id_cliente) AS clientes_que_compraron,
                SUM(d.cantidad) AS productos_vendidos,
                (SELECT COUNT(*) FROM Clientes) AS total_clientes,
                (SELECT COUNT(*) FROM Producto) AS total_productos,
                json_agg(
                    json_build_object(
                        'id_producto', pv.id_producto,
                        'nombre', pv.nombre,
                        'total_vendido', pv.total_vendido
                    )
                ) AS productos_mas_vendidos
            FROM Factura f
            LEFT JOIN Clientes c ON f.id_cliente = c.id_cliente
            LEFT JOIN Detalle_Factura d ON f.id_factura = d.id_factura
            LEFT JOIN productos_vendidos pv ON d.id_producto = pv.id_producto
            GROUP BY f.id_factura;
            `;
                const result = yield client.query(query);
                return result.rows[0];
            }
            catch (error) {
                Logger_1.Logger.error("Error obteniendo datos del dashboard:", error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.SalesReportService = SalesReportService;
