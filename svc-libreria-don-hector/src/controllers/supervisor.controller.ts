import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responses";
import {
  createSupervisorSchema,
  deactivateSupervisorSchema,
  updateSupervisorSchema,
} from "./validators/supervisor.validator";
import { SupervisorService } from "../services/supervisor.service";
import { Logger } from "../utils/Logger";

const { sendSuccess, sendError } = ResponseHandler;

export class SupervisorController {
  private supervisorService: SupervisorService;

  constructor() {
    this.supervisorService = new SupervisorService();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const supervisor = await this.supervisorService.getAllSupervisor();

      sendSuccess(res, "Supervisores obtenidos correctamente.", { supervisor });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = updateSupervisorSchema.validate(req.body);

      Logger.info("Updating supervisor:", value.id_supervisor);

      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }

      const supervisor = await this.supervisorService.updateSupervisor(value);

      sendSuccess(res, "Supervisor actualizado correctamente.", { supervisor });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async deactive(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = deactivateSupervisorSchema.validate(req.body);

      Logger.info("Deactivating supervisor:", value);

      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }

      const supervisor = await this.supervisorService.deactivateSupervisor(
        value
      );

      sendSuccess(res, "Supervisor desactivado correctamente.", { supervisor });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createSupervisorSchema.validate(req.body);

      Logger.info("Creating supervisor");

      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }

      const supervisor = await this.supervisorService.createSupervisor(value);

      sendSuccess(res, "Empleado creado correctamente.", { supervisor });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
