import { Ticket } from '../types/gestionTickets.types';
import { Button } from '@/components/ui/button';
import {  Check, X, UserPlus } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onAssign: (id_ticket: number) => void;
  onCancel: (id_ticket: number) => void;
  onComplete?: (id_ticket: number) => void;
  showCompleteButton?: boolean;
}

export const TicketList = ({
  tickets,
  onAssign,
  onCancel,
  onComplete,
  showCompleteButton = false
}: TicketListProps) => {
  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <div key={ticket.id_ticket} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{ticket.asunto}</h3>
              <p className="text-sm text-gray-600 mt-1">{ticket.descripcion}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  ticket.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  ticket.estado === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                  ticket.estado === 'Aprobación' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.estado}
                </span>
                {ticket.empleado_nombre && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                    Asignado a: {ticket.empleado_nombre}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {ticket.estado === 'Pendiente' && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onAssign(ticket.id_ticket)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Asignar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onCancel(ticket.id_ticket)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
              {showCompleteButton && ticket.estado === 'Aprobación' && (
                <Button variant="default" size="sm" onClick={() => onComplete?.(ticket.id_ticket)}>
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};