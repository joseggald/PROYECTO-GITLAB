import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responses";
import { Logger } from "../utils/Logger";
import { ProductService } from "../services/product.service";

const { sendSuccess, sendError } = ResponseHandler;

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public async addProduct(req: Request, res: Response): Promise<void> {
    try {
        const product = await this.productService.addProduct(req.body);
        res.status(201).json(product);
    } catch (error: any) {
        Logger.error("Error al agregar producto:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
}

  /**
   * Obtiene todos los productos disponibles sin necesidad de autenticación.
   */
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Fetching public product list...");

      const products = await this.productService.getAllProducts();

      sendSuccess(res, "Lista de productos obtenida correctamente.", { products });
    } catch (error: any) {
      Logger.error("Error fetching products:", error);
      sendError(res, "Error al obtener productos.", 500);
    }
  }


  public async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id, nombre, categoria } = req.query as { id?: string, nombre?: string, categoria?: string };

      Logger.info("Consultando producto", { id, nombre, categoria });
      
      if (!id && !nombre && !categoria) {
        sendError(res, "Debe proporcionar un ID, nombre o categoría para la consulta", 400);
        return;
      }

      const product = await this.productService.getProduct({ id, nombre, categoria });
      
      if (!product) {
        sendError(res, "Producto no encontrado", 404);
        return;
      }

      sendSuccess(res, "Producto encontrado", { product });
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
        const id_producto = parseInt(req.params.id);
        const product = await this.productService.updateProduct(id_producto, req.body);
        res.status(200).json(product);
    } catch (error: any) {
        Logger.error("Error al actualizar producto:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
        const id_producto = parseInt(req.params.id);
        const result = await this.productService.deleteProduct(id_producto);
        res.status(200).json(result);
    } catch (error: any) {
        Logger.error("Error al eliminar producto:", error);
        res.status(404).json({ status: "error", message: error.message });
    }
}

  public async getTopRated(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user || !req.user.id_cliente) {
            sendError(res, "Usuario no autenticado", 401);
            return;
        }

        const idCliente = req.user.id_cliente;
        Logger.info("Usuario autenticado con ID Cliente:", idCliente);

        const products = await this.productService.getTopRatedProducts(idCliente);

        sendSuccess(res, "Productos más votados obtenidos exitosamente.", { idCliente, products });
    } catch (error: any) {
        Logger.error("Error al obtener productos más votados:", error);
        sendError(res, error.message, 500);
    }
}

public async bulkUpdateProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = req.body.products;
    if (!Array.isArray(products) || products.length === 0) {
      sendError(res, "Se requiere una lista de productos para actualizar", 400);
      return;
    }

    Logger.info("Actualizando múltiples productos", products.map(p => p.id_producto));
    const updated = await this.productService.updateMultipleProducts(products);

    sendSuccess(res, "Productos actualizados correctamente", { updated });
  } catch (error: any) {
    Logger.error("Error en bulkUpdateProducts:", error);
    sendError(res, error.message || "Error interno", 500);
  }
}



}
