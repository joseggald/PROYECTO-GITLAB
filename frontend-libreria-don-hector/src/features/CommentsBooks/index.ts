export interface Product {
    id_producto: number;
    nombre: string;
    categoria: string;
    es_libro: boolean;
    autor: string | null;
    fecha_lanzamiento: string | null;
  }
  
  export interface Comment {
    id_comentario: number;
    id_cliente: number;
    nombre: string;
    apellido: string;
    calificacion: number;
    comentario: string;
    fecha_resena: string;
  }
  
  export interface CommentsResponse {
    status: string;
    message: string;
    data: {
      comments: Comment[];
    };
  }
  
  export interface ProductsResponse {
    status: string;
    message: string;
    data: {
      products: Product[];
    };
  }