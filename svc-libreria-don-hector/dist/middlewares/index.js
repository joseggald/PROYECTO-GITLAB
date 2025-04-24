"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMiddlewares = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const Logger_1 = require("../utils/Logger");
const initializeMiddlewares = (app) => {
    // Seguridad básica
    app.use((0, helmet_1.default)());
    // CORS
    app.use((0, cors_1.default)({
        origin: 'https://frontend-libreria-395333172641.us-central1.run.app',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range']
    }));
    // Parsers
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Compresión de respuestas
    app.use((0, compression_1.default)());
    // Logging de requests
    if (process.env.NODE_ENV !== 'test') {
        app.use((0, morgan_1.default)((tokens, req, res) => {
            return [
                `[${tokens.method(req, res)}]`,
                tokens.url(req, res),
                tokens.status(req, res),
                tokens['response-time'](req, res), 'ms'
            ].join(' ');
        }, {
            stream: {
                write: (message) => Logger_1.Logger.info(message.trim())
            }
        }));
    }
};
exports.initializeMiddlewares = initializeMiddlewares;
