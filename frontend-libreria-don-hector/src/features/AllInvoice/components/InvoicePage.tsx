import React from 'react';
import { useInvoices } from '../hooks/useInvoices';
import InvoiceTable from '../components/InvoiceTable';
import InvoiceDetailsDialog from '../components/InvoiceDetailsDialog';
import { Card } from '@/components/ui/card';

const InvoicePage: React.FC = () => {
  const {
    invoices,
    selectedInvoice,
    filters,
    setFilters,
    isDetailsDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,
    downloadInvoicePDF,
  } = useInvoices();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Facturas</h1>
      
      <Card className="p-6">
        <InvoiceTable
          invoices={invoices}
          onView={openDetailsDialog}
          onDownload={downloadInvoicePDF}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Card>
      
      <InvoiceDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default InvoicePage;