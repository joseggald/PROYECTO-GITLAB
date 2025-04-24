import { serviceApi } from "@/services/auth";
import { 
  Supervisor, 
  SupervisorFormData, 
  UpdateSupervisorData, 
  DeactivateSupervisorData, 
  SupervisorResponse,
  SupervisorWithUser
} from "../types/supervisor.types";

export const supervisorService = {
  /**
   * Obtiene todos los supervisores
   * @returns Lista de supervisores
   */
  getAllSupervisors: async (): Promise<Supervisor[]> => {
    try {
      const { data } = await serviceApi.get<SupervisorResponse>('/supervisor/getAll');
      return Array.isArray(data.data.supervisor) ? data.data.supervisor : [data.data.supervisor];
    } catch (error) {
      console.error('Error al obtener supervisores:', error);
      return [];
    }
  },

  /**
   * Crea un nuevo supervisor
   * @param supervisorData Datos del supervisor a crear
   * @returns El supervisor creado
   */
  createSupervisor: async (supervisorData: SupervisorFormData): Promise<Supervisor> => {
    try {
      supervisorData.contrasena = generarContraseña('supervisor');
      supervisorData.id_rol = 2;
      console.log('supervisorData', supervisorData);
      const { data } = await serviceApi.post<SupervisorResponse>('/users/register', supervisorData);
      return Array.isArray(data.data.supervisor) 
        ? data.data.supervisor[0] 
        : data.data.supervisor as Supervisor;
    } catch (error) {
      console.error('Error al crear supervisor:', error);
      throw error;
    }
  },

  /**
   * Actualiza un supervisor existente
   * @param updateData Datos a actualizar del supervisor
   * @returns El supervisor actualizado con usuario
   */
  updateSupervisor: async (updateData: UpdateSupervisorData): Promise<SupervisorWithUser> => {
    try {
      const { data } = await serviceApi.put('/supervisor/update', updateData);
      return data.data.supervisor;
    } catch (error) {
      console.error('Error al actualizar supervisor:', error);
      throw error;
    }
  },

  /**
   * Desactiva un supervisor
   * @param deactivateData Datos para desactivar el supervisor
   * @returns El supervisor desactivado
   */
  deactivateSupervisor: async (deactivateData: DeactivateSupervisorData): Promise<Supervisor> => {
    try {
      const { data } = await serviceApi.post<SupervisorResponse>('/supervisor/deactive', deactivateData);
      return Array.isArray(data.data.supervisor) 
        ? data.data.supervisor[0] 
        : data.data.supervisor as Supervisor;
    } catch (error) {
      console.error('Error al desactivar supervisor:', error);
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
  function mezclarCadena(cadena:string) {
    const array = cadena.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }
  
export default supervisorService;