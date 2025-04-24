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
exports.EarningsReportController = void 0;
const responses_1 = require("../utils/responses");
const Logger_1 = require("../utils/Logger");
const EarningsReport_service_1 = require("../services/EarningsReport.service");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class EarningsReportController {
    constructor() {
        this.reportService = new EarningsReport_service_1.EarningsReportService();
    }
    getEarningsReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Logger.info("Generando reporte de ganancias...");
                const report = yield this.reportService.getEarningsReport();
                sendSuccess(res, "Reporte de ganancias generado exitosamente.", report);
            }
            catch (error) {
                sendError(res, error.message, 500);
            }
        });
    }
}
exports.EarningsReportController = EarningsReportController;
