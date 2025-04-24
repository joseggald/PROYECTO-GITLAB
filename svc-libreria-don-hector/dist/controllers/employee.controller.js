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
exports.EmployeeController = void 0;
const responses_1 = require("../utils/responses");
const Logger_1 = require("../utils/Logger");
const employee_service_1 = require("../services/employee.service");
const employee_validator_1 = require("./validators/employee.validator");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class EmployeeController {
    constructor() {
        this.employeeService = new employee_service_1.EmployeeService();
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Logger.info("Getting all employees");
                const employees = yield this.employeeService.getAllEmployees();
                sendSuccess(res, "Empleados obtenidos correctamente.", { employees });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = employee_validator_1.createEmployeeSchema.validate(req.body);
                Logger_1.Logger.info("Creating employee:", value.cui);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const employee = yield this.employeeService.createEmployee(value);
                sendSuccess(res, "Empleado creado correctamente.", { employee });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = employee_validator_1.updateEmployeeSchema.validate(req.body);
                Logger_1.Logger.info("Updating employee:", value.id_empleado);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const employee = yield this.employeeService.updateEmployee(value);
                sendSuccess(res, "Empleado actualizado correctamente.", { employee });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    deactivate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = employee_validator_1.deactivateEmployeeSchema.validate(req.body);
                Logger_1.Logger.info("Deactivating employee:", value);
                if (error) {
                    sendError(res, `Validation error: ${error.message}`, 400);
                    return;
                }
                const employee = yield this.employeeService.deactivateEmployee(value);
                sendSuccess(res, "Empleado desactivado correctamente.", { employee });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
