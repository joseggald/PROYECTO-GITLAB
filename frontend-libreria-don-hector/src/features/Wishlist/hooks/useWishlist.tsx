import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Book } from '@/features/Books/types/books.types';
import { wishlistService } from '@/features/Wishlist/services/wishlist.service';
import { booksService } from '@/features/Books/services/books.service';
import { toast } from '@/hooks/Toast/use-toast';

export const WISHLIST_QUERY_KEYS = {
  all: ['wishlist'] as const,
  books: ['books'] as const,
};

export const useWishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);
  const queryClient = useQueryClient();
  
  const { 
    data: wishlistItems = [],
    isLoading: isLoadingWishlist,
    isError: isErrorWishlist,
    error: wishlistError,
    refetch: refetchWishlist
  } = useQuery({
    queryKey: WISHLIST_QUERY_KEYS.all,
    queryFn: () => wishlistService.getWishlist(),
    staleTime: 1000 * 60 * 5,
  });
  
  const { 
    data: allBooks = [],
    isLoading: isLoadingBooks,
    isError: isErrorBooks,
    error: booksError
  } = useQuery({
    queryKey: WISHLIST_QUERY_KEYS.books,
    queryFn: () => booksService.getAllBooks(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (wishlistItems.length > 0 && allBooks.length > 0) {
      const booksMap = new Map(allBooks.map(book => [book.id_producto, book]));
      
      const enrichedWishlistItems = wishlistItems.map(wishlistItem => {
        const completeBook = booksMap.get(wishlistItem.id_producto);
        
        if (completeBook) {
          return {
            ...completeBook,
            inWishlist: true
          };
        } else {
          return {
            ...wishlistItem,
            inWishlist: true,
            stock: wishlistItem.stock !== undefined ? wishlistItem.stock : 1,
            categoria: wishlistItem.categoria || 'General',
            descripcion: wishlistItem.descripcion || 'No hay descripción disponible',
            fecha_lanzamiento: wishlistItem.fecha_lanzamiento || new Date().toISOString(),
            es_libro: true
          };
        }
      });
      
      setWishlistBooks(enrichedWishlistItems);
    } else if (wishlistItems.length > 0) {
      const basicWishlistItems = wishlistItems.map(item => ({
        ...item,
        inWishlist: true,
        stock: item.stock !== undefined ? item.stock : 1,
        categoria: item.categoria || 'General',
        descripcion: item.descripcion || 'No hay descripción disponible',
        fecha_lanzamiento: item.fecha_lanzamiento || new Date().toISOString(),
        es_libro: true
      }));
      
      setWishlistBooks(basicWishlistItems);
    } else {
      setWishlistBooks([]);
    }
  }, [wishlistItems, allBooks]);

  const isLoading = isLoadingWishlist || isLoadingBooks;
  const isError = isErrorWishlist || isErrorBooks;
  const error = wishlistError || booksError;
  
  const removeFromWishlist = async (bookId: number) => {
    try {
      await wishlistService.removeFromWishlist(bookId);
      
      setWishlistBooks(prev => prev.filter(book => book.id_producto !== bookId));
      
      toast({
        title: "Eliminado de tu lista de deseos",
        description: "El libro se ha eliminado correctamente de tu lista de deseos",
        variant: "default",
      });
      
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEYS.all });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar de wishlist:', error);
      
      toast({
        title: "Error",
        description: "No se pudo eliminar el libro de tu lista de deseos",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    wishlistBooks,
    isLoading,
    isError,
    error,
    refetchWishlist,
    removeFromWishlist
  };
};

export default useWishlist;