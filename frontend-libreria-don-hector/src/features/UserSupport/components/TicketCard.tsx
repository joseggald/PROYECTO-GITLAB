import { Ticket } from '../types/tickets.types';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Check, X } from 'lucide-react';
import { ticketsService } from '../services/tickets.service';

interface TicketCardProps {
  ticket: Ticket;
  onViewMessages: () => void;
  className?: string;
}

const STATUS_ICONS = {
  'Pendiente': <Clock className="h-4 w-4 text-yellow-600" />,
  'En Proceso': <MessageSquare className="h-4 w-4 text-blue-600" />,
  'Resuelto': <Check className="h-4 w-4 text-green-600" />,
  'Cancelado': <X className="h-4 w-4 text-red-600" />,
};

export const TicketCard = ({ ticket, onViewMessages, className = '' }: TicketCardProps) => {
  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white ${className}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{ticket.asunto}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              {ticket.categoria}
            </span>
            {ticket.empleado_nombre && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-800">
                Asignado a: {ticket.empleado_nombre}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {STATUS_ICONS[ticket.estado]}
          <span className={`text-xs px-2 py-1 rounded-full ${ticketsService.STATUS_COLORS[ticket.estado]}`}>
            {ticket.estado}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mt-2 line-clamp-2">{ticket.descripcion}</p>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">
          {new Date(ticket.fecha_creacion).toLocaleDateString('es-GT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>
        
        
          <Button 
            variant="outline" 
            size="sm"
            className="border-yellow-600 text-yellow-700 hover:bg-yellow-700 hover:text-white"
            onClick={onViewMessages}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensajes
          </Button>
      </div>
    </div>
  );
};