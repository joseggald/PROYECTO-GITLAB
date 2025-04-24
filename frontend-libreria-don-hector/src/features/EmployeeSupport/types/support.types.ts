export interface ClientInfo {
    id_cliente: number;
    nombre: string;
    apellido: string;
    edad: number;
    email?: string;
    telefono?: string;
    correo_electronico?: string;
  }
  
  export interface Ticket {
    id_ticket: number;
    codigo_seguimiento: string;
    asunto: string;
    descripcion: string;
    categoria: string;
    estado: 'Pendiente' | 'En Proceso' | 'Aprobación' | 'Resuelto' | 'Cancelado';
    fecha_creacion: string;
    fecha_actualizacion: string;
    FK_id_cliente: number;
    fk_id_producto?: number;
    fk_id_cliente?: number;
    fk_id_empleado?: number;
    FK_id_empleado: number;
    cliente?: ClientInfo;
    producto_nombre?: string;
    correo_electronico?: string;
  }
  
  export interface TicketMessage {
    id_mensaje: number;
    FK_id_ticket: number;
    remitente_tipo: 'Cliente' | 'Empleado';
    remitente_id: number;
    mensaje: string;
    fecha_envio: string;
    nombre_remitente: string;
    avatar?: string;
  }