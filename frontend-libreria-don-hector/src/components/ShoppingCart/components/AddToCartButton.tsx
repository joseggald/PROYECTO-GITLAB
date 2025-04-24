import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { Book } from '@/features/Books/types/books.types';
import { useCartStore } from '@/store/cart/cart.store';
import { toast } from '@/hooks/Toast/use-toast';

interface AddToCartButtonProps {
  product: Book;
  className?: string;
  showQuantity?: boolean;
  fullWidth?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  className = '',
  showQuantity = false,
  fullWidth = false,
  variant = 'default',
  size = 'default',
}) => {
  const { addItem, isInCart, removeItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inCart = isInCart(product.id_producto);

  const handleAddToCart = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      addItem(product, quantity);
      
      toast({
        title: "¡Añadido al carrito!",
        description: `${product.nombre} se ha añadido a tu carrito de compras`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      removeItem(product.id_producto);
      
      toast({
        title: "Eliminado del carrito",
        description: `${product.nombre} se ha eliminado de tu carrito`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast({
        title: "Stock limitado",
        description: `Solo hay ${product.stock} unidades disponibles`,
        variant: "destructive",
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Si el producto está agotado
  if (product.stock <= 0) {
    return (
      <Button
        disabled
        className={`bg-gray-200 text-gray-500 ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Agotado
      </Button>
    );
  }

  // Si el producto ya está en el carrito
  if (inCart) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleRemoveFromCart}
        className={`border-green-600 bg-green-50 text-green-700 hover:bg-red-600 hover:text-white hover:border-red-600 ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={isLoading}
      >
        <Check className="h-4 w-4 mr-2" />
        En el carrito
        {isLoading && (
          <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
        )}
      </Button>
    );
  }

  // Botón normal de añadir al carrito
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {showQuantity && (
        <div className="flex items-center justify-center gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isLoading}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">{quantity}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock || isLoading}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Button
        variant={variant}
        size={size}
        onClick={handleAddToCart}
        className={`${variant === 'default' ? 'bg-yellow-700 hover:bg-yellow-800 text-white' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={isLoading}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Añadir al carrito
        {isLoading && (
          <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
        )}
      </Button>
    </div>
  );
};

export default AddToCartButton;