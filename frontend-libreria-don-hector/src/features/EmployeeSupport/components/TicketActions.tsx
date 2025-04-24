import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface TicketActionsProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export const TicketActions = ({ status, onStatusChange }: TicketActionsProps) => {
  return (
    <div className="flex gap-2">
      {status === 'En Proceso' && (
        <Button
          variant="default"
          size="sm"
          onClick={() => onStatusChange('Aprobación')}
        >
          <Check className="h-4 w-4 mr-2" />
          Solicitar Aprobación Resolucion
        </Button>
      )}
    </div>
  );
};