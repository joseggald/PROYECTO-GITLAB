import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supervisorService } from '../services/supervisor.service';
import { 
  Supervisor,
  SupervisorFormData,
  UpdateSupervisorData,
  DeactivateSupervisorData
} from '../types/supervisor.types';
import { toast } from '@/hooks/Toast/use-toast';

export const SUPERVISORS_QUERY_KEYS = {
  all: ['supervisors'] as const,
};

export const useSupervisors = () => {
  const queryClient = useQueryClient();
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Query para obtener todos los supervisores
  const { 
    data: supervisors = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: SUPERVISORS_QUERY_KEYS.all,
    queryFn: supervisorService.getAllSupervisors,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear supervisor
  const createMutation = useMutation({
    mutationFn: (newSupervisor: SupervisorFormData) => 
      supervisorService.createSupervisor(newSupervisor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERVISORS_QUERY_KEYS.all });
      setIsCreateDialogOpen(false);
      toast({
        title: "Supervisor creado",
        description: "El supervisor ha sido creado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo crear el supervisor.",
        variant: "destructive",
      });
    }
  });

  // Mutación para actualizar supervisor
  const updateMutation = useMutation({
    mutationFn: (updateData: UpdateSupervisorData) => 
      supervisorService.updateSupervisor(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERVISORS_QUERY_KEYS.all });
      setIsUpdateDialogOpen(false);
      toast({
        title: "Supervisor actualizado",
        description: "El supervisor ha sido actualizado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo actualizar el supervisor.",
        variant: "destructive",
      });
    }
  });

  // Mutación para desactivar supervisor
  const deactivateMutation = useMutation({
    mutationFn: (deactivateData: DeactivateSupervisorData) => 
      supervisorService.deactivateSupervisor(deactivateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERVISORS_QUERY_KEYS.all });
      setIsDeactivateDialogOpen(false);
      setSelectedSupervisor(null);
      toast({
        title: "Supervisor desactivado",
        description: "El supervisor ha sido desactivado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo desactivar el supervisor.",
        variant: "destructive",
      });
    }
  });

  // Handlers para dialogs
  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);

  const openUpdateDialog = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedSupervisor(null);
  };

  const openDeactivateDialog = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsDeactivateDialogOpen(true);
  };
  const closeDeactivateDialog = () => {
    setIsDeactivateDialogOpen(false);
    setSelectedSupervisor(null);
  };

  const openDetailsDialog = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsDetailsDialogOpen(true);
  };
  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedSupervisor(null);
  };

  // Handlers para operaciones
  const createSupervisor = (supervisorData: SupervisorFormData) => {
    createMutation.mutate(supervisorData);
  };

  const updateSupervisor = (updateData: UpdateSupervisorData) => {
    updateMutation.mutate(updateData);
  };

  const deactivateSupervisor = (deactivateData: DeactivateSupervisorData) => {
    deactivateMutation.mutate(deactivateData);
  };

  // Formatters
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return {
    supervisors,
    selectedSupervisor,
    isLoading,
    isError,
    error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    
    // Dialog states
    isCreateDialogOpen,
    isUpdateDialogOpen,
    isDeactivateDialogOpen,
    isDetailsDialogOpen,
    
    // Dialog handlers
    openCreateDialog,
    closeCreateDialog,
    openUpdateDialog,
    closeUpdateDialog,
    openDeactivateDialog,
    closeDeactivateDialog,
    openDetailsDialog,
    closeDetailsDialog,
    
    // Operations
    createSupervisor,
    updateSupervisor,
    deactivateSupervisor,
    refetch,

    // Formatters
    formatDate
  };
};

export default useSupervisors;