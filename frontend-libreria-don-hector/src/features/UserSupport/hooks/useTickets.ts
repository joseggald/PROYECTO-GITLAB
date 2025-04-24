import { useState, useEffect } from 'react';
import { ticketsService } from '../services/tickets.service';
import { Ticket, TicketMessage } from '../types/tickets.types';
import { toast } from '@/hooks/Toast/use-toast';
import { useAuthStore } from "@/store/auth/auth.store";

export const useTickets = () => {
  const { user } = useAuthStore();
  const id_cliente = user?.id_cliente;
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState({
    tickets: false,
    messages: false,
    submitting: false
  });
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!id_cliente) return;
    
    setIsLoading(prev => ({ ...prev, tickets: true }));
    setError(null);
    
    try {
      const data = await ticketsService.getClientTickets(id_cliente);
      setTickets(data);
    } catch {
      setError('Error al cargar los tickets');
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, tickets: false }));
    }
  };

  const fetchMessages = async (ticketId: number) => {
    setIsLoading(prev => ({ ...prev, messages: true }));
    try {
      const data = await ticketsService.getTicketMessages(ticketId);
      setMessages(data);
    } catch  {
      setError('Error al cargar los mensajes');
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, messages: false }));
    }
  };

  const createNewTicket = async (ticketData: {
    asunto: string;
    descripcion: string;
    categoria: string;
    id_producto?: number;
    archivo_adjunto?: string;
  }) => {
    if (!id_cliente) return;
    
    setIsLoading(prev => ({ ...prev, submitting: true }));
    try {
      const newTicket = await ticketsService.createTicket({
        ...ticketData,
        id_cliente
      });
      
      setTickets(prev => [newTicket, ...prev]);
      toast({
        title: "Ticket creado",
        description: "Tu ticket ha sido creado exitosamente",
        variant: "default",
      });
      return newTicket;
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const sendNewMessage = async (message: string) => {
    if (!selectedTicket || !id_cliente) return;
    
    setIsLoading(prev => ({ ...prev, submitting: true }));
    try {
      const newMessage = await ticketsService.sendMessage({
        id_ticket: selectedTicket.id_ticket,
        remitente_tipo: 'Cliente',
        remitente_id: id_cliente,
        mensaje: message,
        id_usuario: id_cliente
      });
      
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const updateTicketStatus = async (estado: string, razon?: string) => {
    if (!selectedTicket) return;
    
    setIsLoading(prev => ({ ...prev, submitting: true }));
    try {
      const updatedTicket = await ticketsService.updateTicketStatus(
        selectedTicket.id_ticket,
        estado,
        razon
      );
      
      setTickets(prev => prev.map(t => 
        t.id_ticket === updatedTicket.id_ticket ? updatedTicket : t
      ));
      setSelectedTicket(updatedTicket);
      toast({
        title: "Estado actualizado",
        description: `El ticket ha sido marcado como ${estado}`,
        variant: "default",
      });
      return updatedTicket;
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [id_cliente]);

  return {
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
    sendNewMessage,
    updateTicketStatus
  };
};