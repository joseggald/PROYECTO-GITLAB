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
exports.SupervisorController = void 0;
const responses_1 = require("../utils/responses");
const supervisor_validator_1 = require("./validators/supervisor.validator");
const supervisor_service_1 = require("../services/supervisor.service");
const Logger_1 = require("../utils/Logger");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class SupervisorController {
    constructor() {
        this.supervisorService = new supervisor_service_1.SupervisorService();
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supervisor = yield this.supervisorService.getAllSupervisor();
                sendSuccess(res, "Supervisores obtenidos correctamente.", { supervisor });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = supervisor_validator_1.updateSupervisorSchema.validate(req.body);
                Logger_1.Logger.info("Updating supervisor:", value.id_supervisor);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const supervisor = yield this.supervisorService.updateSupervisor(value);
                sendSuccess(res, "Supervisor actualizado correctamente.", { supervisor });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    deactive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = supervisor_validator_1.deactivateSupervisorSchema.validate(req.body);
                Logger_1.Logger.info("Deactivating supervisor:", value);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const supervisor = yield this.supervisorService.deactivateSupervisor(value);
                sendSuccess(res, "Supervisor desactivado correctamente.", { supervisor });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = supervisor_validator_1.createSupervisorSchema.validate(req.body);
                Logger_1.Logger.info("Creating supervisor");
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const supervisor = yield this.supervisorService.createSupervisor(value);
                sendSuccess(res, "Empleado creado correctamente.", { supervisor });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
}
exports.SupervisorController = SupervisorController;
