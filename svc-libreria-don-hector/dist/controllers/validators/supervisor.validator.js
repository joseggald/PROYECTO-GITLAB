"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateSupervisorSchema = exports.updateSupervisorSchema = exports.createSupervisorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSupervisorSchema = joi_1.default.object({
    nombre: joi_1.default.string().max(50).required(),
    apellido: joi_1.default.string().max(50).required(),
    cui: joi_1.default.string().max(20).required(),
    edad: joi_1.default.number().integer().min(19).required(),
    genero: joi_1.default.string().max(10).required(),
    telefono: joi_1.default.string().max(20).required(),
    fecha_ingreso: joi_1.default.date().required(),
    fecha_baja: joi_1.default.date().optional().allow(null),
    razon_baja: joi_1.default.string().optional().allow(null),
});
exports.updateSupervisorSchema = joi_1.default.object({
    id_supervisor: joi_1.default.number().integer().required(),
    correo_electronico: joi_1.default.string().email().max(100).required(),
    telefono: joi_1.default.string().max(20).required(),
});
exports.deactivateSupervisorSchema = joi_1.default.object({
    id_supervisor: joi_1.default.number().integer().required(),
    razon_baja: joi_1.default.string().required(),
    fecha_baja: joi_1.default.date().required(),
});
