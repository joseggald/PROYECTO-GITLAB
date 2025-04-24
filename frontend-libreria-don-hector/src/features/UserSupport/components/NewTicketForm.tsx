import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { Ticket } from '../types/tickets.types';

interface NewTicketFormProps {
  onCreate: (data: {
    asunto: string;
    descripcion: string;
    categoria: string;
    id_producto?: number;
    archivo_adjunto?: string;
  }) => Promise<Ticket | undefined>;
  onClose: () => void;
}

const CATEGORIAS = [
  'Consulta de Productos',
  'Problemas con la Pagina',
  'Reembolso'
];

export const NewTicketForm = ({ onCreate, onClose }: NewTicketFormProps) => {
  const [formData, setFormData] = useState({
    asunto: '',
    descripcion: '',
    categoria: CATEGORIAS[0],
    id_producto: undefined as number | undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 border-yellow-300">
      <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-yellow-800">Nuevo Ticket de Soporte</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-500 hover:text-yellow-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asunto">Asunto *</Label>
            <Input
              id="asunto"
              value={formData.asunto}
              onChange={(e) => setFormData({...formData, asunto: e.target.value})}
              required
              placeholder="Ej: Problema con mi pedido #12345"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría *</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => setFormData({...formData, categoria: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción detallada *</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              required
              rows={5}
              placeholder="Describe tu problema o consulta con todos los detalles necesarios..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="id_producto">Número de producto (opcional)</Label>
            <Input
              id="id_producto"
              type="number"
              value={formData.id_producto || ''}
              onChange={(e) => setFormData({
                ...formData, 
                id_producto: e.target.value ? parseInt(e.target.value) : undefined
              })}
              placeholder="Ej: 12345"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-yellow-700 hover:bg-yellow-800"
              disabled={isSubmitting || !formData.asunto || !formData.descripcion}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Enviar Ticket
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};