"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = __importDefault(require("../config/environment"));
const JWT_SECRET = environment_1.default.JWT.SECRET || 'default_secret';
const TOKEN_EXPIRATION = '1d'; // 1 día
const generateAuthToken = (user) => {
    const payload = {
        id_usuario: user.id_usuario,
        id_rol: user.id_rol,
        id_cliente: user.id_cliente || null,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};
exports.generateAuthToken = generateAuthToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
