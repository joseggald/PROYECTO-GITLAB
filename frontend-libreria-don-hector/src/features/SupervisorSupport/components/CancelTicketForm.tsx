import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CancelTicketFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (razon: string) => void;
  isLoading?: boolean;
}

export const CancelTicketForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: CancelTicketFormProps) => {
  const [razon, setRazon] = useState('');

  const handleSubmit = () => {
    if (!razon.trim()) return;
    onSubmit(razon);
    setRazon('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Por favor ingresa el motivo de la cancelación:</p>
          <Textarea
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
            placeholder="Motivo de cancelación..."
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!razon.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};