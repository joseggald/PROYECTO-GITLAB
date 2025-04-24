import { serviceApi } from "@/services/auth";
import { SalesReportResponse, EarningsReportResponse, Sale, EarningsReport } from "../types/report.types";

export const reportService = {
  /**
   * Obtiene el reporte de ventas
   * @returns Lista de ventas
   */
  getSalesReport: async (): Promise<Sale[]> => {
    try {
      const { data } = await serviceApi.get<SalesReportResponse>('/reports/sales-report');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener el reporte de ventas:', error);
      return [];
    }
  },

  /**
   * Obtiene el reporte de ganancias
   * @returns Reporte de ganancias
   */
  getEarningsReport: async (): Promise<EarningsReport | null> => {
    try {
      const { data } = await serviceApi.get<EarningsReportResponse>('/reports/earnings-report');
      console.log('data', data.data);
      return data.data;
    } catch (error) {
      console.error('Error al obtener el reporte de ganancias:', error);
      return null;
    }
  },
};

export default reportService;