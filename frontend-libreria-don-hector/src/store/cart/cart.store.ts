import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Book } from "@/features/Books/types/books.types";

export interface CartItem {
  id_producto: number;
  nombre: string;
  autor?: string;
  codigo_producto?: string;
  precio_venta: number;
  stock: number;
  imagen?: string;
  es_libro: boolean;
  cantidad: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  
  // Acciones
  addItem: (product: Book, cantidad?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, cantidad: number) => void;
  clearCart: () => void;
  
  // Utilidades
  getItemCount: () => number;
  getTotal: () => number;
  isInCart: (productId: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Añadir un producto al carrito
      addItem: (product: Book, cantidad = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(item => item.id_producto === product.id_producto);

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Si el producto ya está en el carrito, actualizar la cantidad
          updatedItems = [...items];
          const newCantidad = updatedItems[existingItemIndex].cantidad + cantidad;
          
          // Verificar que no exceda el stock disponible
          if (newCantidad > product.stock) {
            return;
          }
          
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            cantidad: newCantidad,
            subtotal: product.precio_venta * newCantidad
          };
        } else {
          // Si el producto no está en el carrito, añadirlo
          if (cantidad > product.stock) {
            return;
          }
          
          const newItem: CartItem = {
            id_producto: product.id_producto,
            nombre: product.nombre,
            autor: product.autor,
            codigo_producto: product.codigo_producto,
            precio_venta: product.precio_venta,
            stock: product.stock,
            es_libro: true,
            cantidad,
            subtotal: product.precio_venta * cantidad
          };
          
          updatedItems = [...items, newItem];
        }

        set({ items: updatedItems });
      },

      // Eliminar un producto del carrito
      removeItem: (productId: number) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id_producto !== productId);
        set({ items: updatedItems });
      },

      // Actualizar la cantidad de un producto en el carrito
      updateQuantity: (productId: number, cantidad: number) => {
        const { items } = get();
        const itemIndex = items.findIndex(item => item.id_producto === productId);
        
        if (itemIndex === -1) return;
        
        // Verificar que la cantidad no exceda el stock
        if (cantidad > items[itemIndex].stock) {
          return;
        }
        
        // Si la cantidad es 0 o menor, eliminar el producto
        if (cantidad <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const updatedItems = [...items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          cantidad,
          subtotal: updatedItems[itemIndex].precio_venta * cantidad
        };
        
        set({ items: updatedItems });
      },

      // Limpiar el carrito
      clearCart: () => {
        set({ items: [] });
      },

      // Obtener el número total de items en el carrito
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },

      // Obtener el total del carrito
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.subtotal, 0);
      },
      
      // Verificar si un producto está en el carrito
      isInCart: (productId: number) => {
        return get().items.some(item => item.id_producto === productId);
      }
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items
      }),
    }
  )
);