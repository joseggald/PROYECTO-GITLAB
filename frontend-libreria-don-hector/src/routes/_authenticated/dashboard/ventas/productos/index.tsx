import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import BookFilters from '@/features/Books/components/BookFilters';
import BookGrid from '@/features/Books/components/BookGrid';
import BookDetails from '@/features/Books/components/BookDetails';
import AddToCartButton from '@/components/ShoppingCart/components/AddToCartButton';
import FloatingCart from '@/components/ShoppingCart/components/FloatingCart';
import useBooks from '@/features/Books/hooks/useBooks';
import { Book } from '@/features/Books/types/books.types';
import ClientSelector from '@/features/Books/components/ClientSelector';
import { useAuthStore } from '@/store/auth/auth.store';
import { toast } from '@/hooks/Toast/use-toast';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';

export const Route = createFileRoute(
  '/_authenticated/dashboard/ventas/productos/',
)({
  component: ProductosVentaPage,
});

function ProductosVentaPage() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  
  const { 
    books, 
    isLoading, 
    isError, 
    updateFilters, 
    clearFilters, 
    filters, 
    toggleWishlistStatus 
  } = useBooks();
  
  const { user } = useAuthStore();
  const isEmployee = !!user?.id_empleado;

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsBookDetailsOpen(false);
  };
  
  const handleCheckoutSuccess = (invoiceId: number) => {
    toast({
      title: "¡Venta exitosa!",
      description: `La factura #${invoiceId} ha sido procesada correctamente`,
    });
    
    setTimeout(() => {
      navigate({ to: '/dashboard/ventas/facturas' });
    }, 2000);
  };

  const renderItemFooter = (book: Book) => {
    return (
      <div className="mt-2">
        <AddToCartButton
          product={book}
          variant="default"
          size="sm"
          fullWidth
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <ShoppingBag className="h-10 w-10" />
            Punto de Venta - Productos
          </h1>
          <p className="mt-2 text-yellow-100 max-w-2xl">
            {isEmployee ? 
              "Selecciona un cliente y los productos para realizar una venta." :
              "Explora nuestra colección y agrega productos al carrito para vender."}
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {isEmployee && (
              <ClientSelector 
                onSelectClient={setSelectedClientId} 
                selectedClientId={selectedClientId}
              />
            )}
            
            <BookFilters
              filters={filters}
              onUpdateFilters={updateFilters}
              onClearFilters={clearFilters}
            />
          </div>
          
          {/* Main product grid */}
          <div className="md:col-span-3">
            <BookGrid
              books={books}
              isLoading={isLoading}
              isError={isError}
              onToggleWishlist={toggleWishlistStatus}
              onViewDetails={handleViewDetails}
              renderItemFooter={renderItemFooter}
            />
          </div>
        </div>
        
        {/* Book details modal */}
        <BookDetails
          book={selectedBook}
          isOpen={isBookDetailsOpen}
          onClose={handleCloseDetails}
          onToggleWishlist={toggleWishlistStatus}
          footer={
            selectedBook && (
              <AddToCartButton
                product={selectedBook}
                variant="default"
                size="default"
                fullWidth
                showQuantity
              />
            )
          }
        />
        
        {/* Floating cart */}
        <FloatingCart 
          clienteId={selectedClientId} 
          onCheckoutSuccess={handleCheckoutSuccess}
          position="bottom-right"
        />
      </div>
    </div>
  );
}

export default ProductosVentaPage;