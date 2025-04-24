import React from 'react';
import { Employee } from '../types/employee.types';
import EmployeeCard from './EmployeeCard';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Search } from 'lucide-react';
import { LoadingOverlay } from '@/components/Loader/Loader';

interface EmployeeGridProps {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onCreateNew: () => void;
  formatDate: (date: string) => string;
  onViewInvoices: (employee: Employee) => void;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  isLoading,
  isError,
  onView,
  onEdit,
  onDeactivate,
  onCreateNew,
  formatDate,
  onViewInvoices
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingOverlay/>
        <p className="mt-4 text-gray-600">Cargando empleados...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Error al cargar los empleados</h3>
        <p className="mt-2 text-gray-600">
          Lo sentimos, ha ocurrido un error al cargar los empleados. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
           {employees.length === 1 ? 'Empleado' : 'Empleados'} {employees.length}
        </h2>
        <Button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-blue-100 text-blue-800 rounded-full p-3 mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No hay empleados registrados</h3>
          <p className="mt-2 text-gray-600 max-w-md">
            No se encontraron empleados en el sistema. Puedes crear un nuevo empleado usando el botón "Nuevo Empleado".
          </p>
          <Button 
            onClick={onCreateNew}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Empleado
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id_empleado}
              employee={employee}
              onView={onView}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
              onViewInvoices={onViewInvoices}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeGrid;
