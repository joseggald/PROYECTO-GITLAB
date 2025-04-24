import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class InvoiceService {
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

  public async createInvoice(invoiceData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("invoice data", invoiceData);

    try {
      await client.query("BEGIN");
      
      const { fecha_emision, nombre_comprador, id_cliente, id_metodo_pago, total_venta, detalles,direccion_entrega,id_empleado } = invoiceData;

      if (!id_cliente && !id_empleado) {
        throw new Error("Debe proporcionar al menos un id_cliente o un id_empleado.");
    }
      
      const invoiceQuery = `
         INSERT INTO Factura (
        fecha_emision, nombre_comprador, id_cliente, id_metodo_pago, total_venta, direccion_entrega,id_empleado
        ) VALUES ($1, $2, $3, $4, $5, $6,$7)
        RETURNING id_factura
      `;


      const invoiceValues = [fecha_emision, nombre_comprador, id_cliente || null, id_metodo_pago, total_venta,direccion_entrega,id_empleado || null];
      const invoiceResult = await client.query(invoiceQuery, invoiceValues);
      const idFactura = invoiceResult.rows[0].id_factura;

      for (const detalle of detalles) {
        const { id_producto, cantidad, precio_unitario } = detalle;

        // **1️⃣ Verificar si hay suficiente stock**
        const stockResult = await client.query(
            `SELECT stock FROM Producto WHERE id_producto = $1`,
            [id_producto]
        );

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
        await client.query(detalleQuery, detalleValues);

        // **3️⃣ Rebajar el stock del producto**
        const updateStockQuery = `
            UPDATE Producto
            SET stock = stock - $1
            WHERE id_producto = $2
        `;
        await client.query(updateStockQuery, [cantidad, id_producto]);
    }


      await client.query("COMMIT");

      return { id_factura: idFactura };
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error creando factura y detalle_factura: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getInvoicesByUser(id_usuario: string): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

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
      const result = await client.query(query, [id_usuario]);
      return result.rows;
    } catch (error) {
      Logger.error("Error listando facturas del usuario: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getInvoiceById(id_factura: string): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

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
      const result = await client.query(query, [id_factura]);
      return result.rows[0] || null;
    } catch (error) {
      Logger.error("Error consultando factura: ", error);
      throw error;
    } finally {
      client.release();
    }
  } 
  
  public async getPaymentMethods(): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      const query = `SELECT * FROM Metodo_Pago`;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      Logger.error("Error consultando métodos de pago: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getAllInvoices(): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

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
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      Logger.error("Error consultando todas las facturas: ", error);
      throw error;
    } finally {
      client.release();
    }
  }


}
