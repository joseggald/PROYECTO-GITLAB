import { Ticket } from '../types/support.types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { ClientInfoCard } from './ClientInfoCard';

interface EmployeeTicketCardProps {
  ticket: Ticket;
  isSelected?: boolean;
  onSelect: () => void;
}

export const EmployeeTicketCard = ({
  ticket,
  isSelected,
  onSelect
}: EmployeeTicketCardProps) => {
  console.log('Ticket recibido:', ticket);
  return (
    <div className={`border rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-lg">{ticket.asunto}</h3>
          <p className="text-sm text-gray-600">{ticket.descripcion.substring(0, 100)}...</p>
          {ticket.cliente && <ClientInfoCard client={ticket.cliente} />}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={ticket.estado} />
          <Button variant="outline" size="sm" onClick={onSelect}>
            Ver Detalles
          </Button>
        </div>
      </div>
    </div>
  );
};