import { serviceApi } from "@/services/auth";
import {
  Employee,
  EmployeeFormData,
  UpdateEmployeeData,
  DeactivateEmployeeData,
  EmployeeResponse,
  EmployeeWithUser
} from "../types/employee.types";
import { useAuthStore } from '@/store/auth';


export const employeeService = {

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
      console.log(empleados)
      return empleados.filter((empleado: Employee) => empleado.id_supervisor === idSupervisor);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo empleado
   * @param employeeData Datos del empleado a crear
   * @returns El empleado creado
   */
  createEmployee: async (employeeData: EmployeeFormData): Promise<Employee> => {
    try {
      employeeData.contrasena = generarContraseña('empleado');
      employeeData.id_rol = 3;
      employeeData.id_supervisor = useAuthStore.getState().user?.id_supervisor ?? undefined;
      console.log('employeeData', employeeData);
      const { data } = await serviceApi.post<EmployeeResponse>('/users/register', employeeData);
      return Array.isArray(data.data.employees)
        ? data.data.employees[0]
        : data.data.employees as Employee;
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  },

  /**
   * Actualiza un empleado existente
   * @param updateData Datos a actualizar del empleado
   * @returns El empleado actualizado con usuario
   */
  updateEmployee: async (updateData: UpdateEmployeeData): Promise<EmployeeWithUser> => {
    try {
      const { data } = await serviceApi.put('/clients/update', updateData);
      return data.data.empleado;
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      throw error;
    }
  },

  /**
   * Desactiva un empleado
   * @param deactivateData Datos para desactivar el empleado
   * @returns El empleado desactivado
   */
  deactivateEmployee: async (deactivateData: DeactivateEmployeeData): Promise<Employee> => {
    try {
      const { data } = await serviceApi.post<EmployeeResponse>('/clients/deactivate', deactivateData);
      return Array.isArray(data.data.employees)
        ? data.data.employees[0]
        : data.data.employees as Employee;
    } catch (error) {
      console.error('Error al desactivar empleado:', error);
      throw error;
    }
  }
};



/**
 * Genera una contraseña segura según el tipo de usuario
 * @param tipo 'supervisor' o 'empleado'
 * @returns Contraseña generada
 */
function generarContraseña(tipo: 'supervisor' | 'empleado') {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const especiales = '!@#$%&*';

  const prefijo = tipo === 'supervisor' ? 'Sup' : 'Emp';

  const longitudMin = 5;

  let contraseña = prefijo;

  contraseña += letras.charAt(Math.floor(Math.random() * letras.length));

  contraseña += numeros.charAt(Math.floor(Math.random() * numeros.length));

  contraseña += especiales.charAt(Math.floor(Math.random() * especiales.length));

  const caracteresTotales = letras + numeros + especiales;
  while (contraseña.length < prefijo.length + longitudMin) {
    contraseña += caracteresTotales.charAt(Math.floor(Math.random() * caracteresTotales.length));
  }

  // Mezclar los caracteres (excepto el prefijo)
  const prefijoLength = prefijo.length;
  const resto = contraseña.slice(prefijoLength);
  const restoMezclado = mezclarCadena(resto);

  return prefijo + restoMezclado;
}

/**
 * Mezcla aleatoriamente los caracteres de una cadena
 * @param cadena Cadena a mezclar
 * @returns Cadena mezclada
 */
function mezclarCadena(cadena: string) {
  const array = cadena.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

export default employeeService;