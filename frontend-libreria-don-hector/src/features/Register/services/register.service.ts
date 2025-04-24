import axios from "axios";
import { RegisterCredentials } from "../types/register.types";
import { serviceApi } from "@/services/auth";

export const registerService = {
  /**
   * Registra un nuevo usuario según su rol
   * Actualmente optimizado para rol 4 (Cliente)
   */
  register: async (credentials: RegisterCredentials): Promise<{ message: string }> => {
    try {
      let requestData;
      const contraseñaSupevisor = generarContraseña('supervisor');
      const contraseñaEmpleado = generarContraseña('empleado');
      
      switch(credentials.id_rol) {
        case 4: // Cliente
          requestData = {
            nombre: credentials.nombre,
            apellido: credentials.apellido,
            edad: credentials.edad,
            correo_electronico: credentials.correo_electronico,
            contrasena: credentials.contrasena,
            id_rol: 4
          };
          break;
          
        case 3: // Empleado - Para uso futuro
          requestData = {
            nombre: credentials.nombre,
            apellido: credentials.apellido,
            correo_electronico: credentials.correo_electronico,
            contrasena: contraseñaEmpleado,
            id_rol: 3,
            cui: credentials.cui,
            edad: credentials.edad,
            genero: credentials.genero,
            telefono: credentials.telefono,
            fecha_ingreso: new Date().toISOString().split('T')[0],
            fotografia: credentials.fotografia || "",
            fecha_baja: null,
            razon_baja: null,
            id_supervisor: credentials.id_supervisor
          };
          break;
          
        case 2: // Supervisor - Para uso futuro
          requestData = {
            nombre: credentials.nombre,
            apellido: credentials.apellido,
            correo_electronico: credentials.correo_electronico,
            contrasena: contraseñaSupevisor,
            id_rol: 2,
            cui: credentials.cui,
            edad: credentials.edad,
            genero: credentials.genero,
            telefono: credentials.telefono,
            fecha_ingreso: new Date().toISOString().split('T')[0],
            fecha_baja: null,
            razon_baja: ""
          };
          break;
          
        default:
          throw new Error("Rol no soportado para registro");
      }

      const response = await serviceApi.post<{
        status: string;
        message: string;
      }>('/users/register', requestData);
      
      return { message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
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

export default registerService;