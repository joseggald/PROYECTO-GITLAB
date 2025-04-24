import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee } from '../types/employee.types';
import { User, Mail, Eye, Edit, UserX, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EmployeeCardProps {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onViewInvoices: (employee: Employee) => void;
  formatDate: (date: string) => string;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onView,
  onEdit,
  onDeactivate,
  onViewInvoices,
  formatDate
}) => {
  const isActive = employee.estado !== "1";

return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 border border-gray-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10 bg-white group">
        <CardContent className="flex-grow flex flex-col gap-2 p-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-700" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
                        {employee.nombre} {employee.apellido}
                    </h3>
                </div>
                
                {!isActive && (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                        Inactivo
                    </Badge>
                )}
            </div>
            
            <div className="space-y-2 mt-2">
                <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-block w-24 text-gray-500">CUI:</span>
                    <span className="font-medium">{employee.cui}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-block w-24 text-gray-500">Telefono:</span>
                    <span className="font-medium">{employee.telefono}</span>
                </div>
                
                {employee.correo_electronico && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="font-medium overflow-hidden text-ellipsis">
                            {employee.correo_electronico}
                        </span>
                    </div>
                )}
                
                <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-block w-24 text-gray-500">Ingreso:</span>
                    <span className="font-medium">{employee.fecha_contratacion ? formatDate(employee.fecha_contratacion) : 'Fecha no disponible'}</span>
                </div>
            </div>
        </CardContent>
        
        <CardFooter className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-blue-600 text-blue-700 hover:bg-blue-700 hover:text-white"
                    onClick={() => onView(employee)}
                >
                    <Eye className="h-4 w-4 mr-1" />
                    <span>Ver</span>
                </Button>
                
                {isActive && (
                    <>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-blue-600 text-blue-700 hover:bg-blue-700 hover:text-white"
                            onClick={() => onEdit(employee)}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            <span>Editar</span>
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-red-600 text-red-700 hover:bg-red-700 hover:text-white"
                            onClick={() => onDeactivate(employee)}
                        >
                            <UserX className="h-4 w-4 mr-1" />
                            <span>Desactivar</span>
                        </Button>
                    </>
                )}
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-green-600 text-green-700 hover:bg-green-700 hover:text-white"
                    onClick={() => onViewInvoices(employee)}
                >
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Facturas</span>
                </Button>
            </div>
        </CardFooter>
    </Card>
);
};

export default EmployeeCard;
