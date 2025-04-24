// /features/Checkout/components/ClientSelector.tsx
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, Users, UserCheck } from 'lucide-react';
import { serviceApi } from '@/services/auth';
import { LoadingOverlay } from '@/components/Loader/Loader';

interface Client {
  id_cliente: number;
  nombre: string;
  apellido: string;
  id_rol: number;
  edad: number;
  fecha_registro: string;
}

interface ClientSelectorProps {
  onSelectClient: (clientId: number | null) => void;
  selectedClientId: number | null;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  onSelectClient, 
  selectedClientId 
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const { data } = await serviceApi.get('/users/getAllCliente');
        setClients(data.data.clients || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <Card className="mb-6 overflow-hidden border-yellow-100 hover:border-yellow-200 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-gray-50 border-b pb-3">
        <CardTitle className="text-md flex items-center text-yellow-800">
          <Users className="mr-2 h-5 w-5 text-yellow-600" />
          Cliente para la Venta
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <LoadingOverlay />
            <p className="mt-2 text-sm text-gray-600">Cargando clientes...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Label htmlFor="client-select">Selecciona el cliente:</Label>
            <Select
              value={selectedClientId?.toString() || undefined}
              onValueChange={(value) => onSelectClient(value ? parseInt(value) : null)}
            >
              <SelectTrigger id="client-select" className="w-full border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50">
                <SelectValue placeholder="Elige un cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <span>Elige un Cliente</span>
                  </div>
                </SelectItem>
                
                {clients.map((client) => (
                  <SelectItem key={client.id_cliente} value={client.id_cliente.toString()}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-yellow-600" />
                      <span>{client.nombre} {client.apellido}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <p className="text-xs text-gray-500 mt-2">
              {selectedClientId ? 
                "El cliente seleccionado se registrará como comprador en la factura." : 
                "Si no seleccionas un cliente, la venta se registrará como compra en tienda."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;