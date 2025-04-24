import { useQuery } from '@tanstack/react-query';
import { alertService } from '../services/alert.service';

export const ALERTS_QUERY_KEYS = {
  all: ['alerts'] as const,
};

export const useAlerts = () => {
  // Query para obtener productos con stock bajo
  const { 
    data: lowStockProducts = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ALERTS_QUERY_KEYS.all,
    queryFn: alertService.getLowStockProducts,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    lowStockProducts,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useAlerts;