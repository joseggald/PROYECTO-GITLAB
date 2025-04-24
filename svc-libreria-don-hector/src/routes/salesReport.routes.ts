import { Router } from "express";
import { SalesReportController } from "../controllers/salesReport.controller";
import { EarningsReportController } from "../controllers/EarningsReport.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from "../dictionaries/roles";

const { SUPERVISOR, GERENTE } = ROLES;

const router = Router();
const salesReportController = new SalesReportController();

const earningsReportController = new EarningsReportController();

router.use(authMiddleware);



//filtros opcionales
router.get("/sales-report", salesReportController.getSalesReport.bind(salesReportController));

router.get("/sales-dashboard", salesReportController.getSalesDashboard.bind(salesReportController));

//Reporte de ganacias

router.get("/earnings-report", roleMiddleware([SUPERVISOR, GERENTE]), earningsReportController.getEarningsReport.bind(earningsReportController));




export { router as salesReportRoutes };
