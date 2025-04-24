import React, { useState } from 'react';
import { Book } from '@/features/Books/types/books.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book as BookIcon, Heart, Eye } from 'lucide-react';
import AddToCartButton from '@/components/ShoppingCart/components/AddToCartButton';

interface WishlistItemProps {
  book: Book;
  onRemoveFromWishlist: () => void;
  onViewDetails: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  book,
  onRemoveFromWishlist,
  onViewDetails,
}) => {
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const handleRemoveFromWishlist = async () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    try {
      await onRemoveFromWishlist();
    } finally {
      setIsRemoving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  return (
    <Card className="border border-gray-200 hover:border-yellow-500/50 hover:shadow-md transition-all duration-300 overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-36 h-40 bg-gradient-to-br from-yellow-50 to-gray-100 flex items-center justify-center p-2">
            {book.imagen ? (
              <img
                src={book.imagen}
                alt={book.nombre}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <BookIcon className="h-16 w-16 text-yellow-700/30" />
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{book.nombre}</h3>
                <p className="text-sm text-gray-600">{book.autor}</p>
                
                <div className="flex items-center mt-2">
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 mr-2">
                    {book.categoria}
                  </span>
                  <span className={`text-sm ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.stock > 0 ? `${book.stock} disponibles` : 'Agotado'}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-yellow-800">
                  {formatCurrency(book.precio_venta)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-auto pt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-700 hover:text-white"
                onClick={onViewDetails}
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver Detalles
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-500 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={handleRemoveFromWishlist}
                disabled={isRemoving}
              >
                <Heart className="h-4 w-4 mr-1 fill-red-500" />
                {isRemoving && (
                  <span className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                )}
                Quitar
              </Button>
              
              <AddToCartButton
                product={book}
                size="sm"
                className="ml-auto"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistItem;