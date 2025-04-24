"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesReportRoutes = void 0;
const express_1 = require("express");
const salesReport_controller_1 = require("../controllers/salesReport.controller");
const EarningsReport_controller_1 = require("../controllers/EarningsReport.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const roles_1 = require("../dictionaries/roles");
const { SUPERVISOR, GERENTE } = roles_1.ROLES;
const router = (0, express_1.Router)();
exports.salesReportRoutes = router;
const salesReportController = new salesReport_controller_1.SalesReportController();
const earningsReportController = new EarningsReport_controller_1.EarningsReportController();
router.use(auth_middleware_1.authMiddleware);
//filtros opcionales
router.get("/sales-report", salesReportController.getSalesReport.bind(salesReportController));
router.get("/sales-dashboard", salesReportController.getSalesDashboard.bind(salesReportController));
//Reporte de ganacias
router.get("/earnings-report", (0, auth_middleware_1.roleMiddleware)([SUPERVISOR, GERENTE]), earningsReportController.getEarningsReport.bind(earningsReportController));
