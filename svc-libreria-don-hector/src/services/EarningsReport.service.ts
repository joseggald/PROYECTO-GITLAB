import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class EarningsReportService {
  private getConnection(): Pool {
    try {
      const pool = dbManager.getConnection("postgres");
      if (!pool) {
        throw new Error("Database connection not initialized");
      }
      return pool;
    } catch (error) {
      Logger.error("Failed to get database connection:", error);
      throw new Error("Database connection error");
    }
  }


  public async getEarningsReport(): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

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
      const marginResult = await client.query(marginQuery);

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
      const periodResult = await client.query(periodQuery);

      const categoryQuery = `
        SELECT 
            p.categoria,
            SUM(df.cantidad * (p.precio_venta - p.precio_compra)) AS ganancia_por_categoria
        FROM Detalle_Factura df
        JOIN Producto p ON df.id_producto = p.id_producto
        GROUP BY p.categoria
        ORDER BY ganancia_por_categoria DESC;
      `;
      const categoryResult = await client.query(categoryQuery);

      await client.query("COMMIT");

      return {
        margen_ganancia: marginResult.rows,
        ganancias_por_periodo: periodResult.rows,
        ganancias_por_categoria: categoryResult.rows,
      };

    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error obteniendo el reporte de ganancias:", error);
      throw new Error("Error en la base de datos");
    } finally {
      client.release();
    }
  }


}
