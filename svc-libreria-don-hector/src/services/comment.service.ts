import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class CommentService {
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
    
    private async hasPurchasedProduct(client: any, id_cliente: number, id_producto: number): Promise<boolean> {
        const query = `
            SELECT df.id_producto 
            FROM Factura f
            JOIN Detalle_Factura df ON f.id_factura = df.id_factura
            WHERE f.id_cliente = $1 AND df.id_producto = $2
        `;
        const result = await client.query(query, [id_cliente, id_producto]);
        return result.rows.length > 0;
    }


    public async getByProductId(productId: number): Promise<any> {  
        const pool = this.getConnection();
        const client = await pool.connect();
    
        try {
            Logger.info("Comentario para el producto con id: ", productId);
            const query = `
                SELECT c.id_comentario, c.id_cliente, cl.nombre, cl.apellido, c.calificacion, 
                      c.comentario, c.fecha_resena 
                FROM Comentario c
                JOIN Clientes cl ON c.id_cliente = cl.id_cliente
                WHERE c.id_producto = $1
                ORDER BY c.fecha_resena DESC
            `;
    

            const result = await client.query(query, [productId]);
            return result.rows;
        } catch (error) {
            Logger.error("Error fetching comments:", error);
            throw error;
        } finally {
            client.release();
        }
      }
      
      public async create(commentData: any): Promise<any> {
        const pool = this.getConnection();
        const client = await pool.connect();
    
        try {
          await client.query("BEGIN");
    
          const { id_cliente, id_producto, calificacion, comentario } = commentData;
    
          const hasPurchased = await this.hasPurchasedProduct(client, id_cliente, id_producto);
          if (!hasPurchased) {
            throw new Error("Solo puedes comentar productos que has comprado.");
          }
    
          const query = `
            INSERT INTO Comentario (id_cliente, id_producto, calificacion, comentario)
            VALUES ($1, $2, $3, $4)
            RETURNING *
          `;
    
          const values = [id_cliente, id_producto, calificacion, comentario];
          const result = await client.query(query, values);
          
          await client.query("COMMIT");
          return result.rows[0];
        } catch (error) {
          await client.query("ROLLBACK");
          Logger.error("Error creating comment:", error);
          throw error;
        } finally {
          client.release();
        }
      }

      public async update(id_comentario: number, updateData: any): Promise<any> {
        const pool = this.getConnection();
        const client = await pool.connect();
    
        try {
          Logger.info(`Actualizar comentario ID: ${id_comentario}`);
    
          const { calificacion, comentario } = updateData;
    
          const query = `
            UPDATE Comentario
            SET calificacion = $1, comentario = $2, fecha_resena = CURRENT_DATE
            WHERE id_comentario = $3
            RETURNING *
          `;
    
          const values = [calificacion, comentario, id_comentario];
          const result = await client.query(query, values);
          
          return result.rows[0];
        } catch (error) {
          Logger.error("Error :", error);
          throw error;
        } finally {
          client.release();
        }
      }
    

      public async delete(id_comentario: number): Promise<void> {
        const pool = this.getConnection();
        const client = await pool.connect();
    
        try {
          Logger.info(`Deleting comment ID: ${id_comentario}`);
    
          const query = `DELETE FROM Comentario WHERE id_comentario = $1`;
          await client.query(query, [id_comentario]);
        } catch (error) {
          Logger.error("Error:", error);
          throw error;
        } finally {
          client.release();
        }
      }
}