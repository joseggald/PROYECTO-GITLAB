import { serviceApi } from "@/services/auth";
import { Invoice, InvoiceResponse } from "../types/invoice.types";

export const invoiceService = {
  /**
   * Obtiene todas las facturas
   * @returns Lista de facturas
   */
  getAllInvoices: async (): Promise<Invoice[]> => {
    try {
      const { data } = await serviceApi.get<InvoiceResponse>('/invoice/all_invoices');
      return Array.isArray(data.data.invoices) ? data.data.invoices : [data.data.invoices];
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      return [];
    }
  },

  /**
   * Obtiene una factura por su ID
   * @param id_factura ID de la factura
   * @returns La factura encontrada
   */
  getInvoiceById: async (id_factura: string): Promise<Invoice | null> => {
    try {
      const { data } = await serviceApi.get<InvoiceResponse>(`/invoice/fel/${id_factura}`);
      return data.data.invoices as Invoice;
    } catch (error) {
      console.error('Error al obtener la factura:', error);
      return null;
    }
  },

  /**
   * Obtiene las facturas de un usuario específico
   * @param id_usuario ID del usuario
   * @returns Lista de facturas del usuario
   */
  getInvoicesByUser: async (id_usuario: string): Promise<Invoice[]> => {
    try {
      const { data } = await serviceApi.get<InvoiceResponse>(`/invoice/invoices/${id_usuario}`);
      return Array.isArray(data.data.invoices) ? data.data.invoices : [data.data.invoices];
    } catch (error) {
      console.error('Error al obtener las facturas del usuario:', error);
      return [];
    }
  },

  /**
   * Genera un PDF de la factura
   * @param id_factura ID de la factura
   * @returns Blob del PDF
   */
  generateInvoicePDF: async (id_factura: string): Promise<Blob> => {
    try {
      const response = await serviceApi.get(`/invoice/dowload/${id_factura}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar el PDF de la factura:', error);
      throw error;
    }
  },
};

export default invoiceService;