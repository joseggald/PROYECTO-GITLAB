"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateEmployeeSchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEmployeeSchema = joi_1.default.object({
    nombre: joi_1.default.string().max(50).required(),
    apellido: joi_1.default.string().max(50).required(),
    cui: joi_1.default.string().max(20).required(),
    telefono: joi_1.default.string().max(20).required(),
    edad: joi_1.default.number().integer().greater(18).required(),
    genero: joi_1.default.string().max(10).required(),
    fecha_contratacion: joi_1.default.date(),
    fotografia: joi_1.default.string().max(255).allow(null, ""),
    estado: joi_1.default.string().max(20).required(),
    razon_baja: joi_1.default.string().allow(null, ""),
    fecha_baja: joi_1.default.date().allow(null),
    id_supervisor: joi_1.default.number().integer().required()
});
exports.updateEmployeeSchema = joi_1.default.object({
    id_empleado: joi_1.default.number().integer().required(),
    correo_electronico: joi_1.default.string().email().max(100).required(),
    telefono: joi_1.default.string().max(20).required(),
});
exports.deactivateEmployeeSchema = joi_1.default.object({
    id_empleado: joi_1.default.number().integer().required(),
    razon_baja: joi_1.default.string().required(),
    fecha_baja: joi_1.default.date().required(),
});
