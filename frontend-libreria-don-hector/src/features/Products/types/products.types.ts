export interface Product {
    id_producto: number;
    nombre: string;
    descripcion: string;
    codigo_producto?: string;
    categoria?: string;
    precio_compra?: number;
    precio_venta: number;
    stock: number;
    imagen?: string;
    es_libro?: boolean;
    autor: string | null;
    fecha_lanzamiento?: string | null;
    stock_minimo: number;
  }
  
  export interface ProductFormData {
    id_producto?: number;
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
    stock_minimo: number;
  }
  
  export interface UpdateProductData {
    id_producto?: number;
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
    stock_minimo?: number;
  }
  
  
  export interface ProductResponse {
    status: string;
    message: string;
    data: {
      products: Product[] | Product;
    };
  }
