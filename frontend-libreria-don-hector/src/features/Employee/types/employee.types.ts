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
    facturas?: Invoice[];
}

export interface EmployeeFormData {
    id_empleado?: number;
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
    fecha_contratacion?: string | null;
    razon_baja?: string | null;
    id_rol?: number;
}

export interface UpdateEmployeeData {
    id_empleado: number;
    correo_electronico: string;
    telefono: string;
}

export interface DeactivateEmployeeData {
    id_empleado: number;
    fecha_baja: string;
    razon_baja: string;
}

export interface EmployeeResponse {
    status: string;
    message: string;
    data: {
        employees: Employee[] | Employee;
    };
}

export interface EmployeeWithUser {
    empleado: Employee;
    usuario: {
        id_usuario: number;
        correo_electronico: string;
        id_empleado: number;
    };
}

export interface Invoice {
    id_factura: number | null;
    fecha_emision: string | null;
    total_venta: number | null;
}