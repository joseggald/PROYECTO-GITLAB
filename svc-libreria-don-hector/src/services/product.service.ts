import { Pool } from 'pg';
import { dbManager } from '../config/database';
import { Logger } from '../utils/Logger';


export class ProductService {
    [x: string]: any;   
    private getConnection(): Pool {
        try {
            const pool = dbManager.getConnection('postgres');
            if (!pool) {
                throw new Error('Database connection not initialized');
            }
            return pool;
        } catch (error) {
            Logger.error('Failed to get database connection:', error);
            throw new Error('Database connection error');
        }
    }

    public async getAllProducts(): Promise<any> {
        const pool = this.getConnection();
        const client = await pool.connect();
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

            const result = await client.query(query);
            return result.rows;
        } catch (error: any) {
            Logger.error('Error fetching products:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    public async getProduct(filters: { id?: string; nombre?: string; categoria?: string }): Promise<any> {
      const pool = this.getConnection();
      const client = await pool.connect();
  
      try {
        const { id, nombre, categoria } = filters;
        let query = "SELECT * FROM Producto WHERE ";
        const values: any[] = [];
  
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
  
        const result = await client.query(query, values);
        return result.rows[0] || null;
      } catch (error) {
        Logger.error("Error consultando producto: ", error);
        throw error;
      } finally {
        client.release();
      }
    }

     public async addProduct(productData: any): Promise<any> {
      const pool = this.getConnection();
      const client = await pool.connect();

      try {
          const { nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento,stock_minimo } = productData;

          const query = `
              INSERT INTO Producto (
                  nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento,stock_minimo
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)
              RETURNING id_producto
          `;

          const values = [nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento,stock_minimo];

          const result = await client.query(query, values);
          return { id_producto: result.rows[0].id_producto, message: "Producto agregado correctamente" };

      } catch (error) {
          Logger.error("Error agregando producto:", error);
          throw error;
      } finally {
          client.release();
      }
  }

  public async updateProduct(id_producto: number, productData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
        const { nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento,stock_minimo } = productData;

        const query = `
            UPDATE Producto
            SET nombre = $1, descripcion = $2, codigo_producto = $3, categoria = $4, precio_compra = $5, 
                precio_venta = $6, stock = $7, imagen = $8, es_libro = $9, autor = $10, fecha_lanzamiento = $11, stock_minimo = $13
            WHERE id_producto = $12
            RETURNING id_producto
        `;

        const values = [nombre, descripcion, codigo_producto, categoria, precio_compra, precio_venta, stock, imagen, es_libro, autor, fecha_lanzamiento, id_producto,stock_minimo];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            throw new Error(`El producto con ID ${id_producto} no existe.`);
        }

        return { id_producto, message: "Producto actualizado correctamente" };

    } catch (error) {
        Logger.error("Error actualizando producto:", error);
        throw error;
    } finally {
        client.release();
    }
  }

  public async deleteProduct(id_producto: number): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
        // Verificar si el producto existe
        const checkQuery = `SELECT 1 FROM Producto WHERE id_producto = $1`;
        const checkResult = await client.query(checkQuery, [id_producto]);

        if (checkResult.rowCount === 0) {
            throw new Error(`El producto con ID ${id_producto} no existe.`);
        }

        // Eliminar el producto
        const deleteQuery = `DELETE FROM Producto WHERE id_producto = $1 RETURNING id_producto`;
        const deleteResult = await client.query(deleteQuery, [id_producto]);

        return { id_producto: deleteResult.rows[0].id_producto, message: "Producto eliminado correctamente" };

    } catch (error) {
        Logger.error("Error eliminando producto:", error);
        throw error;
    } finally {
        client.release();
    }
  }

  public async getTopRatedProducts(idCliente: number): Promise<any> {
    const pool = dbManager.getConnection("postgres");
    const client = await pool.connect();

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

        const result = await client.query(query, [idCliente]);
        return result.rows;
        } catch (error) {
            Logger.error("Error obteniendo productos más votados:", error);
            throw new Error("Error en la base de datos");
        } finally {
            client.release();
        }
    }

    public async updateMultipleProducts(products: any[]): Promise<any[]> {
        const pool = this.getConnection();
        const client = await pool.connect();
        const updatedProducts = [];
    
        try {
            await client.query('BEGIN');
    
            for (const product of products) {
                const {
                    id_producto,
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
                    stock_minimo
                } = product;
    
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
    
                const result = await client.query(query, values);
    
                if (result.rowCount === 0) {
                    Logger.warn(`Producto con ID ${id_producto} no encontrado.`);
                    continue; // Opcional: puedes lanzar un error o simplemente omitirlo
                }
    
                updatedProducts.push({
                    id_producto: result.rows[0].id_producto,
                    message: 'Producto actualizado correctamente'
                });
            }
    
            await client.query('COMMIT');
            return updatedProducts;
        } catch (error) {
            await client.query('ROLLBACK');
            Logger.error("Error actualizando múltiples productos:", error);
            throw new Error("Error al actualizar productos.");
        } finally {
            client.release();
        }
    }

    
}
