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
exports.EarningsReportService = void 0;
const database_1 = require("../config/database");
const Logger_1 = require("../utils/Logger");
class EarningsReportService {
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
    getEarningsReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.getConnection();
            const client = yield pool.connect();
            try {
                yield client.query("BEGIN");
                const marginQuery = `
        SELECT 
            p.id_producto,
            p.nombre,
            p.categoria,
            SUM(df.cantidad * (p.precio_venta - p.precio_compra)) AS margen_ganancia
        FROM Detalle_Factura df
        JOIN Producto p ON df.id_producto = p.id_producto
        GROUP BY p.id_producto, p.nombre, p.categoria
        ORDER BY margen_ganancia DESC;
      `;
                const marginResult = yield client.query(marginQuery);
                const periodQuery = `
        SELECT 
            DATE_TRUNC('month', f.fecha_emision) AS periodo,
            SUM(df.cantidad * (p.precio_venta - p.precio_compra)) AS ganancia_total
        FROM Factura f
        JOIN Detalle_Factura df ON f.id_factura = df.id_factura
        JOIN Producto p ON df.id_producto = p.id_producto
        GROUP BY periodo
        ORDER BY periodo;
      `;
                const periodResult = yield client.query(periodQuery);
                const categoryQuery = `
        SELECT 
            p.categoria,
            SUM(df.cantidad * (p.precio_venta - p.precio_compra)) AS ganancia_por_categoria
        FROM Detalle_Factura df
        JOIN Producto p ON df.id_producto = p.id_producto
        GROUP BY p.categoria
        ORDER BY ganancia_por_categoria DESC;
      `;
                const categoryResult = yield client.query(categoryQuery);
                yield client.query("COMMIT");
                return {
                    margen_ganancia: marginResult.rows,
                    ganancias_por_periodo: periodResult.rows,
                    ganancias_por_categoria: categoryResult.rows,
                };
            }
            catch (error) {
                yield client.query("ROLLBACK");
                Logger_1.Logger.error("Error obteniendo el reporte de ganancias:", error);
                throw new Error("Error en la base de datos");
            }
            finally {
                client.release();
            }
        });
    }
}
exports.EarningsReportService = EarningsReportService;
