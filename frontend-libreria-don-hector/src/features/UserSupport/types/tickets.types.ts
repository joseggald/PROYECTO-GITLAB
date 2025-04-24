export interface Ticket {
    id_ticket: number;
    codigo_seguimiento: string;
    asunto: string;
    descripcion: string;
    categoria: string;
    estado: 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Cancelado';
    fecha_creacion: string;
    fecha_actualizacion: string;
    FK_id_cliente: number;
    FK_id_empleado: number | null;
    FK_id_producto: number | null;
    archivo_adjunto: string | null;
    empleado_nombre?: string;
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