
export interface Book {
  id_producto: number;
  nombre: string;
  autor: string;
  codigo_producto: string;
  fecha_lanzamiento: string;
  descripcion: string;
  categoria: string;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  imagen?: string | null;
  es_libro: boolean;
  inWishlist?: boolean;
}

export interface BookSearchFilters {
  titulo?: string;
  autor?: string;
  genero?: string;
  precio_min?: number;
  precio_max?: number;
}

export interface BookSearchResponse {
  status: string;
  message: string;
  data: {
    books: Book[];
  };
}

export interface WishlistResponse {
  status: string;
  message: string;
  data: {
    wishlist: Book[];
  };
}