import { ClientInfo } from '../types/support.types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ClientInfoCardProps {
  client: ClientInfo;
}

export const ClientInfoCard = ({ client }: ClientInfoCardProps) => {
  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t">
      <Avatar>
        <AvatarFallback>
          {client.nombre.charAt(0)}{client.apellido.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {client.nombre} {client.apellido}
        </p>
        <p className="text-sm text-gray-600">Cliente #{client.id_cliente}</p>
      </div>
    </div>
  );
};