import { useState, useEffect } from 'react';
import { gestionTicketsService } from '../services/gestionTickets.service';
import { employeesService } from '../services/employees.service';
import { toast } from '@/hooks/Toast/use-toast';
import { Ticket, Employee } from '../types/gestionTickets.types';

export const useGestionTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
  const [inProgressTickets, setInProgressTickets] = useState<Ticket[]>([]);
  const [approvalTickets, setApprovalTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState({
    tickets: false,
    employees: false,
    actions: false
  });
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(prev => ({ ...prev, tickets: true, employees: true }));
    try {
      const [ticketsData, employeesData] = await Promise.all([
        gestionTicketsService.getAllTickets(),
        employeesService.getAllEmployees()
      ]);

      setTickets(ticketsData);
      setPendingTickets(ticketsData.filter(t => t.estado === 'Pendiente'));
      setInProgressTickets(ticketsData.filter(t => t.estado === 'En Proceso'));
      setApprovalTickets(ticketsData.filter(t => t.estado === 'Aprobación'));
      setEmployees(employeesData);
    } catch{
      setError('Error al cargar los datos');
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets o empleados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, tickets: false, employees: false }));
    }
  };

  const cancelTicket = async (id_ticket: number, razon: string) => {
    setIsLoading(prev => ({ ...prev, actions: true }));
    try {
      const updatedTicket = await gestionTicketsService.cancelTicket({ id_ticket, razon });
      setTickets(prev => prev.map(t => t.id_ticket === id_ticket ? updatedTicket : t));
      toast({
        title: "Ticket cancelado",
        description: "El ticket ha sido cancelado exitosamente",
        variant: "default",
      });
      await fetchData(); // Refrescar datos
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo cancelar el ticket",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const assignEmployee = async (id_ticket: number, id_empleado: number) => {
    setIsLoading(prev => ({ ...prev, actions: true }));
    try {
      const updatedTicket = await gestionTicketsService.assignEmployee({ id_ticket, id_empleado });
      setTickets(prev => prev.map(t => t.id_ticket === id_ticket ? updatedTicket : t));
      toast({
        title: "Ticket asignado",
        description: `El ticket ha sido asignado al empleado`,
        variant: "default",
      });
      await fetchData(); 
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo asignar el ticket",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const completeTicket = async (id_ticket: number) => {
    setIsLoading(prev => ({ ...prev, actions: true }));
    try {
      const updatedTicket = await gestionTicketsService.completeTicket(id_ticket);
      setTickets(prev => prev.map(t => t.id_ticket === id_ticket ? updatedTicket : t));
      toast({
        title: "Ticket completado",
        description: "El ticket ha sido marcado como resuelto",
        variant: "default",
      });
      await fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo completar el ticket",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, actions: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    tickets,
    pendingTickets,
    inProgressTickets,
    approvalTickets,
    employees,
    isLoading,
    error,
    fetchData,
    cancelTicket,
    assignEmployee,
    completeTicket
  };
};