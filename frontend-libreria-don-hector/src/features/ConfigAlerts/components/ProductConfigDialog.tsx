import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConfigAlerts } from '../hooks/userConfigAlerts';
import { Product } from '../types/config.types';
import { toast } from '@/hooks/Toast/use-toast';

interface ProductConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface ProductConfigDialogProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export const ProductConfigDialog: React.FC<ProductConfigDialogProps> = ({ isOpen, onClose, product }) => {
    const [stockMinimo, setStockMinimo] = useState<number>(product.stock_minimo);
    const { updateProductMutation } = useConfigAlerts();

    const handleSubmit = () => {    
            updateProductMutation.mutate({ id_producto: product.id_producto, stockMinimo }, {
                onSuccess: () => {
                    toast({
                        title: "¡Alerta Creadda!",
                        description: `Se a creado una alerta para el producto ${product.nombre}`
                      });
                    onClose();
                }
            });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configuración por Producto</DialogTitle>
                    <DialogDescription>
                        Ingrese el nuevo valor de stock mínimo para {product.nombre}.
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

export default ProductConfigDialog;