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
exports.SalesReportController = void 0;
const salesReport_service_1 = require("../services/salesReport.service");
const Logger_1 = require("../utils/Logger");
class SalesReportController {
    constructor() {
        this.salesReportService = new salesReport_service_1.SalesReportService();
    }
    getSalesReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, id_cliente, id_empleado } = req.query;
                const startDateStr = startDate ? String(startDate) : undefined;
                const endDateStr = endDate ? String(endDate) : undefined;
                const idClienteNum = id_cliente ? parseInt(id_cliente) : null;
                const idEmpleadoNum = id_empleado ? parseInt(id_empleado) : null;
                if (idClienteNum !== null && isNaN(idClienteNum)) {
                    res.status(400).json({ status: "error", message: "id_cliente debe ser un número válido." });
                    return;
                }
                if (idEmpleadoNum !== null && isNaN(idEmpleadoNum)) {
                    res.status(400).json({ status: "error", message: "id_empleado debe ser un número válido." });
                    return;
                }
                const report = yield this.salesReportService.getSalesReport(startDateStr, endDateStr, idClienteNum, idEmpleadoNum);
                res.status(200).json(report);
                return;
            }
            catch (error) {
                Logger_1.Logger.error("Error al obtener el reporte de ventas:", error);
                res.status(500).json({ status: "error", message: error.message });
                return;
            }
        });
    }
    getSalesDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboardData = yield this.salesReportService.getSalesDashboard();
                res.status(200).json(dashboardData);
            }
            catch (error) {
                Logger_1.Logger.error("Error al obtener datos del dashboard:", error);
                res.status(500).json({ status: "error", message: error.message });
            }
        });
    }
}
exports.SalesReportController = SalesReportController;
