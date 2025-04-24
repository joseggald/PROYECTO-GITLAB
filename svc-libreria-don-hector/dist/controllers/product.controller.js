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
exports.ProductController = void 0;
const responses_1 = require("../utils/responses");
const Logger_1 = require("../utils/Logger");
const product_service_1 = require("../services/product.service");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class ProductController {
    constructor() {
        this.productService = new product_service_1.ProductService();
    }
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.productService.addProduct(req.body);
                res.status(201).json(product);
            }
            catch (error) {
                Logger_1.Logger.error("Error al agregar producto:", error);
                res.status(500).json({ status: "error", message: error.message });
            }
        });
    }
    /**
     * Obtiene todos los productos disponibles sin necesidad de autenticación.
     */
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Logger.info("Fetching public product list...");
                const products = yield this.productService.getAllProducts();
                sendSuccess(res, "Lista de productos obtenida correctamente.", { products });
            }
            catch (error) {
                Logger_1.Logger.error("Error fetching products:", error);
                sendError(res, "Error al obtener productos.", 500);
            }
        });
    }
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, nombre, categoria } = req.query;
                Logger_1.Logger.info("Consultando producto", { id, nombre, categoria });
                if (!id && !nombre && !categoria) {
                    sendError(res, "Debe proporcionar un ID, nombre o categoría para la consulta", 400);
                    return;
                }
                const product = yield this.productService.getProduct({ id, nombre, categoria });
                if (!product) {
                    sendError(res, "Producto no encontrado", 404);
                    return;
                }
                sendSuccess(res, "Producto encontrado", { product });
            }
            catch (error) {
                sendError(res, error.message, 500);
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_producto = parseInt(req.params.id);
                const product = yield this.productService.updateProduct(id_producto, req.body);
                res.status(200).json(product);
            }
            catch (error) {
                Logger_1.Logger.error("Error al actualizar producto:", error);
                res.status(500).json({ status: "error", message: error.message });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_producto = parseInt(req.params.id);
                const result = yield this.productService.deleteProduct(id_producto);
                res.status(200).json(result);
            }
            catch (error) {
                Logger_1.Logger.error("Error al eliminar producto:", error);
                res.status(404).json({ status: "error", message: error.message });
            }
        });
    }
    getTopRated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || !req.user.id_cliente) {
                    sendError(res, "Usuario no autenticado", 401);
                    return;
                }
                const idCliente = req.user.id_cliente;
                Logger_1.Logger.info("Usuario autenticado con ID Cliente:", idCliente);
                const products = yield this.productService.getTopRatedProducts(idCliente);
                sendSuccess(res, "Productos más votados obtenidos exitosamente.", { idCliente, products });
            }
            catch (error) {
                Logger_1.Logger.error("Error al obtener productos más votados:", error);
                sendError(res, error.message, 500);
            }
        });
    }
    bulkUpdateProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = req.body.products;
                if (!Array.isArray(products) || products.length === 0) {
                    sendError(res, "Se requiere una lista de productos para actualizar", 400);
                    return;
                }
                Logger_1.Logger.info("Actualizando múltiples productos", products.map(p => p.id_producto));
                const updated = yield this.productService.updateMultipleProducts(products);
                sendSuccess(res, "Productos actualizados correctamente", { updated });
            }
            catch (error) {
                Logger_1.Logger.error("Error en bulkUpdateProducts:", error);
                sendError(res, error.message || "Error interno", 500);
            }
        });
    }
}
exports.ProductController = ProductController;
