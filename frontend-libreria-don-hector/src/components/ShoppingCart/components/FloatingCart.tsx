import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  BookOpen,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cart/cart.store';
import { cartService, PaymentMethod } from '../services/cart.service';
import { useAuthStore } from '@/store/auth/auth.store';
import { UserRole } from '@/types/auth.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/Toast/use-toast';

/**
 * Hook para detectar clics fuera de un elemento
 */
const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

interface FloatingCartProps {
  onCheckoutSuccess?: (invoiceId: number) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  clienteId?: number | null;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ 
  onCheckoutSuccess,
  position = 'bottom-right',
  className = '',
  clienteId = null
}) => {
  const { user } = useAuthStore();
  const { items, getItemCount, getTotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  const itemCount = getItemCount();
  const total = getTotal();
  
  // Determinar posicionamiento CSS
  const getPositionClasses = () => {
    switch(position) {
      case 'bottom-right': return 'bottom-5 right-5';
      case 'bottom-left': return 'bottom-5 left-5';
      case 'top-right': return 'top-5 right-5';
      case 'top-left': return 'top-5 left-5';
      default: return 'bottom-5 right-5';
    }
  };
  
  // Cerrar el carrito cuando se hace clic fuera
  useOnClickOutside(cartRef, () => {
    if (isOpen && !isCheckoutOpen) {
      setIsOpen(false);
    }
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      loadPaymentMethods();
      if (user) {
        setCustomerName(`${user.nombre || ''} ${user.apellido || ''}`);
        setShippingAddress('');
      }
    }
  }, [isCheckoutOpen, user, clienteId]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await cartService.getPaymentMethods();
      setPaymentMethods(methods);
      
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id_metodo_pago.toString());
      }
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los métodos de pago',
        variant: 'destructive',
      });
    }
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = async () => {
    // Validaciones
    if (!selectedPaymentMethod) {
      toast({
        title: 'Error',
        description: 'Selecciona un método de pago',
        variant: 'destructive',
      });
      return;
    }

    if (!shippingAddress.trim()) {
      toast({
        title: 'Error',
        description: 'Ingresa una dirección de envío',
        variant: 'destructive',
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: 'Error',
        description: 'Ingresa tu nombre completo',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await cartService.checkout({
        items,
        total,
        nombre_comprador: customerName,
        id_metodo_pago: parseInt(selectedPaymentMethod),
        direccion_entrega: shippingAddress,
        clienteId: clienteId
      });

      clearCart();
      setIsCheckoutOpen(false);
      setIsOpen(false);

      toast({
        title: '¡Compra exitosa!',
        description: `Tu orden #${result.id_factura} ha sido procesada correctamente`,
      });

      if (onCheckoutSuccess) {
        onCheckoutSuccess(result.id_factura);
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: unknown) {
      console.error('Error al procesar la compra:', error);
      toast({
        title: 'Error',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (error as any).response?.data?.message || 'Ocurrió un error al procesar la compra',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  const CartItemComponent = ({ item }: { item: CartItem }) => {
    return (
      <div className="flex items-center py-3 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-3 overflow-hidden">
          {item.imagen ? (
            <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{item.nombre}</h4>
          {item.autor && <p className="text-xs text-gray-600 truncate">{item.autor}</p>}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => updateQuantity(item.id_producto, item.cantidad - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium w-6 text-center">{item.cantidad}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)}
                disabled={item.cantidad >= item.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{formatCurrency(item.subtotal)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeItem(item.id_producto)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getDialogTitle = () => {
    if (user?.role !== UserRole.CLIENTE && clienteId) {
      return 'Realizar compra para cliente';
    }
    return 'Finalizar compra';
  };

  const getDialogDescription = () => {
    if (user?.role !== UserRole.CLIENTE && clienteId) {
      return 'Estás realizando una compra para un cliente';
    }
    return 'Completa la información para procesar tu pedido';
  };

  return (
    <>
      <div ref={cartRef} className={`fixed ${getPositionClasses()} ${className} z-50`}>
        <button
          onClick={toggleCart}
          className="relative p-3 rounded-full bg-yellow-700 text-white hover:bg-yellow-800 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 shadow-lg"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-yellow-700 bg-white p-0 text-xs font-bold text-yellow-700">
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-14 z-50 w-80 rounded-md bg-white shadow-xl">
            <div className="p-3 bg-gradient-to-r from-yellow-700 to-yellow-800 text-white rounded-t-md flex justify-between items-center">
              <h3 className="font-medium">Mi carrito ({itemCount})</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white hover:bg-yellow-600/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-3 max-h-[60vh] overflow-y-auto">
              {items.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-yellow-200" />
                  <p className="mt-2 text-gray-500">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <CartItemComponent key={item.id_producto} item={item} />
                  ))}
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-medium text-lg mb-4">
                      <span>Total:</span>
                      <span className="text-yellow-800">{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {items.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          onClick={clearCart}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Vaciar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="w-full bg-yellow-700 hover:bg-yellow-800 text-white"
                        onClick={() => setIsCheckoutOpen(true)}
                        disabled={items.length === 0}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pagar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ingresa nombre completo"
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Dirección de envío</Label>
              <Input
                id="address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Ingresa dirección de envío"
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="payment">Método de pago</Label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                disabled={isProcessing || paymentMethods.length === 0}
              >
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.length === 0 ? (
                    <SelectItem value="loading" disabled>
                      Cargando métodos de pago...
                    </SelectItem>
                  ) : (
                    paymentMethods.map((method) => (
                      <SelectItem 
                        key={method.id_metodo_pago} 
                        value={method.id_metodo_pago.toString()}
                      >
                        {method.tipo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-yellow-800">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
              <AlertCircle className="h-4 w-4" />
              <p>El pago se procesará al completar la orden.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCheckoutOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCheckout}
              className="bg-yellow-700 hover:bg-yellow-800 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Completar Compra
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingCart;