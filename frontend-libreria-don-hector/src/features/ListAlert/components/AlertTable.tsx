import React from 'react';
import { AlertProduct } from '../types/alert.types';

interface AlertTableProps {
  lowStockProducts: AlertProduct[];
}

export const AlertTable: React.FC<AlertTableProps> = ({ lowStockProducts }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-yellow-600 text-white">
                        <th className="px-4 py-2 border bg-yellow-700">ID Producto</th>
                        <th className="px-4 py-2 border bg-yellow-700">Nombre</th>
                        <th className="px-4 py-2 border bg-yellow-700">Stock</th>
                        <th className="px-4 py-2 border bg-yellow-700">Stock Mínimo</th>
                    </tr>
                </thead>
                <tbody>
                    {lowStockProducts.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-4">No hay alertas</td>
                        </tr>
                    ) : (
                        lowStockProducts.map((product) => (
                            <tr key={product.id_producto} className="bg-yellow-100 hover:bg-yellow-200">
                                <td className="px-4 py-2 border">{product.id_producto}</td>
                                <td className="px-4 py-2 border">{product.nombre}</td>
                                <td className="px-4 py-2 border text-red-600">{product.stock}</td>
                                <td className="px-4 py-2 border">{product.stock_minimo}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AlertTable;