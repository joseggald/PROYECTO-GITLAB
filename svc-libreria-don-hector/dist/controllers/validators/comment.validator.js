"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.createCommentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCommentSchema = joi_1.default.object({
    id_cliente: joi_1.default.number().integer().required(),
    id_producto: joi_1.default.number().integer().required(),
    calificacion: joi_1.default.number().integer().min(1).max(5).required(),
    comentario: joi_1.default.string().max(500).required()
});
exports.updateCommentSchema = joi_1.default.object({
    calificacion: joi_1.default.number().integer().min(1).max(5).required(),
    comentario: joi_1.default.string().max(500).required()
});
