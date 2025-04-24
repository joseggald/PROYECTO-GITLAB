import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class WishlistService {
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

  public async addToWishlist(id_usuario: number, id_producto: number): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const bookCheck = await client.query(
        "SELECT * FROM Producto WHERE id_producto = $1 AND es_libro = TRUE",
        [id_producto]
      );

      if (bookCheck.rows.length === 0) {
        throw new Error("El producto no existe o no es un libro.");
      }

      let wishlist = await client.query(
        "SELECT id_lista_deseos FROM Lista_Deseos WHERE id_usuario = $1",
        [id_usuario]
      );

      let id_lista_deseos;

      if (wishlist.rows.length === 0) {
        const result = await client.query(
          "INSERT INTO Lista_Deseos (id_usuario) VALUES ($1) RETURNING id_lista_deseos",
          [id_usuario]
        );
        id_lista_deseos = result.rows[0].id_lista_deseos;
      } else {
        id_lista_deseos = wishlist.rows[0].id_lista_deseos;
      }

      const existing = await client.query(
        "SELECT * FROM Detalle_Lista_Deseos WHERE id_lista_deseos = $1 AND id_producto = $2",
        [id_lista_deseos, id_producto]
      );

      if (existing.rows.length > 0) {
        throw new Error("El libro ya está en la lista de deseos.");
      }

      await client.query(
        "INSERT INTO Detalle_Lista_Deseos (id_lista_deseos, id_producto) VALUES ($1, $2)",
        [id_lista_deseos, id_producto]
      );

      await client.query("COMMIT");
      return { message: "Libro agregado a la lista de deseos." };
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error adding book to wishlist:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getWishlist(id_usuario: number): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      const query = `
        SELECT p.id_producto, p.nombre, p.autor, p.precio_venta, p.imagen 
        FROM Detalle_Lista_Deseos d
        JOIN Lista_Deseos l ON d.id_lista_deseos = l.id_lista_deseos
        JOIN Producto p ON d.id_producto = p.id_producto
        WHERE l.id_usuario = $1;
      `;

      const result = await client.query(query, [id_usuario]);
      return result.rows;
    } catch (error) {
      Logger.error("Error al obtener lista de deseos:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async removeFromWishlist(id_usuario: number, id_producto: number): Promise<void> {
    const pool = this.getConnection();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const query = `
        DELETE FROM Detalle_Lista_Deseos
        WHERE id_lista_deseos = (
          SELECT id_lista_deseos FROM Lista_Deseos WHERE id_usuario = $1
        )
        AND id_producto = $2;
      `;

      await client.query(query, [id_usuario, id_producto]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error al eliminar libro de lista de deseos:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
