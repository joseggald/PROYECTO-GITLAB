import { Request, Response } from "express";
import { SalesReportService } from "../services/salesReport.service";
import { Logger } from "../utils/Logger";

export class SalesReportController {
    private salesReportService: SalesReportService;

    constructor() {
        this.salesReportService = new SalesReportService();
    }

    public async getSalesReport(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate, id_cliente, id_empleado } = req.query;
    

            const startDateStr = startDate ? String(startDate) : undefined;
            const endDateStr = endDate ? String(endDate) : undefined;
            const idClienteNum = id_cliente ? parseInt(id_cliente as string) : null;
            const idEmpleadoNum = id_empleado ? parseInt(id_empleado as string) : null;
    
            if (idClienteNum !== null && isNaN(idClienteNum)) {
                res.status(400).json({ status: "error", message: "id_cliente debe ser un número válido." });
                return;
            }
            if (idEmpleadoNum !== null && isNaN(idEmpleadoNum)) {
                res.status(400).json({ status: "error", message: "id_empleado debe ser un número válido." });
                return;
            }
    

            const report = await this.salesReportService.getSalesReport(
                startDateStr,
                endDateStr,
                idClienteNum,
                idEmpleadoNum
            );
    
            res.status(200).json(report);
            return; 
        } catch (error: any) {
            Logger.error("Error al obtener el reporte de ventas:", error);
            res.status(500).json({ status: "error", message: error.message });
            return; 
        }
    }

    
    public async getSalesDashboard(req: Request, res: Response): Promise<void> {
        try {
            const dashboardData = await this.salesReportService.getSalesDashboard();
            res.status(200).json(dashboardData);
        } catch (error: any) {
            Logger.error("Error al obtener datos del dashboard:", error);
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}
