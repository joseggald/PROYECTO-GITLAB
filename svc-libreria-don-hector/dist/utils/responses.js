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
exports.ResponseHandler = void 0;
const Logger_1 = require("./Logger");
class ResponseHandler {
    static sendSuccess(res_1, message_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (res, message, data, statusCode = 200) {
            const response = {
                status: 'success',
                message,
                data,
            };
            Logger_1.Logger.ok(`[${statusCode}] ${message}`);
            res.status(statusCode).json(response);
        });
    }
    static sendError(res_1, message_1) {
        return __awaiter(this, arguments, void 0, function* (res, message, statusCode = 500, data) {
            const response = {
                status: 'error',
                message,
                data
            };
            Logger_1.Logger.error(`[${statusCode}] ${message}`, data);
            res.status(statusCode).json(response);
        });
    }
}
exports.ResponseHandler = ResponseHandler;
