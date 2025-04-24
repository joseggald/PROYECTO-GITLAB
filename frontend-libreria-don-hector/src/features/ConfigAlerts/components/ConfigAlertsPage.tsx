import React, { useState } from 'react';
import { useConfigAlerts } from '../hooks/userConfigAlerts';
import GeneralConfigDialog from './GeneralConfigDialog';
import ProductList from './ProductList';
import { Card } from '@/components/ui/card';
import { Settings, Package } from 'lucide-react';

const ConfigAlertsPage: React.FC = () => {
  const { products, isLoading, isError } = useConfigAlerts();
  const [isGeneralConfigOpen, setIsGeneralConfigOpen] = useState(false);

  if (isLoading) {
    return <div>Cargando productos...</div>;
  }

  if (isError) {
    return <div>Error al cargar los productos.</div>;
  }

return (
    <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-yellow-800 mb-6">Configuración de Alertas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
                className="p-6 bg-yellow-100 cursor-pointer"
                onClick={() => setIsGeneralConfigOpen(true)}
            >
                <div className="flex items-center gap-2">
                    <Settings className="h-6 w-6 text-yellow-600" />
                    <h2 className="text-xl font-semibold text-yellow-800">Configuración General</h2>
                </div>
                <p className="text-yellow-700">Actualizar el stock mínimo de todos los productos.</p>
            </Card>
            <Card className="p-6 bg-yellow-100">
                <div className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-yellow-600" />
                    <h2 className="text-xl font-semibold text-yellow-800">Configuración por Producto</h2>
                </div>
                <p className="text-yellow-700 mb-4">Actualizar el stock mínimo de productos individuales.</p>
                <ProductList products={products} />
            </Card>
        </div>
        <GeneralConfigDialog
            isOpen={isGeneralConfigOpen}
            onClose={() => setIsGeneralConfigOpen(false)}
        />
    </div>
);
};

export default ConfigAlertsPage;