import { useQuery, useMutation } from '@tanstack/react-query';
import { configService } from '../services/config.service';

export const CONFIG_QUERY_KEYS = {
  products: ['products'] as const,
};

export const useConfigAlerts = () => {
  // Query para obtener todos los productos
  const { 
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: CONFIG_QUERY_KEYS.products,
    queryFn: configService.getAllProducts,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para actualizar el stock mínimo de todos los productos
  const bulkUpdateMutation = useMutation({
    mutationFn: (stockMinimo: number) => configService.bulkUpdateStockMinimo(stockMinimo),
    onSuccess: () => {
      refetch(); // Recargar la lista de productos después de la actualización
    },
  });

  // Mutación para actualizar el stock mínimo de un producto específico
  const updateProductMutation = useMutation({
    mutationFn: ({ id_producto, stockMinimo }: { id_producto: number; stockMinimo: number }) =>
      configService.updateProductStockMinimo(id_producto, stockMinimo),
    onSuccess: () => {
      refetch(); 
    },
  });

  return {
    products,
    isLoading,
    isError,
    error,
    bulkUpdateMutation,
    updateProductMutation,
  };
};

export default useConfigAlerts;