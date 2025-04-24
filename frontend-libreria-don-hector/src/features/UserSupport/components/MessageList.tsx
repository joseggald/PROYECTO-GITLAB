import { useState } from 'react';
import { TicketMessage } from '../types/tickets.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';

interface MessageListProps {
  messages: TicketMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  empleadoNombre?: string;
  estado?: string;
}

export const MessageList = ({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  empleadoNombre = 'Soporte',
  estado = ''
}: MessageListProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-medium text-gray-900">Conversación del ticket</h3>
        {empleadoNombre && (
          <p className="text-sm text-gray-600 mt-1">
            Atendido por: <span className="font-medium">{empleadoNombre}</span>
          </p>
        )}
      </div>
      
      <div className="p-4 space-y-4 h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
          </div>
        ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
            No hay mensajes aún
            </div>
          ) : (
            messages
            .filter((message) => message !== null && message !== undefined)
            .map((message) => (
            <div 
              key={message.id_mensaje} 
              className={`flex ${message.remitente_tipo === 'Cliente' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.remitente_tipo === 'Cliente' ? 'bg-yellow-50' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {message.nombre_remitente?.charAt(0) || message.remitente_tipo.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {message.remitente_tipo === 'Cliente' ? 'Tú' : message.nombre_remitente || empleadoNombre}
                  </span>
                </div>
                <p className="text-sm">{message.mensaje}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.fecha_envio).toLocaleTimeString('es-GT', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
            disabled={isSending}
          />
            <Button 
            type="submit" 
            size="icon"
            className="bg-yellow-700 hover:bg-yellow-800"
            disabled={!newMessage.trim() || isSending || estado === 'Cancelado' || estado === 'Resuelto'}
            >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            </Button>
        </div>
      </form>
    </div>
  );
};