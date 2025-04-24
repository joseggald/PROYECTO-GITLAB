import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice.service';
import { Invoice } from '../types/invoice.types';
import { toast } from '@/hooks/Toast/use-toast';

export const INVOICES_QUERY_KEYS = {
  all: ['invoices'] as const,
};

export const useInvoices = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    id_factura: '',
    nombre_comprador: '',
    fecha_emision: '',
  });

  // Query para obtener todas las facturas
  const { 
    data: invoices = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: INVOICES_QUERY_KEYS.all,
    queryFn: invoiceService.getAllInvoices,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Filtrar facturas
  const filteredInvoices = invoices.filter((invoice) => {
    return (
      (!filters.id_factura || invoice.id_factura.toString().includes(filters.id_factura)) &&
      (!filters.nombre_comprador || invoice.nombre_comprador.toLowerCase().includes(filters.nombre_comprador.toLowerCase())) &&
      (!filters.fecha_emision || invoice.fecha_emision.includes(filters.fecha_emision))
    );
  });

  // Handler para abrir el diálogo de detalles
  const openDetailsDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsDialogOpen(true);
  };

  // Handler para cerrar el diálogo de detalles
  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedInvoice(null);
  };

  // Handler para descargar el PDF de la factura
  const downloadInvoicePDF = async (id_factura: string) => {
    try {
      const pdfBlob = await invoiceService.generateInvoicePDF(id_factura);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura_${id_factura}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF de la factura.",
        variant: "destructive",
      });
    }
  };

  return {
    invoices: filteredInvoices,
    selectedInvoice,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    isDetailsDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,
    downloadInvoicePDF,
    refetch,
  };
};

export default useInvoices;