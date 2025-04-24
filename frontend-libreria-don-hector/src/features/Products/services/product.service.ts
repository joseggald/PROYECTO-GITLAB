import { serviceApi } from "@/services/auth";
import { 
  Product, 
  ProductFormData,
  UpdateProductData, 
    ProductResponse
} from "../types/products.types";

export const productService = {
    /**
     * Obtiene todos los productos
     * @returns Lista de productos
     */
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const { data } = await serviceApi.get<ProductResponse>('/productos/Allproducts');
            return Array.isArray(data.data.products) ? data.data.products : [data.data.products];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    },

    /**
     * Crea un nuevo producto
     * @param productData Datos del producto a crear
     * @returns El producto creado
     */
    createProduct: async (productData: ProductFormData): Promise<{ id_producto: number; message: string }> => {
        try {
            const response = await serviceApi.post<{ id_producto: number; message: string }>('/productos/add', productData);
            const { data } = response;
            if (data && data.id_producto && data.message) {
                return data;
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Error al crear productos:', error);
            throw error;
        }
    },

    /**
     * Actualiza un producto existente
     * @param id Identificador del producto a actualizar
     * @param updateData Datos a actualizar del producto
     * @returns Mensaje de confirmación y el id del producto actualizado
     */
    updateProduct: async (id: string, updateData: UpdateProductData): Promise<{ id_producto: number; message: string }> => {
        try {
            const { data } = await serviceApi.put<{ id_producto: number; message: string }>(`/productos/update/${id}`, updateData);  
            return data;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    },

    /**
     * Eliminar un producto existente
     * @param id Identificador del producto a eliminar
     * @returns Mensaje de confirmación y el id del producto eliminado
     */
    deleteProduct: async (id: string): Promise<{ id_producto: number; message: string }> => {
        try {
            const { data } = await serviceApi.delete<{ id_producto: number; message: string }>(`/productos/delete/${id}`);
            return data;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
};

export default productService;