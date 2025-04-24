import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { booksService } from '../services/books.service';
import { BookSearchFilters, Book } from '../types/books.types';
import { wishlistService } from '@/features/Wishlist/services/wishlist.service';

export const BOOKS_QUERY_KEYS = {
  all: ['books'] as const,
  search: (filters: BookSearchFilters) => [...BOOKS_QUERY_KEYS.all, 'search', filters] as const,
  wishlist: ['wishlist'] as const,
};

export const useBooks = (initialFilters: BookSearchFilters = {}) => {
  const [filters, setFilters] = useState<BookSearchFilters>(initialFilters);
  const queryClient = useQueryClient();
  const [booksWithWishlist, setBooksWithWishlist] = useState<Book[]>([]);
  
  const { 
    data: wishlistBooks = [],
    isLoading: isLoadingWishlist,
    refetch: refetchWishlist
  } = useQuery({
    queryKey: BOOKS_QUERY_KEYS.wishlist,
    queryFn: () => wishlistService.getWishlist(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { 
    data: booksData = [],
    isLoading: isLoadingBooks,
    isError,
    error,
    refetch: refetchBooks
  } = useQuery({
    queryKey: BOOKS_QUERY_KEYS.search(filters),
    queryFn: () => booksService.searchBooks(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  useEffect(() => {
    if (booksData && wishlistBooks) {
      const wishlistIds = wishlistBooks.map(book => book.id_producto);
      
      const updatedBooks = booksData.map(book => ({
        ...book,
        inWishlist: wishlistIds.includes(book.id_producto)
      }));
      
      setBooksWithWishlist(updatedBooks);
    }
  }, [booksData, wishlistBooks]);

  const isLoading = isLoadingBooks || isLoadingWishlist;

  const updateFilters = (newFilters: Partial<BookSearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const refetch = () => {
    refetchBooks();
    refetchWishlist();
  };
  const toggleWishlistStatus = async (bookId: number, currentlyInWishlist: boolean) => {
    try {
      const newStatus = await wishlistService.toggleWishlist(bookId, currentlyInWishlist);
      
      queryClient.setQueryData(BOOKS_QUERY_KEYS.wishlist, (oldData: Book[] | undefined) => {
        if (!oldData) return [];
        
        if (newStatus) {
          const bookToAdd = booksData.find(b => b.id_producto === bookId);
          if (bookToAdd && !oldData.some(b => b.id_producto === bookId)) {
            return [...oldData, bookToAdd];
          }
        } else {
          return oldData.filter(b => b.id_producto !== bookId);
        }
        
        return oldData;
      });
      
      setBooksWithWishlist(prev => 
        prev.map(book => 
          book.id_producto === bookId 
            ? { ...book, inWishlist: newStatus } 
            : book
        )
      );
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.wishlist });
      }, 500);
      
      return newStatus;
    } catch (error) {
      console.error('Error al actualizar estado de wishlist:', error);
      throw error;
    }
  };

  return {
    books: booksWithWishlist,
    wishlistBooks,
    filters,
    isLoading,
    isError,
    error,
    updateFilters,
    clearFilters,
    refetch,
    toggleWishlistStatus
  };
};

export default useBooks;