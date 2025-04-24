import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report.service';

export const REPORTS_QUERY_KEYS = {
  sales: ['sales-report'] as const,
  earnings: ['earnings-report'] as const,
};

export const useReports = () => {
  // Query para obtener el reporte de ventas
  const { 
    data: salesReport = [],
    isLoading: isSalesLoading,
    isError: isSalesError,
    error: salesError,
    refetch: refetchSales,
  } = useQuery({
    queryKey: REPORTS_QUERY_KEYS.sales,
    queryFn: reportService.getSalesReport,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para obtener el reporte de ganancias
  const { 
    data: earningsReport = null,
    isLoading: isEarningsLoading,
    isError: isEarningsError,
    error: earningsError,
    refetch: refetchEarnings,
  } = useQuery({
    queryKey: REPORTS_QUERY_KEYS.earnings,
    queryFn: reportService.getEarningsReport,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    salesReport,
    earningsReport,
    isSalesLoading,
    isEarningsLoading,
    isSalesError,
    isEarningsError,
    salesError,
    earningsError,
    refetchSales,
    refetchEarnings,
  };
};

export default useReports;