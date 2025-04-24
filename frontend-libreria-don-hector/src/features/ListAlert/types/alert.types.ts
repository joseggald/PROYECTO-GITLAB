export interface AlertProduct {
    id_producto: number;
    nombre: string;
    stock: number;
    stock_minimo: number;
  }
  
  export interface AlertResponse {
    status: string;
    message: string;
    data: {
      products: AlertProduct[] | AlertProduct;
    };
  }