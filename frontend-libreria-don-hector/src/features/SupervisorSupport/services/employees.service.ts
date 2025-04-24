import { serviceApi } from "@/services/auth";
import {
  Employee,
  EmployeeResponse
} from "../types/gestionTickets.types";
import { useAuthStore } from '@/store/auth';


export const employeesService = {

  /**
   * Obtiene todos los empleados
   * @returns Lista de empleados
   */
  getAllEmployees: async (): Promise<Employee[]> => {
    try {
      const { data } = await serviceApi.get<EmployeeResponse>('/clients/getAll');
      const empleados = Array.isArray(data.data.employees) ? data.data.employees : [data.data.employees];
      const idSupervisor = useAuthStore.getState().user?.id_supervisor;
      if (idSupervisor === undefined) {
        throw new Error('Supervisor ID is undefined');
      }
      return empleados.filter((empleado: Employee) => empleado.id_supervisor === idSupervisor);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  },
}