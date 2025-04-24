import React from 'react';
import { Book } from '../types/books.types';
import BookCard from './BookCard';
import { LoadingOverlay } from '@/components/Loader/Loader';

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
  isError: boolean;
  onToggleWishlist?: (bookId: number, currentStatus: boolean) => Promise<boolean>;
  onViewDetails?: (book: Book) => void;
  renderItemFooter?: (book: Book) => React.ReactNode;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  isLoading,
  isError,
  onToggleWishlist,
  onViewDetails,
  renderItemFooter
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingOverlay/>
        <p className="mt-4 text-gray-600">Cargando libros...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Error al cargar los libros</h3>
        <p className="mt-2 text-gray-600">
          Lo sentimos, ha ocurrido un error al cargar los libros. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="bg-yellow-100 text-yellow-800 rounded-full p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No se encontraron libros</h3>
        <p className="mt-2 text-gray-600">
          No hay libros que coincidan con los criterios de búsqueda.
          Prueba con otros filtros o explora nuestro catálogo completo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book.id_producto} className="flex flex-col h-full">
          <BookCard
            book={book}
            onToggleWishlist={onToggleWishlist}
            onViewDetails={onViewDetails}
          />
          {renderItemFooter && renderItemFooter(book)}
        </div>
      ))}
    </div>
  );
};

export default BookGrid;