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
exports.HealthController = void 0;
const responses_1 = require("../utils/responses");
const health_validator_1 = require("./validators/health.validator");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class HealthController {
    /**
     * Método para verificar si la API está en funcionamiento
     * @param req - Objeto de solicitud HTTP de Express
     * @param res - Objeto de respuesta HTTP de Express
     */
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            sendSuccess(res, 'API is running');
        });
    }
    checkPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = health_validator_1.pongSchema.validate(req.body);
            if (error) {
                sendError(res, `Invalid pong value: ${error.message}`, 400);
                return;
            }
            const { pong } = value;
            if (pong === 1) {
                sendSuccess(res, 'ping');
            }
            else {
                sendError(res, 'Invalid pong value. Expected pong to be 1.', 400);
            }
        });
    }
}
exports.HealthController = HealthController;
