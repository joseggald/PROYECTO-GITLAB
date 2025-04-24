import React, { useState, useEffect } from 'react';
import { Book } from '../types/books.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Book as BookIcon, Calendar, Tag, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/Toast/use-toast';
import BookCommentSection from './BookCommentSection';
import { useAuthStore } from '@/store/auth';

interface BookDetailsProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleWishlist?: (bookId: number, currentStatus: boolean) => Promise<boolean>;
  footer?: React.ReactNode;
}

export const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  isOpen,
  onClose,
  onToggleWishlist,
  footer
}) => {
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('details');
  const { user } = useAuthStore();
  useEffect(() => {
    if (book) {
      setIsInWishlist(!!book.inWishlist);
    }
  }, [book, book?.inWishlist]);

  if (!book) return null;

  const handleToggleWishlist = async () => {
    if (!onToggleWishlist || isToggling || !book) return;
    
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl overflow-hidden bg-white p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 bg-gradient-to-br from-yellow-100 to-gray-200 flex items-center justify-center p-6">
              {book.imagen ? (
                <img
                  src={book.imagen}
                  alt={book.nombre}
                  className="w-full h-auto max-h-96 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                  <BookIcon className="h-24 w-24 text-yellow-700/70" />
                  <h2 className="text-xl font-semibold text-center text-yellow-800">{book.nombre}</h2>
                </div>
              )}
            </div>
            
            {/* Detalles del Libro */}
            <div className="w-full md:w-3/5 p-6 flex flex-col">
              <DialogHeader className="pb-4 border-b border-gray-200">
                <DialogTitle className="text-2xl font-bold text-gray-900">{book.nombre}</DialogTitle>
                <p className="text-lg text-gray-700 font-medium">{book.autor}</p>
              </DialogHeader>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="py-4 flex-grow">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details" className="data-[state=active]:bg-yellow-700 data-[state=active]:text-white">
                    Detalles
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="data-[state=active]:bg-yellow-700 data-[state=active]:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reseñas
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {book.categoria}
                    </Badge>
                    <Badge variant="outline" className="border-gray-500 text-gray-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(book.fecha_lanzamiento)}
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Descripción:</h3>
                    <p className="text-gray-600">
                      {book.descripcion || "No hay descripción disponible para este libro."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Precio:</span>
                      <span className="text-2xl font-bold text-yellow-800">
                        {formatCurrency(book.precio_venta)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {book.stock > 0 ? `${book.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="comments" className="pt-4">
                  <BookCommentSection productId={book.id_producto} />
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="pt-4 border-t border-gray-200">
              {
                    user?.id_empleado === null ? (
                      <>
                <Button
                  variant="outline"
                  className={`border-yellow-600 mt-14 ${isInWishlist ? 'bg-yellow-100' : ''} text-yellow-700 hover:bg-yellow-700 hover:text-white`}
                  onClick={handleToggleWishlist}
                  disabled={isToggling}
                >
                  
                        <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-yellow-600' : ''}`} />
                        {isInWishlist ? 'Quitar de Lista de Deseos' : 'Añadir a Lista de Deseos'}
                        {isToggling && (
                          <span className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        )}
                      
                </Button>
                </>
                    ) : (
                      null
                    )
                  }
                {footer}
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetails;