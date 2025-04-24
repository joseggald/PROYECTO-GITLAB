import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Supervisor } from '../types/supervisor.types';
import { User, Mail, Eye, Edit, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SupervisorCardProps {
  supervisor: Supervisor;
  onView: (supervisor: Supervisor) => void;
  onEdit: (supervisor: Supervisor) => void;
  onDeactivate: (supervisor: Supervisor) => void;
  formatDate: (date: string) => string;
}

export const SupervisorCard: React.FC<SupervisorCardProps> = ({
  supervisor,
  onView,
  onEdit,
  onDeactivate,
  formatDate
}) => {
  const isActive = supervisor.estado !== "1";

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 border border-gray-200 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-900/10 bg-white group">
      <CardContent className="flex-grow flex flex-col gap-2 p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 p-2 rounded-full">
              <User className="h-5 w-5 text-yellow-700" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800 transition-colors duration-300">
              {supervisor.nombre} {supervisor.apellido}
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
            <span className="font-medium">{supervisor.cui}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="inline-block w-24 text-gray-500">Telefono:</span>
            <span className="font-medium">{supervisor.telefono}</span>
          </div>
          
          {supervisor.correo_electronico && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-1 text-gray-500" />
              <span className="font-medium overflow-hidden text-ellipsis">
                {supervisor.correo_electronico}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="inline-block w-24 text-gray-500">Ingreso:</span>
            <span className="font-medium">{formatDate(supervisor.fecha_ingreso)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-700 hover:text-white"
            onClick={() => onView(supervisor)}
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
                onClick={() => onEdit(supervisor)}
              >
                <Edit className="h-4 w-4 mr-1" />
                <span>Editar</span>
              </Button>
              { supervisor.estado =="0" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-red-600 text-red-700 hover:bg-red-700 hover:text-white"
                onClick={() => onDeactivate(supervisor)}
              >
                <UserX className="h-4 w-4 mr-1" />
                <span>Desactivar</span>
              </Button>)}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SupervisorCard;