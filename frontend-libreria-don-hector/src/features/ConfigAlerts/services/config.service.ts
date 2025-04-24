import { serviceApi } from "@/services/auth";
import { Product, ProductResponse } from "../types/config.types";

export const configService = {
  /**
   * Obtiene todos los productos
   * @returns Lista de productos
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const { data } = await serviceApi.get<ProductResponse>('/productos/Allproducts');
      return Array.isArray(data.data.products) ? data.data.products : [];
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  },

  /**
   * Actualiza el stock mínimo de todos los productos
   * @param stockMinimo Nuevo valor de stock mínimo
   * @returns Respuesta del servidor
   */
  bulkUpdateStockMinimo: async (stockMinimo: number): Promise<void> => {
    try {
      const products = await configService.getAllProducts();
    const updatedProducts = products.map(product => ({
      id_producto: product.id_producto,
      nombre: product.nombre,
      descripcion: product.descripcion,
      codigo_producto: product.codigo_producto,
      categoria: product.categoria,
      precio_compra: Number(product.precio_compra),
      precio_venta: Number(product.precio_venta),
      stock: product.stock,
      imagen: product.imagen,
      es_libro: product.es_libro,
      autor: product.autor,
      fecha_lanzamiento: product.fecha_lanzamiento,
      stock_minimo: Number(stockMinimo), // Aseguramos que el stock mínimo sea un número
    }));
      console.log('updatedProducts', updatedProducts);
      await serviceApi.put('/productos/bulk-update', { products: updatedProducts });
    } catch (error) {
      console.error('Error al actualizar el stock mínimo:', error);
      throw error;
    }
  },

  /**
   * Actualiza el stock mínimo de un producto específico
   * @param id_producto ID del producto
   * @param stockMinimo Nuevo valor de stock mínimo
   * @returns Respuesta del servidor
   */
  updateProductStockMinimo: async (id_producto: number, stockMinimo: number): Promise<void> => {
    try {
      const products = await configService.getAllProducts();
      const product = products.find(p => p.id_producto === id_producto);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      const updatedProduct = {
        ...product,
        stock_minimo: stockMinimo,
      };
      await serviceApi.put(`/productos/update/${id_producto}`, updatedProduct);
    } catch (error) {
      console.error('Error al actualizar el stock mínimo del producto:', error);
      throw error;
    }
  },
  /**
   * Obtiene el conteo de alertas basado en productos con stock bajo
   * @returns Número de productos con stock bajo
   */
  getAlertCount: async (): Promise<number> => {
    try {
      const products = await configService.getAllProducts();
      const lowStockProducts = products.filter(product => 
        product.stock < product.stock_minimo
      );
      return lowStockProducts.length;
    } catch (error) {
      console.error('Error al obtener el conteo de alertas:', error);
      return 0;
    }
  },
};

export default configService;