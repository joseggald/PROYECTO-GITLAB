import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { BookDetails } from '@/features/Books';
import { Book } from '@/features/Books/types/books.types';
import { toast } from '@/hooks/Toast/use-toast';
import { useWishlist } from '../hooks/useWishlist';
import WishlistItem from './WishlistItem';
import { HeartOff, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/Loader/Loader';
import { useNavigate } from '@tanstack/react-router';

import FloatingCart from '@/components/ShoppingCart/components/FloatingCart';
import AddToCartButton from '@/components/ShoppingCart/components/AddToCartButton';

export const Route = createFileRoute('/_authenticated/tienda/lista-de-deseos/')({
  component: WishlistPage,
});

function WishlistPage() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const {
    wishlistBooks,
    isLoading,
    isError,
    removeFromWishlist
  } = useWishlist();

  const handleToggleWishlist = async (bookId: number, currentlyInWishlist: boolean) => {
    try {
      if (currentlyInWishlist) {
        await removeFromWishlist(bookId);
        
        if (selectedBook && selectedBook.id_producto === bookId) {
          setSelectedBook({
            ...selectedBook,
            inWishlist: false
          });
        }
        
        return false;
      }
      return currentlyInWishlist;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <HeartOff className="h-10 w-10" />
            Mi Lista de Deseos
          </h1>
          <p className="mt-2 text-yellow-100 max-w-2xl">
            Aquí encontrarás todos los libros que has guardado en tu lista de favoritos.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingOverlay/>
            <p className="mt-4 text-gray-600">Cargando tu lista de deseos...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Error al cargar tu lista de deseos</h3>
            <p className="mt-2 text-gray-600">
              Lo sentimos, ha ocurrido un error al cargar tu lista de deseos. Por favor, intenta nuevamente más tarde.
            </p>
          </div>
        ) : wishlistBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="bg-yellow-100 text-yellow-800 rounded-full p-3 mb-4">
              <HeartOff className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Tu lista de deseos está vacía</h3>
            <p className="mt-2 text-gray-600">
              No tienes libros guardados en tu lista de deseos.
              Explora nuestro catálogo y añade los libros que te gusten.
            </p>
            <Button 
              className="mt-4 bg-yellow-700 hover:bg-yellow-800 text-white"
              onClick={() => navigate({ to: '/tienda/libros' })}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Explorar Librería
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {wishlistBooks.map((book) => (
              <WishlistItem
                key={book.id_producto}
                book={book}
                onRemoveFromWishlist={() => handleToggleWishlist(book.id_producto, true)}
                onViewDetails={() => handleViewDetails(book)}
              />
            ))}
          </div>
        )}
        
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

export default WishlistPage;