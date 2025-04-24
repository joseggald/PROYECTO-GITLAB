import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class SalesReportService {
    private getConnection(): Pool {
        try {
            if (!dbManager) {
                throw new Error("Database manager not initialized");
            }

            const pool = dbManager.getConnection("postgres");

            if (!pool) {
                throw new Error("Database connection not initialized");
            }

            return pool;
        } catch (error: any) {
            Logger.error("Failed to get database connection:", error.message);
            throw new Error("Database connection error: " + error.message);
        }
    }

    // Generar reporte detallado de ventas con filtros opcionales
    public async getSalesReport(startDate?: string, endDate?: string, id_cliente?: number | null, id_empleado?: number | null): Promise<any> {
        const pool = this.getConnection();
        const client = await pool.connect();

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

            const params: any[] = [];

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

            const result = await client.query(query, params);
            return result.rows;

        } catch (error) {
            Logger.error("Error obteniendo reporte de ventas:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Obtener estadísticas generales para el dashboard
    public async getSalesDashboard(): Promise<any> {
        const pool = this.getConnection();
        const client = await pool.connect();

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

            const result = await client.query(query);
            return result.rows[0];

        } catch (error) {
            Logger.error("Error obteniendo datos del dashboard:", error);
            throw error;
        } finally {
            client.release();
        }
    }
}
