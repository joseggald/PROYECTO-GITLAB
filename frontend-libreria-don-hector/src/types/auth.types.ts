// src/types/auth.types.ts
export enum UserRole {
  GERENTE = 1,
  SUPERVISOR = 2,
  EMPLEADO = 3,
  CLIENTE = 4
}

// Datos básicos para el login
export interface LoginCredentials {
  correo_electronico: string;
  contrasena: string;
}

// Datos del usuario base con información común
export interface User {
  id: string;
  correo_electronico: string;
  role: UserRole;
  id_rol: number;
  id_cliente: number | null;
  id_supervisor: number | null;
  id_empleado: number | null;
  nombre?: string;
  apellido?: string;
  cui?: string;
  edad?: number;
  genero?: string;
  telefono?: string;
  estado?: string;
  fecha_contratacion?: string;
  fecha_ingreso?: string;
  fecha_baja?: string;
  razon_baja?: string;
  fotografia?: string;
  direccion?: string;
}

// Estructura de respuesta del servidor para auth
export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: {
      id_usuario: number;
      correo_electronico: string;
      id_rol: number;
      id_cliente: number | null;
      id_supervisor: number | null;
      id_empleado: number | null;
      // Propiedades adicionales que pueden venir dependiendo del rol
      nombre?: string;
      apellido?: string;
      cui?: string;
      edad?: number;
      genero?: string;
      telefono?: string;
      estado?: string;
      fecha_ingreso?: string;
      fecha_contratacion?: string;
      fecha_baja?: string;
      razon_baja?: string;
      fotografia?: string;
    };
    token: string;
    client?: unknown;
  };
}

// Rutas por defecto para cada rol
export const DEFAULT_ROUTES: Record<UserRole, string> = {
  [UserRole.GERENTE]: '/dashboard',
  [UserRole.SUPERVISOR]: '/dashboard',
  [UserRole.EMPLEADO]: '/dashboard',
  [UserRole.CLIENTE]: '/tienda/libros'
};