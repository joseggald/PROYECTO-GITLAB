"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const Logger_1 = require("../utils/Logger");
const errorHandler = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    Logger_1.Logger.error(`Error Handler: ${message}`, error);
    res.status(status).json({
        status: 'error',
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
};
exports.errorHandler = errorHandler;
