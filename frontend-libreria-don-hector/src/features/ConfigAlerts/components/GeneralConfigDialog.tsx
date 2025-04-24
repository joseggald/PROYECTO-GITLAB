import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConfigAlerts } from '../hooks/userConfigAlerts';

interface GeneralConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeneralConfigDialog: React.FC<GeneralConfigDialogProps> = ({ isOpen, onClose }) => {
  const [stockMinimo, setStockMinimo] = useState<number>(0);
  const { bulkUpdateMutation } = useConfigAlerts();

  const handleSubmit = () => {    
      bulkUpdateMutation.mutate(stockMinimo);
      onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuración General</DialogTitle>
          <DialogDescription>
            Ingrese el nuevo valor de stock mínimo para todos los productos.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="number"
          min="0"
          value={stockMinimo}
          onChange={(e) => setStockMinimo(Number(e.target.value))}
          placeholder="Stock mínimo"
        />
        <DialogFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralConfigDialog;