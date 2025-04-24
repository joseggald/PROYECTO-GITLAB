export interface Sale {
    id_factura: number;
    fecha_emision: string;
    nombre_comprador: string;
    id_cliente: number;
    cliente_nombre: string;
    cliente_apellido: string;
    id_empleado: number | null;
    empleado_nombre: string | null;
    empleado_apellido: string | null;
    total_venta: string;
    detalles: SaleDetail[];
  }
  
  export interface SaleDetail {
    id_producto: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    categoria: string;
  }
  
  export interface EarningsReport {
    margen_ganancia: Margin[];
    ganancias_por_periodo: PeriodEarnings[];
    ganancias_por_categoria: CategoryEarnings[];
  }
  
  export interface Margin {
    id_producto: number;
    nombre: string;
    categoria: string;
    margen_ganancia: string;
  }
  
  export interface PeriodEarnings {
    periodo: string;
    ganancia_total: string;
  }
  
  export interface CategoryEarnings {
    categoria: string;
    ganancia_por_categoria: string;
  }
  
  export interface SalesReportResponse {
    data: Sale[];
  }
  
  export interface EarningsReportResponse {
    data: EarningsReport;
  }