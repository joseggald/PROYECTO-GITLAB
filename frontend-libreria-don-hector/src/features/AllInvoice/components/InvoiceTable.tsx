import React from 'react';
import { Invoice } from '../types/invoice.types';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface InvoiceTableProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onDownload: (id_factura: string) => void;
  filters: {
    id_factura: string;
    nombre_comprador: string;
    fecha_emision: string;
  };
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
    invoices,
    onView,
    onDownload,
    filters,
    onFilterChange,
}) => {
    const filteredInvoices = invoices.filter((invoice) => {
        return (
            invoice.id_factura.toString().includes(filters.id_factura) &&
            invoice.nombre_comprador.toLowerCase().includes(filters.nombre_comprador.toLowerCase()) &&
            invoice.fecha_emision.includes(filters.fecha_emision)
        );
    });

    const clearFilters = () => {
        onFilterChange({
            target: { name: 'id_factura', value: '' },
        } as React.ChangeEvent<HTMLInputElement>);
        onFilterChange({
            target: { name: 'nombre_comprador', value: '' },
        } as React.ChangeEvent<HTMLInputElement>);
        onFilterChange({
            target: { name: 'fecha_emision', value: '' },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Buscar por ID de factura"
                    name="id_factura"
                    value={filters.id_factura}
                    onChange={onFilterChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                    placeholder="Buscar por nombre del comprador"
                    name="nombre_comprador"
                    value={filters.nombre_comprador}
                    onChange={onFilterChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                    placeholder="Buscar por fecha de emisión"
                    name="fecha_emision"
                    type="date"
                    value={filters.fecha_emision}
                    onChange={onFilterChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button variant="outline" onClick={clearFilters} className="border-yellow-700 text-yellow-700 hover:bg-yellow-100">
                    Limpiar Filtros
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-yellow-700">
                        <tr>
                            <th className="px-4 py-2 border-b text-white">ID Factura</th>
                            <th className="px-4 py-2 border-b text-white">Fecha de Emisión</th>
                            <th className="px-4 py-2 border-b text-white">Comprador</th>
                            <th className="px-4 py-2 border-b text-white">Total</th>
                            <th className="px-4 py-2 border-b text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((invoice) => (
                                <tr key={invoice.id_factura} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b text-gray-600">{invoice.id_factura}</td>
                                    <td className="px-4 py-2 border-b text-gray-600">
                                        {new Date(invoice.fecha_emision).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-2 border-b text-gray-600">{invoice.nombre_comprador}</td>
                                    <td className="px-4 py-2 border-b text-gray-600">${invoice.total_venta}</td>
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onView(invoice)}
                                                className="border-yellow-700 text-yellow-700 hover:bg-yellow-100"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Ver
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDownload(invoice.id_factura.toString())}
                                                className="border-yellow-700 text-yellow-700 hover:bg-yellow-100"
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Descargar PDF
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-2 border-b text-center text-gray-600">
                                    {invoices.length === 0 ? 'No se encontraron facturas' : 'No hay coincidencias'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceTable;