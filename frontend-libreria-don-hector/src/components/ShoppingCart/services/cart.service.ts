import { serviceApi } from "@/services/auth";
import { CartItem } from "@/store/cart/cart.store";
import { useAuthStore } from "@/store/auth";

interface InvoiceDetail {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface CreateInvoiceRequest {
  fecha_emision: string; 
  nombre_comprador: string;
  id_cliente: number | null;
  id_metodo_pago: number;
  total_venta: number;
  direccion_entrega: string;
  id_empleado: number | null;
  detalles: InvoiceDetail[];
}

export interface PaymentMethod {
  id_metodo_pago: number;
  tipo: string;
}

export const cartService = {
  /**
   * Procesa el checkout del carrito creando una factura
   * Para clientes: envía id_cliente = ID del cliente, id_empleado = null
   * Para empleados: envía id_cliente = ID del cliente (si está comprando para un cliente) o null, 
   *                id_empleado = ID del empleado
   */
  checkout: async (checkoutData: {
    items: CartItem[];
    total: number;
    nombre_comprador: string;
    id_metodo_pago: number;
    direccion_entrega: string;
    clienteId?: number | null; // ID opcional del cliente (para cuando un empleado compra para un cliente)
  }): Promise<{ id_factura: number }> => {
    const { items, total, nombre_comprador, id_metodo_pago, direccion_entrega, clienteId } = checkoutData;
    
    const { user } = useAuthStore.getState();
    
    if (!user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Preparar los detalles de la factura
    const detalles = items.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_venta
    }));
    
    let id_cliente: number | null = null;
    let id_empleado: number | null = null;
    
    if (user.id_rol === 4) {
      id_cliente = user.id_cliente || null;
      id_empleado = null;
    } else {
      id_empleado = user.id_empleado || null; 
      id_cliente = clienteId || null;
      if(clienteId === null) {
        throw new Error("Cliente no especificado");
      }
    }
    
    const payload: CreateInvoiceRequest = {
      fecha_emision: new Date().toISOString().split('T')[0],
      nombre_comprador,
      id_cliente,
      id_metodo_pago,
      total_venta: total,
      direccion_entrega,
      id_empleado,
      detalles
    };

    try {
      const { data } = await serviceApi.post('/invoice/create', payload);
      return data.data.invoice;
    } catch (error) {
      console.error('Error al procesar el checkout:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene los métodos de pago disponibles
   */
  getPaymentMethods: async () => {
    try {
      const { data } = await serviceApi.get('/invoice/payment-methods');
      return data.data.methods || [];
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      return [];
    }
  },
  
  /**
   * Obtiene todas las facturas del usuario especificado
   * Si no se proporciona un ID, usa el ID del usuario actual
   */
  getUserInvoices: async (userId?: number) => {
    // Si no se proporciona un ID, obtener el ID del usuario actual
    if (!userId) {
      const { user } = useAuthStore.getState();
      if (!user || !user.id_cliente) {
        throw new Error("Usuario no autenticado o sin ID de cliente");
      }
      userId = user.id_cliente;
    }
    
    try {
      const { data } = await serviceApi.get(`/invoice/invoices/${userId}`);
      return data.data.invoices || [];
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      return [];
    }
  },
  
  /**
   * Obtiene el detalle de una factura específica
   */
  getInvoiceById: async (invoiceId: number) => {
    try {
      const { data } = await serviceApi.get(`/invoice/fel/${invoiceId}`);
      return data.data.invoice || null;
    } catch (error) {
      console.error('Error al obtener detalle de factura:', error);
      return null;
    }
  },
  
  /**
   * Obtiene todas las facturas (para administradores)
   */
  getAllInvoices: async () => {
    try {
      const { data } = await serviceApi.get('/invoice/all_invoices');
      return data.data.invoices || [];
    } catch (error) {
      console.error('Error al obtener todas las facturas:', error);
      return [];
    }
  },
  
  /**
   * Obtiene todas las facturas (para administradores)
   */
  downloadPDF: async (invoiceId: number) => {
    try {
      // Crear la URL para la descarga directa
      const downloadUrl = `${serviceApi.defaults.baseURL}/invoice/download/${invoiceId}/pdf`;
      
      window.open(downloadUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Error al descargar la factura en PDF:', error);
      throw error;
    }
  },
  

};

export default cartService;