import { useState } from 'react';
import { TicketMessage } from '../types/support.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: TicketMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
  disabledMessage?: string;
}

export const MessageList = ({
  messages,
  onSendMessage,
  isLoading = false,
  isDisabled = false,
  disabledMessage = 'No se pueden enviar mensajes en tickets resueltos o en espera de aprobación'
}: MessageListProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || isDisabled) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    console.log(messages),
    <div className="flex flex-col h-full">
      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
            No hay mensajes aún
            </div>
          ) : (
            messages
            .filter((message) => message !== undefined && message !== null)
            .map((message) => (
            <div
              key={message.id_mensaje}
              className={cn(
                'flex gap-3',
                message.remitente_tipo === 'Empleado' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.remitente_tipo === 'Cliente' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">
                    {message.nombre_remitente}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  'max-w-xs md:max-w-md rounded-lg p-3',
                  message.remitente_tipo === 'Empleado'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.remitente_tipo === 'Empleado' && (
                    <span className="font-medium">Tú</span>
                  )}
                  {message.remitente_tipo === 'Cliente' && (
                    <span className="font-medium">{message.nombre_remitente}</span>
                  )}
                </div>
                <p className="text-sm">{message.mensaje}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(message.fecha_envio).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario de envío */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
        {isDisabled && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-2 mb-2 rounded text-center">
            {disabledMessage}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
            disabled={isDisabled || isSending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || isDisabled || isSending}
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