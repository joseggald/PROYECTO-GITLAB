export interface RegisterFormData {
  // Campos comunes a todos los roles
  correo_electronico: string;
  contrasena: string;
  confirmarContrasena: string;
  nombre: string;
  apellido: string;
  edad: number;
  
  // Campos específicos para roles de Empleado (3) y Supervisor (2)
  cui?: string;
  genero?: string;
  telefono?: string;
  fotografia?: string;
  id_supervisor?: number; // Solo para Empleado
}

export interface RegisterCredentials {
  // Campos comunes a todos los roles
  correo_electronico: string;
  contrasena: string;
  id_rol: number;
  nombre: string;
  apellido: string;
  edad: number;
  
  // Campos específicos para roles de Empleado (3) y Supervisor (2)
  cui?: string;
  genero?: string;
  telefono?: string;
  fotografia?: string;
  id_supervisor?: number; // Solo para Empleado
}

export interface RegisterResponse {
  status: string;
  message: string;
}