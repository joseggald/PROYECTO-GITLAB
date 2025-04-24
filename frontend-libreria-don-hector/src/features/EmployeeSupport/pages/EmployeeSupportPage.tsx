import { useEmployeeSupport } from '../hooks/useEmployeeSupport';
import { EmployeeTicketCard } from '../components/EmployeeTicketCard';
import { MessageList } from '../components/MessageList';
import { TicketActions } from '../components/TicketActions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox, RefreshCw } from 'lucide-react';



function EmployeeSupportPage() {
  const {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    setSelectedTicket,
    sendMessage,
    updateStatus,
    fetchTickets
  } = useEmployeeSupport();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Soporte - Panel de Empleado</h1>
        <Button onClick={fetchTickets} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Tickets */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Tickets Asignados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading.tickets ? (
                <p>Cargando tickets...</p>
              ) : tickets.length === 0 ? (
                <p>No hay tickets asignados</p>
              ) : (
                tickets.map(ticket => (
                  <EmployeeTicketCard
                    key={ticket.id_ticket}
                    ticket={ticket}
                    isSelected={selectedTicket?.id_ticket === ticket.id_ticket}
                    onSelect={() => setSelectedTicket(ticket)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detalles del Ticket */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTicket ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{selectedTicket.asunto}</CardTitle>
                    <TicketActions
                      status={selectedTicket.estado}
                      onStatusChange={updateStatus}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <MessageList
                  messages={messages}
                  onSendMessage={sendMessage}
                  isLoading={isLoading.messages || isLoading.action}
                  isDisabled={selectedTicket.estado === 'Resuelto' || selectedTicket.estado === 'Aprobación'}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Seleccione un ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Seleccione un ticket de la lista para ver los detalles y mensajes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeSupportPage;