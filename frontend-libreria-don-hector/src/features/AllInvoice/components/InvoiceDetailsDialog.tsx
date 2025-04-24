import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Invoice } from '../types/invoice.types';
import { Button } from '@/components/ui/button';

interface InvoiceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const InvoiceDetailsDialog: React.FC<InvoiceDetailsDialogProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  if (!invoice) return null;

return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Detalles de la Factura</DialogTitle>
                <DialogDescription>
                    Información detallada de la factura #{invoice.id_factura}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-semibold">Comprador:</h3>
                        <p>{invoice.nombre_comprador}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Fecha de Emisión:</h3>
                        <p>
                            {new Date(invoice.fecha_emision).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Total:</h3>
                        <p>${invoice.total_venta}</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold">Productos:</h3>
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoice.detalles.map((detalle) => (
                                    <tr key={detalle.id_producto}>
                                        <td className="px-6 py-4 whitespace-nowrap">{detalle.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{detalle.cantidad}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${detalle.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
};

export default InvoiceDetailsDialog;