import React from 'react';
import { useAlerts } from '../hooks/userAlerts';
import AlertTable from '../components/AlertTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AlertPage: React.FC = () => {
  const {
    lowStockProducts,
    isLoading,
    isError,
    refetch, // Método para recargar los datos
  } = useAlerts();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mt-4 text-gray-600">Cargando productos con stock bajo...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
          <span>⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Error al cargar los productos</h3>
        <p className="mt-2 text-gray-600">
          Lo sentimos, ha ocurrido un error al cargar los productos con stock bajo. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Alertas de Stock Bajo</h1>
      
      <Card className="p-6">
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </div>
        <AlertTable lowStockProducts={lowStockProducts} />
      </Card>
    </div>
  );
};

export default AlertPage;