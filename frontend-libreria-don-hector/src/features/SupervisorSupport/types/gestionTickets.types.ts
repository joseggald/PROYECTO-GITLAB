export interface Ticket {
    id_ticket: number;
    codigo_seguimiento: string;
    asunto: string;
    descripcion: string;
    categoria: string;
    estado: 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Cancelado' | 'Aprobación';
    fecha_creacion: string;
    fecha_actualizacion: string;
    FK_id_cliente: number;
    FK_id_empleado: number | null;
    cliente_nombre?: string;
    empleado_nombre?: string;
  }
  
  export interface Employee {
      id_empleado: number;
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
      fecha_contratacion?: string | null;
      estado?: string;
      id_rol?: number;
  }
  
  export interface EmployeeResponse {
      status: string;
      message: string;
      data: {
          employees: Employee[] | Employee;
      };
  }
  
  export interface CancelTicketData {
    id_ticket: number;
    razon: string;
  }
  
  export interface AssignTicketData {
    id_ticket: number;
    id_empleado: number;
  }