import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responses";
import { Logger } from "../utils/Logger";
import { EarningsReportService } from "../services/EarningsReport.service";

const { sendSuccess, sendError } = ResponseHandler;

export class EarningsReportController {
  private reportService: EarningsReportService;

  constructor() {
    this.reportService = new EarningsReportService();
  }

  public async getEarningsReport(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Generando reporte de ganancias...");

      const report = await this.reportService.getEarningsReport();

      sendSuccess(res, "Reporte de ganancias generado exitosamente.", report);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}
