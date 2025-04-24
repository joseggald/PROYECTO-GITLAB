import { serviceApi } from '@/services/auth';

export interface CommentData {
  id_cliente: number;
  id_producto: number;
  calificacion: number;
  comentario: string;
}

export interface CommentUpdateData {
  calificacion: number;
  comentario: string;
}

export const commentService = {
  /**
   * Obtiene todos los comentarios para un producto específico
   * @param productId ID del producto
   * @returns Lista de comentarios
   */
  getByProductId: async (productId: number) => {
    try {
      const { data } = await serviceApi.get(`/comentarios/${productId}`);
      return data.data.comments || [];
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo comentario
   * @param commentData Datos del comentario a crear
   * @returns El comentario creado
   */
  create: async (commentData: CommentData) => {
    try {
      const { data } = await serviceApi.post('/comentarios', commentData);
      return data.data.comment;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  },

  /**
   * Actualiza un comentario existente
   * @param commentId ID del comentario a actualizar
   * @param updateData Datos actualizados del comentario
   * @returns El comentario actualizado
   */
  update: async (commentId: number, updateData: CommentUpdateData) => {
    try {
      const { data } = await serviceApi.put(`/comentarios/${commentId}`, updateData);
      return data.data.updatedComment;
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      throw error;
    }
  },

  /**
   * Elimina un comentario
   * @param commentId ID del comentario a eliminar
   * @returns true si se eliminó correctamente
   */
  delete: async (commentId: number) => {
    try {
      await serviceApi.delete(`/comentarios/${commentId}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
  },

  /**
   * Obtiene las reseñas escritas por el usuario actual
   * @returns Lista de reseñas del usuario
   */
  getUserReviews: async () => {
    try {
      const { data } = await serviceApi.get('/comentarios/user-reviews');
      return data.data.reviews || [];
    } catch (error) {
      console.error('Error al obtener reseñas del usuario:', error);
      throw error;
    }
  },

  /**
   * Verifica si el usuario ya ha comentado un producto
   * @param productId ID del producto
   * @returns true si el usuario ya comentó el producto
   */
  userHasReviewed: async (productId: number) => {
    try {
      const { data } = await serviceApi.get(`/comentarios/check/${productId}`);
      return data.data.hasReviewed || false;
    } catch (error) {
      console.error('Error al verificar si el usuario ha comentado:', error);
      return false;
    }
  }
};

export default commentService;