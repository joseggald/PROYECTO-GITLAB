import React, { useState, useEffect } from 'react';
import { Book } from '../types/books.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Book as BookIcon, Heart, Eye } from 'lucide-react';
import { toast } from '@/hooks/Toast/use-toast';
import { useAuthStore } from '@/store/auth';

interface BookCardProps {
  book: Book;
  onToggleWishlist?: (bookId: number, currentStatus: boolean) => Promise<boolean>;
  onViewDetails?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onToggleWishlist,
  onViewDetails,
}) => {
  const [isInWishlist, setIsInWishlist] = useState<boolean>(!!book.inWishlist);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const { user } = useAuthStore();
  useEffect(() => {
    setIsInWishlist(!!book.inWishlist);
  }, [book.inWishlist]);

  const handleToggleWishlist = async () => {
    if (!onToggleWishlist || isToggling) return;
    
    setIsToggling(true);
    try {
      const newStatus = await onToggleWishlist(book.id_producto, isInWishlist);
      setIsInWishlist(newStatus);
      
      toast({
        title: newStatus ? "Añadido a favoritos" : "Eliminado de favoritos",
        description: newStatus 
          ? `${book.nombre} se ha añadido a tu lista de favoritos` 
          : `${book.nombre} se ha eliminado de tu lista de favoritos`,
        variant: "default",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista de favoritos",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails({...book, inWishlist: isInWishlist});
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 border border-gray-200 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-900/10 bg-white group">
      <CardHeader className="p-0 relative h-48 overflow-hidden">
        {book.imagen ? (
          <img
            src={book.imagen}
            alt={book.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100 to-gray-200">
            <BookIcon className="h-16 w-16 text-yellow-700/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col gap-2 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-yellow-800 transition-colors duration-300">
            {book.nombre}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600">{book.autor}</p>
        
        <div className="mt-auto">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            {book.categoria}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-yellow-800">
            {formatCurrency(book.precio_venta)}
          </span>
          <span className={`text-sm ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {book.stock > 0 ? `${book.stock} disponibles` : 'Agotado'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-700 hover:text-white"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4 mr-1" />
            <span>Ver</span>
          </Button>
          { user?.id_rol === 4 ? 
           <Button 
           variant="outline" 
           size="sm" 
           className={`border-yellow-600 ${isInWishlist ? 'bg-yellow-100' : ''} text-yellow-700 hover:bg-yellow-700 hover:text-white`}
           onClick={handleToggleWishlist}
           disabled={isToggling}
         >
           <Heart 
             className={`h-4 w-4 ${isInWishlist ? 'fill-yellow-600' : ''}`} 
           />
           {isToggling && (
             <span className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
           )}
         </Button>
          : null }
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;