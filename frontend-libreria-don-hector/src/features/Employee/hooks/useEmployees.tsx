import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employee.service';
import { 
  Employee,
  EmployeeFormData,
  UpdateEmployeeData,
  DeactivateEmployeeData
} from '../types/employee.types';
import { toast } from '@/hooks/Toast/use-toast';

export const EMPLOYEES_QUERY_KEYS = {
  all: ['employees'] as const,
};

export const useEmployees = () => {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isInvoicesDialogOpen, setIsInvoicesDialogOpen] = useState(false);
  // Query para obtener todos los empleados
  const { 
    data: employees = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: EMPLOYEES_QUERY_KEYS.all,
    queryFn: employeeService.getAllEmployees,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear empleado
  const createMutation = useMutation({
    mutationFn: (newEmployee: EmployeeFormData) => 
      employeeService.createEmployee(newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEYS.all });
      setIsCreateDialogOpen(false);
      toast({
        title: "Empleado creado",
        description: "El empleado ha sido creado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo crear el empleado.",
        variant: "destructive",
      });
    }
  });

  // Mutación para actualizar empleado
  const updateMutation = useMutation({
    mutationFn: (updateData: UpdateEmployeeData) => 
      employeeService.updateEmployee(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEYS.all });
      setIsUpdateDialogOpen(false);
      toast({
        title: "Empleado actualizado",
        description: "El empleado ha sido actualizado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo actualizar el empleado.",
        variant: "destructive",
      });
    }
  });

  // Mutación para desactivar empleado
  const deactivateMutation = useMutation({
    mutationFn: (deactivateData: DeactivateEmployeeData) => 
      employeeService.deactivateEmployee(deactivateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEYS.all });
      setIsDeactivateDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Empleado desactivado",
        description: "El empleado ha sido desactivado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo desactivar el empleado.",
        variant: "destructive",
      });
    }
  });

  // Handlers para dialogs
  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);

  const openUpdateDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedEmployee(null);
  };

  const openDeactivateDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeactivateDialogOpen(true);
  };
  const closeDeactivateDialog = () => {
    setIsDeactivateDialogOpen(false);
    setSelectedEmployee(null);
  };

  const openDetailsDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsDialogOpen(true);
  };
  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const openInvoicesDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsInvoicesDialogOpen(true);
  };

  const closeInvoicesDialog = () => {
    setIsInvoicesDialogOpen(false);
    setSelectedEmployee(null);
  };


  // Handlers para operaciones
  const createEmployee = (employeeData: EmployeeFormData) => {
    createMutation.mutate(employeeData);
  };

  const updateEmployee = (updateData: UpdateEmployeeData) => {
    updateMutation.mutate(updateData);
  };

  const deactivateEmployee = (deactivateData: DeactivateEmployeeData) => {
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
    employees,
    selectedEmployee,
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
    isInvoicesDialogOpen,

    
    // Dialog handlers
    openCreateDialog,
    closeCreateDialog,
    openUpdateDialog,
    closeUpdateDialog,
    openDeactivateDialog,
    closeDeactivateDialog,
    openDetailsDialog,
    closeDetailsDialog,
    openInvoicesDialog,
    closeInvoicesDialog,
    
    // Operations
    createEmployee,
    updateEmployee,
    deactivateEmployee,
    refetch,

    // Formatters
    formatDate
  };
};

export default useEmployees;
