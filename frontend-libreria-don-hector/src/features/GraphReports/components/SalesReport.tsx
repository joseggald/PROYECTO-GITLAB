import React, { useState } from 'react';
import { Sale } from '../types/report.types';
import { TopProductsChart, SalesComparisonChart, SalesByCategoryChart } from './ReportCharts';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Calendar, Tag } from 'lucide-react';

interface SalesReportProps {
  salesReport: Sale[];
}

export const SalesReport: React.FC<SalesReportProps> = ({ salesReport }) => {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    // Procesar datos para gráficos
    const topProducts = salesReport
        .flatMap(sale => sale.detalles)
        .reduce((acc, detail) => {
            const product = acc.find(p => p.nombre === detail.nombre);
            if (product) {
                product.cantidad += detail.cantidad;
            } else {
                acc.push({ nombre: detail.nombre, cantidad: detail.cantidad });
            }
            return acc;
        }, [] as { nombre: string; cantidad: number }[])
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

    const salesByPeriod = salesReport.map(sale => ({
        periodo: new Date(sale.fecha_emision).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        total_venta: parseFloat(sale.total_venta),
    }));

    const salesByCategory = salesReport
        .flatMap(sale => sale.detalles)
        .reduce((acc, detail) => {
            const category = acc.find(c => c.categoria === detail.categoria);
            if (category) {
                category.total_venta += parseFloat(detail.subtotal.toString());
            } else {
                acc.push({ categoria: detail.categoria, total_venta: parseFloat(detail.subtotal.toString()) });
            }
            return acc;
        }, [] as { categoria: string; total_venta: number }[]);

    return (
        <Card className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Reporte de Ventas</h2>
            <div className="grid grid-cols-1 gap-6">
                <Card
                    className="p-6 cursor-pointer hover:bg-blue-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={() => setSelectedReport(selectedReport === 'topProducts' ? null : 'topProducts')}
                >
                    <div className="flex items-center gap-4">
                        <ShoppingCart className="h-8 w-8 text-blue-600" />
                        <h3 className="text-2xl font-semibold text-gray-700">Productos más vendidos</h3>
                    </div>
                    {selectedReport === 'topProducts' && (
                        <div className="flex justify-center mt-4">
                            <TopProductsChart data={topProducts} />
                        </div>
                    )}
                </Card>
                <Card
                    className="p-6 cursor-pointer hover:bg-green-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={() => setSelectedReport(selectedReport === 'salesComparison' ? null : 'salesComparison')}
                >
                    <div className="flex items-center gap-4">
                        <Calendar className="h-8 w-8 text-green-600" />
                        <h3 className="text-2xl font-semibold text-gray-700">Comparación de ventas por período</h3>
                    </div>
                    {selectedReport === 'salesComparison' && (
                        <div className="flex justify-center mt-4">
                            <SalesComparisonChart data={salesByPeriod} />
                        </div>
                    )}
                </Card>
                <Card
                    className="p-6 cursor-pointer hover:bg-purple-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={() => setSelectedReport(selectedReport === 'salesByCategory' ? null : 'salesByCategory')}
                >
                    <div className="flex items-center gap-4">
                        <Tag className="h-8 w-8 text-purple-600" />
                        <h3 className="text-2xl font-semibold text-gray-700">Volumen de ventas por categoría</h3>
                    </div>
                    {selectedReport === 'salesByCategory' && (
                        <div className="flex justify-center mt-4">
                            <SalesByCategoryChart data={salesByCategory} />
                        </div>
                    )}
                </Card>
            </div>
        </Card>
    );
};

export default SalesReport;