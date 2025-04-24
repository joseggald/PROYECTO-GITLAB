import { serviceApi } from "@/services/auth";
import { Book } from "@/features/Books/types/books.types";

interface WishlistResponse {
  status: string;
  message: string;
  data: {
    wishlist: Book[];
  };
}

interface WishlistActionResponse {
  status: string;
  message: string;
}

export const wishlistService = {
  /**
   * Obtiene la lista de deseos del usuario
   */
  getWishlist: async (): Promise<Book[]> => {
    try {
      const { data } = await serviceApi.get<WishlistResponse>('/wishlist');
      return data.data?.wishlist || [];
    } catch (error) {
      console.error('Error al obtener lista de deseos:', error);
      return [];
    }
  },

  /**
   * Verifica si un libro está en la lista de deseos
   */
  isInWishlist: async (id_producto: number): Promise<boolean> => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist.some(book => book.id_producto === id_producto);
    } catch (error) {
      console.error('Error al verificar libro en wishlist:', error);
      return false;
    }
  },

  /**
   * Agrega un libro a la lista de deseos
   */
  addToWishlist: async (id_producto: number): Promise<void> => {
    await serviceApi.post<WishlistActionResponse>('/wishlist/add', { id_producto });
  },

  /**
   * Elimina un libro de la lista de deseos
   */
  removeFromWishlist: async (id_producto: number): Promise<void> => {
    await serviceApi.post<WishlistActionResponse>('/wishlist/remove', { id_producto });
  },

  /**
   * Toggle - Añade o elimina un libro de la lista de deseos según su estado actual
   */
  toggleWishlist: async (id_producto: number, currentlyInWishlist: boolean): Promise<boolean> => {
    try {
      if (currentlyInWishlist) {
        await wishlistService.removeFromWishlist(id_producto);
        return false;
      } else {
        await wishlistService.addToWishlist(id_producto);
        return true;
      }
    } catch (error) {
      console.error('Error al actualizar wishlist:', error);
      throw error;
    }
  }
};

export default wishlistService;