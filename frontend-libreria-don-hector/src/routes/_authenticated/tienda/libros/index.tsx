import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { BookFilters, BookGrid, BookDetails } from '@/features/Books';
import { useBooks } from '@/features/Books/hooks';
import { Book } from '@/features/Books/types/books.types';
import { toast } from '@/hooks/Toast/use-toast';
import { Book as BookIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import FloatingCart from '@/components/ShoppingCart/components/FloatingCart';
import AddToCartButton from '@/components/ShoppingCart/components/AddToCartButton';

export const Route = createFileRoute('/_authenticated/tienda/libros/')({
  component: BooksPage,
});

function BooksPage() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const {
    books,
    filters,
    isLoading,
    isError,
    updateFilters,
    clearFilters,
    toggleWishlistStatus
  } = useBooks();

  const handleToggleWishlist = async (bookId: number, currentlyInWishlist: boolean) => {
    try {
      const newStatus = await toggleWishlistStatus(bookId, currentlyInWishlist);
      
      if (selectedBook && selectedBook.id_producto === bookId) {
        setSelectedBook({
          ...selectedBook,
          inWishlist: newStatus
        });
      }
      
      return newStatus;
    } catch (error) {
      console.error('Error al actualizar wishlist:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista de favoritos",
        variant: "destructive",
      });
      return currentlyInWishlist;
    }
  };

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };
  
  const handleCheckoutSuccess = (invoiceId: number) => {
    toast({
      title: "¡Compra exitosa!",
      description: `Tu pedido #${invoiceId} ha sido procesado correctamente`,
    });
    
    setTimeout(() => {
      navigate({ to: '/tienda/mis-compras' });
    }, 2000);
  };

  const renderBookFooter = (book: Book) => (
    <div className="mt-3 flex gap-2 w-full">
      <AddToCartButton
        product={book}
        fullWidth
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <BookIcon className="h-10 w-10" />
            Descubre Nuestros Libros
          </h1>
          <p className="mt-2 text-yellow-100 max-w-2xl">
            Explora nuestra extensa colección de libros y descubre nuevas historias, 
            conocimientos y aventuras para satisfacer tu pasión por la lectura.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <BookFilters 
            filters={filters} 
            onUpdateFilters={updateFilters} 
            onClearFilters={clearFilters} 
          />
        </div>
        
        <BookGrid 
          books={books} 
          isLoading={isLoading} 
          isError={isError}
          onToggleWishlist={handleToggleWishlist}
          onViewDetails={handleViewDetails}
          renderItemFooter={renderBookFooter}
        />
        
        {selectedBook && (
          <BookDetails 
            book={selectedBook} 
            isOpen={isDetailsOpen} 
            onClose={handleCloseDetails}
            onToggleWishlist={handleToggleWishlist}
            footer={
              <AddToCartButton 
                product={selectedBook} 
                showQuantity 
                fullWidth 
                className="mt-4"
              />
            }
          />
        )}
      </div>
      
      <FloatingCart 
        onCheckoutSuccess={handleCheckoutSuccess}
        position="bottom-right"
      />
    </div>
  );
}

export default BooksPage;