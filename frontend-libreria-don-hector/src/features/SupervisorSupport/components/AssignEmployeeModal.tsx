import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Employee } from '../types/gestionTickets.types';
import { Loader2 } from 'lucide-react';

interface AssignEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onAssign: (id_empleado: number) => void;
  isLoading?: boolean;
}

export const AssignEmployeeModal = ({
  isOpen,
  onClose,
  employees,
  onAssign,
  isLoading = false
}: AssignEmployeeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar empleado</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Selecciona un empleado para asignar el ticket:</p>
          <div className="space-y-2">
            {employees.map(employee => (
              <div key={employee.id_empleado} className="flex items-center justify-between p-2 border rounded">
                <span>{employee.nombre} {employee.apellido}</span>
                <Button 
                  size="sm" 
                  onClick={() => onAssign(employee.id_empleado)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Asignar'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};