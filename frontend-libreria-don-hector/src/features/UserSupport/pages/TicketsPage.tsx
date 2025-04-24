import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Loader2 } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { TicketCard } from '../components/TicketCard';
import { MessageList } from '../components/MessageList';
import { NewTicketForm } from '../components/NewTicketForm';
import { useState } from 'react';



function TicketsPage() {
  const {
    tickets,
    messages,
    selectedTicket,
    isLoading,
    error,
    id_cliente,
    setSelectedTicket,
    fetchTickets,
    fetchMessages,
    createNewTicket,
    sendNewMessage
  } = useTickets();

  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!selectedTicket) return;
    await sendNewMessage(message);
  };

  if (!id_cliente) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No se pudo identificar tu cuenta</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white py-6 px-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="h-8 w-8" />
              Soporte al Cliente
            </h1>
            <p className="text-yellow-100 mt-2">
              Gestiona tus tickets de soporte y comunicación con nuestro equipo
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowNewTicketForm(true)}
              className="bg-white text-yellow-800 hover:bg-yellow-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Ticket
            </Button>
            <Button 
              onClick={fetchTickets}
              className="bg-white text-yellow-800 hover:bg-yellow-100"
            >
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <NewTicketForm 
          onCreate={createNewTicket}
          onClose={() => setShowNewTicketForm(false)}
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
            {isLoading.tickets ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
            </div>
            ) : error ? (
            <Card>
              <CardContent className="py-6 text-center">
              <p className="text-red-600">{error}</p>
              <Button 
                onClick={fetchTickets}
                className="mt-4 bg-yellow-700 hover:bg-yellow-800"
              >
                Reintentar
              </Button>
              </CardContent>
            </Card>
            ) : tickets?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mt-2">
                No tienes tickets creados
              </h3>
              <p className="text-gray-600 mt-1">
                Crea tu primer ticket para recibir asistencia
              </p>
              <Button 
                onClick={() => setShowNewTicketForm(true)}
                className="mt-4 bg-yellow-700 hover:bg-yellow-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Ticket
              </Button>
              </CardContent>
            </Card>
            ) : (
            tickets?.map(ticket => (
              ticket && (
              <TicketCard
                key={ticket.id_ticket}
                ticket={ticket}
                onViewMessages={() => {
                setSelectedTicket(ticket);
                fetchMessages(ticket.id_ticket);
                }}
                className={selectedTicket?.id_ticket === ticket.id_ticket ? 
                'ring-2 ring-yellow-500' : ''
                }
              />
              )
            ))
            )}
        </div>

        {/* Messages Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-white">
              <CardTitle className="text-yellow-800">
                {selectedTicket ? selectedTicket.asunto : 'Detalles del Ticket'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedTicket ? (
                isLoading.messages ? (
                    <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
                    </div>
                  ) : (
                    <MessageList 
                    messages={messages} 
                    onSendMessage={async (message) => {
                      await handleSendMessage(message);
                      fetchMessages(selectedTicket.id_ticket); 
                    }}
                    isLoading={isLoading.submitting}
                    empleadoNombre={selectedTicket.empleado_nombre}
                    estado={selectedTicket.estado}  
                    />
                  )
                  ) : (
                <div className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mt-2">
                    Selecciona un ticket
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Elige un ticket de la lista para ver los detalles y mensajes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TicketsPage;