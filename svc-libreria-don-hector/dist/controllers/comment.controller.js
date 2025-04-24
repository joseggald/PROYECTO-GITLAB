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
exports.CommentController = void 0;
const responses_1 = require("../utils/responses");
const Logger_1 = require("../utils/Logger");
const comment_service_1 = require("../services/comment.service");
const comment_validator_1 = require("./validators/comment.validator");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class CommentController {
    constructor() {
        this.commentService = new comment_service_1.CommentService();
    }
    getByProductId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_producto } = req.params;
                Logger_1.Logger.info(`Obteniendo comentario para el ID: ${id_producto}`);
                const comments = yield this.commentService.getByProductId(parseInt(id_producto));
                sendSuccess(res, "Comentarios obtenidos correctamente.", { comments });
            }
            catch (error) {
                sendError(res, "Error al obtener los comentarios.", 500);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = comment_validator_1.createCommentSchema.validate(req.body);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                Logger_1.Logger.info("Creating comment:", value);
                const comment = yield this.commentService.create(value);
                sendSuccess(res, "Comentario agregado correctamente.", { comment });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = comment_validator_1.updateCommentSchema.validate(req.body);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const { id_comentario } = req.params;
                Logger_1.Logger.info(`actualizar comentario ID: ${id_comentario}`);
                const updatedComment = yield this.commentService.update(parseInt(id_comentario), value);
                sendSuccess(res, "Comentario actualizado correctamente.", { updatedComment });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_comentario } = req.params;
                Logger_1.Logger.info(`Eliminar comentario ID: ${id_comentario}`);
                yield this.commentService.delete(parseInt(id_comentario));
                sendSuccess(res, "Comentario eliminado correctamente.");
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
}
exports.CommentController = CommentController;
