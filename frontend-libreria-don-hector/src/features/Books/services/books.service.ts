import { serviceApi } from "@/services/auth";
import { Book, BookSearchFilters, BookSearchResponse } from "../types/books.types";

export const booksService = {
  searchBooks: async (filters: BookSearchFilters = {}): Promise<Book[]> => {
    try {
      const { data } = await serviceApi.post<BookSearchResponse>('/libros/search', filters);
      return data.data.books || [];
    } catch (error) {
      console.error('Error al buscar libros:', error);
      return [];
    }
  },
 
  getAllBooks: async (): Promise<Book[]> => {
    return booksService.searchBooks();
  },
};

export default booksService;