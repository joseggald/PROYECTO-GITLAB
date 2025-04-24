"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const responses_1 = require("../utils/responses");
const jwt_1 = require("../utils/jwt");
const { sendError } = responses_1.ResponseHandler;
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendError(res, 'No token provided', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            sendError(res, 'Invalid or expired token', 401);
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        sendError(res, 'Authentication failed', 401);
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.id_rol) {
            sendError(res, 'Unauthorized: No role found', 403);
            return;
        }
        if (!allowedRoles.includes(req.user.id_rol)) {
            sendError(res, 'Forbidden: You do not have permission to access this resource', 403);
            return;
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
