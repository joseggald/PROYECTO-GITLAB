import { serviceApi } from "@/services/auth";
import { AlertProduct, AlertResponse } from "../types/alert.types";

export const alertService = {
  /**
   * Obtiene los productos con stock bajo (stock < stock mínimo)
   * @returns Lista de productos con stock bajo
   */
  getLowStockProducts: async (): Promise<AlertProduct[]> => {
    try {
      const { data } = await serviceApi.get<AlertResponse>('/productos/Allproducts');
      const products = Array.isArray(data.data.products) ? data.data.products : [data.data.products];
      
      // Filtrar productos con stock menor al stock mínimo
      return products.filter(product => product.stock < product.stock_minimo);
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      return [];
    }
  },
};

export default alertService;