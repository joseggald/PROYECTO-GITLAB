import { Request, Response } from "express";
import { WishlistService } from "../services/wishlist.service";
import { ResponseHandler } from "../utils/responses";
import { Logger } from "../utils/Logger";

const { sendSuccess, sendError } = ResponseHandler;

export class WishlistController {
  private wishlistService: WishlistService;

  constructor() {
    this.wishlistService = new WishlistService();
  }

  public async addToWishlist(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.user.id_usuario;
      const { id_producto } = req.body;

      Logger.info(`Adding book ${id_producto} to wishlist for user ${id_usuario}`);

      const result = await this.wishlistService.addToWishlist(id_usuario, id_producto);
      sendSuccess(res, result.message);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async getWishlist(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.user.id_usuario;

      Logger.info(`Fetching wishlist for user ${id_usuario}`);

      const wishlist = await this.wishlistService.getWishlist(id_usuario);
      sendSuccess(res, "Lista de deseos obtenida correctamente.", { wishlist });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async removeFromWishlist(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.user.id_usuario;
      const { id_producto } = req.body;

      Logger.info(`Removing book ${id_producto} from wishlist for user ${id_usuario}`);

      await this.wishlistService.removeFromWishlist(id_usuario, id_producto);
      sendSuccess(res, "Libro eliminado de la lista de deseos.");
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
