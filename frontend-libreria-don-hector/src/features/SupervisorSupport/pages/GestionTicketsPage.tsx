import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useGestionTickets } from '../hooks/useGestionTickets';
import { TicketList } from '../components/TicketList';
import { AssignEmployeeModal } from '../components/AssignEmployeeModal';
import { CancelTicketForm } from '../components/CancelTicketForm';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const GestionTicketsPage = () => {
  const {
    pendingTickets,
    inProgressTickets,
    approvalTickets,
    employees,
    isLoading,
    error,
    cancelTicket,
    assignEmployee,
    completeTicket
  } = useGestionTickets();

  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);

  const handleAssign = (id_empleado: number) => {
    if (!selectedTicket) return;
    assignEmployee(selectedTicket, id_empleado);
    setShowAssignModal(false);
  };

  const handleCancel = (razon: string) => {
    if (!selectedTicket) return;
    cancelTicket(selectedTicket, razon);
  };

  const handleComplete = (id_ticket: number) => {
    completeTicket(id_ticket);
  };

  if (isLoading.tickets || isLoading.employees) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

return (
    <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Tickets</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tickets Pendientes */}
            <div>
                <Card className="h-full">
                    <CardHeader className="bg-yellow-100">
                        <CardTitle className="text-yellow-700">Tickets Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                            <TicketList
                                tickets={pendingTickets}
                                onAssign={(id) => {
                                    setSelectedTicket(id);
                                    setShowAssignModal(true);
                                }}
                                onCancel={(id) => {
                                    setSelectedTicket(id);
                                    setShowCancelForm(true);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tickets en Aprobación y en Proceso */}
            <div className="flex flex-col gap-6">
                <Card className="flex-1">
                    <CardHeader className="bg-purple-100">
                        <CardTitle className="text-purple-700">Tickets en Aprobación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                            <TicketList
                                tickets={approvalTickets}
                                onComplete={handleComplete}
                                onAssign={() => {}}
                                onCancel={() => {}}
                                showCompleteButton
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader className="bg-blue-100">
                        <CardTitle className="text-blue-700">Tickets en Proceso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                            <TicketList
                                tickets={inProgressTickets}
                                onAssign={(id) => {
                                    setSelectedTicket(id);
                                    setShowAssignModal(true);
                                }}
                                onCancel={(id) => {
                                    setSelectedTicket(id);
                                    setShowCancelForm(true);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Modales */}
        <AssignEmployeeModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            employees={employees}
            onAssign={handleAssign}
            isLoading={isLoading.actions}
        />

        <CancelTicketForm
            isOpen={showCancelForm}
            onClose={() => setShowCancelForm(false)}
            onSubmit={handleCancel}
            isLoading={isLoading.actions}
        />
    </div>
);
};