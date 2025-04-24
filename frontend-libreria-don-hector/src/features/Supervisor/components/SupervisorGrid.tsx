import React from 'react';
import { Supervisor } from '../types/supervisor.types';
import SupervisorCard from './SupervisorCard';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Search } from 'lucide-react';
import { LoadingOverlay } from '@/components/Loader/Loader';

interface SupervisorGridProps {
  supervisors: Supervisor[];
  isLoading: boolean;
  isError: boolean;
  onView: (supervisor: Supervisor) => void;
  onEdit: (supervisor: Supervisor) => void;
  onDeactivate: (supervisor: Supervisor) => void;
  onCreateNew: () => void;
  formatDate: (date: string) => string;
}

const SupervisorGrid: React.FC<SupervisorGridProps> = ({
  supervisors,
  isLoading,
  isError,
  onView,
  onEdit,
  onDeactivate,
  onCreateNew,
  formatDate
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingOverlay/>
        <p className="mt-4 text-gray-600">Cargando supervisores...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Error al cargar los supervisores</h3>
        <p className="mt-2 text-gray-600">
          Lo sentimos, ha ocurrido un error al cargar los supervisores. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {supervisors.length} {supervisors.length === 1 ? 'Supervisor' : 'Supervisores'}
        </h2>
        <Button 
          onClick={onCreateNew}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Supervisor
        </Button>
      </div>

      {supervisors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-yellow-100 text-yellow-800 rounded-full p-3 mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No hay supervisores registrados</h3>
          <p className="mt-2 text-gray-600 max-w-md">
            No se encontraron supervisores en el sistema. Puedes crear un nuevo supervisor usando el botón "Nuevo Supervisor".
          </p>
          <Button 
            onClick={onCreateNew}
            className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Supervisor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {supervisors.map((supervisor) => (
            <SupervisorCard
              key={supervisor.id_supervisor}
              supervisor={supervisor}
              onView={onView}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SupervisorGrid;
