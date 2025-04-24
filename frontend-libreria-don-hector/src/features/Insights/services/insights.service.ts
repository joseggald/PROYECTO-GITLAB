import { serviceApi } from '@/services/auth';

export interface TopRatedProduct {
  id_producto: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio_venta: string;
  imagen: string | null;
  calificacion_promedio: string;
  en_wishlist: boolean;
  comprado: boolean;
}
interface TopRatedResponse {
  status: string;
  message: string;
  data: {
    idCliente: number;
    products: TopRatedProduct[];
  };
}

const insightsService = {
  /**
   * Obtiene los productos mejor calificados
   * @returns Los productos mejor calificados con sus puntuaciones y estados
   */
  getTopRatedProducts: async (): Promise<{idCliente: number; products: TopRatedProduct[]}> => {
    try {
      const { data } = await serviceApi.get<TopRatedResponse>('/productos/top-rated');
      return {
        idCliente: data.data.idCliente,
        products: data.data.products || []
      };
    } catch (error) {
      console.error('Error al obtener productos top rated:', error);
      return {
        idCliente: 0,
        products: []
      };
    }
  }
};

export default insightsService;