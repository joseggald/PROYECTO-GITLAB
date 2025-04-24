"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    nombre: joi_1.default.string().max(50).required(),
    apellido: joi_1.default.string().max(50).required(),
    correo_electronico: joi_1.default.string().email().max(100).required(),
    contrasena: joi_1.default.string().max(255).required(),
    id_rol: joi_1.default.number().integer().valid(1, 2, 3, 4).required(),
    // Campos opcionales para todos los roles
    cui: joi_1.default.string().max(20).allow(null),
    edad: joi_1.default.number().integer().min(0).allow(null),
    genero: joi_1.default.string().allow(null),
    telefono: joi_1.default.string().max(20).allow(null),
    fecha_ingreso: joi_1.default.date().allow(null),
    fotografia: joi_1.default.string().max(255).allow(null),
    fecha_baja: joi_1.default.date().allow(null),
    razon_baja: joi_1.default.string().allow(null),
    id_supervisor: joi_1.default.number().integer().allow(null),
});
exports.loginSchema = joi_1.default.object({
    correo_electronico: joi_1.default.string().email().max(100).required(),
    contrasena: joi_1.default.string().max(255).required(),
});
