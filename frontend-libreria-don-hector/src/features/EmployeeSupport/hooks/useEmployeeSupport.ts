import { useState, useEffect } from 'react';
import { EmployeeSupportService } from '../services/employeeSupport.service';
import { Ticket, TicketMessage } from '../types/support.types';
import { useAuthStore } from "@/store/auth/auth.store";
import { toast } from '@/hooks/Toast/use-toast';

export const useEmployeeSupport = () => {
  const { user } = useAuthStore();
  const empleadoId = user?.id_empleado;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState({
    tickets: false,
    messages: false,
    action: false
  });

  const fetchTickets = async () => {
    if (!empleadoId) return;

    setIsLoading(prev => ({ ...prev, tickets: true }));
    try {
      const tickets = await EmployeeSupportService.getAssignedTickets(empleadoId);
      setTickets(tickets);
    } catch{
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets asignados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, tickets: false }));
    }
  };

  const fetchMessages = async (ticketId: number) => {
    if (!selectedTicket) return;

    setIsLoading(prev => ({ ...prev, messages: true }));
    try {
      if (!empleadoId) return;
      const { messages } = await EmployeeSupportService.getTicketDetails(ticketId, empleadoId);
      setMessages(messages);
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, messages: false }));
    }
  };

  const sendMessage = async (message: string) => {
    if (!selectedTicket || !empleadoId) return;

    setIsLoading(prev => ({ ...prev, action: true }));
    try {
      const newMessage = await EmployeeSupportService.sendMessage({
        id_ticket: selectedTicket.id_ticket,
        mensaje: message,
        id_empleado: empleadoId
      });
      setMessages(prev => [...prev, newMessage]);
    } catch{
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, action: false }));
    }
  };

  const updateStatus = async (estado: string) => {
    if (!selectedTicket || !empleadoId) return;

    setIsLoading(prev => ({ ...prev, action: true }));
    try {
      const updatedTicket = await EmployeeSupportService.updateTicketStatus(
        selectedTicket.id_ticket
      );
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id_ticket === updatedTicket.id_ticket ? updatedTicket : ticket
        )
      );
      setSelectedTicket(updatedTicket);

      toast({
        title: "Estado actualizado",
        description: `El ticket ha sido marcado como ${estado}`,
        variant: "default",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, action: false }));
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [empleadoId]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id_ticket);
    }
  }, [selectedTicket]);

  return {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    setSelectedTicket,
    sendMessage,
    updateStatus,
    fetchTickets
  };
};