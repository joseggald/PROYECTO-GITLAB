"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const wishlist_service_1 = require("../services/wishlist.service");
const responses_1 = require("../utils/responses");
const Logger_1 = require("../utils/Logger");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class WishlistController {
    constructor() {
        this.wishlistService = new wishlist_service_1.WishlistService();
    }
    addToWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_usuario = req.user.id_usuario;
                const { id_producto } = req.body;
                Logger_1.Logger.info(`Adding book ${id_producto} to wishlist for user ${id_usuario}`);
                const result = yield this.wishlistService.addToWishlist(id_usuario, id_producto);
                sendSuccess(res, result.message);
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    getWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_usuario = req.user.id_usuario;
                Logger_1.Logger.info(`Fetching wishlist for user ${id_usuario}`);
                const wishlist = yield this.wishlistService.getWishlist(id_usuario);
                sendSuccess(res, "Lista de deseos obtenida correctamente.", { wishlist });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    removeFromWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_usuario = req.user.id_usuario;
                const { id_producto } = req.body;
                Logger_1.Logger.info(`Removing book ${id_producto} from wishlist for user ${id_usuario}`);
                yield this.wishlistService.removeFromWishlist(id_usuario, id_producto);
                sendSuccess(res, "Libro eliminado de la lista de deseos.");
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
}
exports.WishlistController = WishlistController;
