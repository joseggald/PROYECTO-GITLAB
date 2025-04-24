export interface Supervisor {
    id_supervisor: number;
    nombre: string;
    apellido: string;
    cui: string;
    edad: number;
    genero: string;
    telefono: string;
    correo_electronico?: string;
    contrasena?: string;
    fecha_ingreso: string;
    fecha_baja?: string | null;
    razon_baja?: string | null;
    estado?: string;
    id_rol?: number;
  }
  
  export interface SupervisorFormData {
    id_supervisor?: number;
    nombre: string;
    apellido: string;
    cui: string;
    edad: number;
    genero: string;
    telefono: string;
    correo_electronico?: string;
    contrasena?: string;
    fecha_ingreso: string;
    fecha_baja?: string | null;
    razon_baja?: string | null;
    id_rol?: number;
  }
  
  export interface UpdateSupervisorData {
    id_supervisor: number;
    correo_electronico: string;
    telefono: string;
  }
  
  export interface DeactivateSupervisorData {
    id_supervisor: number;
    fecha_baja: string;
    razon_baja: string;
  }
  
  export interface SupervisorResponse {
    status: string;
    message: string;
    data: {
      supervisor: Supervisor[] | Supervisor;
    };
  }
  
  export interface SupervisorWithUser {
    supervisor: Supervisor;
    usuario: {
      id_usuario: number;
      correo_electronico: string;
      id_supervisor: number;
    };
  }