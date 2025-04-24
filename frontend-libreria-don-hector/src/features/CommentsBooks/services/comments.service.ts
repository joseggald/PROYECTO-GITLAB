import { serviceApi } from "@/services/auth";
import { ProductsResponse, CommentsResponse, Product, Comment } from "../types/comments.type";

export const commentsService = {
  /**
   * Obtiene todos los productos (libros)
   * @returns Lista de productos
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const { data } = await serviceApi.get<ProductsResponse>('/productos/Allproducts');
      return Array.isArray(data.data.products) ? data.data.products : [];
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  },

  /**
   * Obtiene los comentarios de un libro por su ID
   * @param id_producto ID del producto (libro)
   * @returns Lista de comentarios
   */
  getCommentsByProductId: async (id_producto: number): Promise<Comment[]> => {
    try {
      const { data } = await serviceApi.get<CommentsResponse>(`/comentarios/${id_producto}`);
      return data.data.comments;
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      return [];
    }
  },
};

export default commentsService;