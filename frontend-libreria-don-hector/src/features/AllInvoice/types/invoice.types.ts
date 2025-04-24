export interface Invoice {
    id_factura: number;
    fecha_emision: string;
    nombre_comprador: string;
    total_venta: number;
    direccion_entrega: string;
    id_cliente: number;
    cliente_nombre: string;
    cliente_apellido: string;
    cliente_edad: number;
    cliente_fecha_registro: string;
    id_empleado: number;
    empleado_nombre: string;
    empleado_apellido: string;
    empleado_telefono: string;
    empleado_genero: string;
    empleado_fecha_contratacion: string;
    id_metodo_pago: number;
    metodo_pago_tipo: string;
    detalles: InvoiceDetail[];
  }
  
  export interface InvoiceDetail {
    id_producto: number;
    nombre: string;
    descripcion: string;
    codigo_producto: string;
    categoria: string;
    precio_compra: number;
    precio_venta: number;
    stock: number;
    imagen: string;
    es_libro: boolean;
    autor: string | null;
    fecha_lanzamiento: string | null;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }
  
  export interface InvoiceResponse {
    status: string;
    message: string;
    data: {
      invoices: Invoice[] | Invoice;
    };
  }