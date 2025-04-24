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
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const responses_1 = require("../utils/responses");
const user_validator_1 = require("./validators/user.validator");
const mailer_controller_1 = require("./mailer.controller");
const jwt_1 = require("../utils/jwt");
const Logger_1 = require("../utils/Logger");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
const mailer = new mailer_controller_1.MailerController();
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = user_validator_1.createUserSchema.validate(req.body);
                Logger_1.Logger.info('Creating user:', value.correo_electronico);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const user = yield this.userService.createUser(value);
                mailer.sendEmail(value.correo_electronico, value.contrasena);
                sendSuccess(res, "Usuario creado correctamente.", { user });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = user_validator_1.loginSchema.validate(req.body);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const { correo_electronico, contrasena } = value;
                const user = yield this.userService.validateUser(correo_electronico, contrasena);
                if (!user) {
                    sendError(res, 'Usuario no existe o credenciales inválidas', 400);
                    return;
                }
                const token = (0, jwt_1.generateAuthToken)(user);
                sendSuccess(res, "¡Login exitoso!", { user, token });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    getAllCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield this.userService.getAllClients();
                sendSuccess(res, "Clientes obtenidos correctamente.", { clients });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
}
exports.UserController = UserController;
