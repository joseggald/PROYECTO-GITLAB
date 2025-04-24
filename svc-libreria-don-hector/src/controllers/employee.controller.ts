import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responses";
import { Logger } from "../utils/Logger";
import { EmployeeService } from "../services/employee.service";
import {
  createEmployeeSchema,
  deactivateEmployeeSchema,
  updateEmployeeSchema,
} from "./validators/employee.validator";

const { sendSuccess, sendError } = ResponseHandler;

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Getting all employees");

      const employees = await this.employeeService.getAllEmployees();

      sendSuccess(res, "Empleados obtenidos correctamente.", { employees });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createEmployeeSchema.validate(req.body);

      Logger.info("Creating employee:", value.cui);

      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }

      const employee = await this.employeeService.createEmployee(value);

      sendSuccess(res, "Empleado creado correctamente.", { employee });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = updateEmployeeSchema.validate(req.body);

      Logger.info("Updating employee:", value.id_empleado);

      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }

      const employee = await this.employeeService.updateEmployee(value);

      sendSuccess(res, "Empleado actualizado correctamente.", { employee });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = deactivateEmployeeSchema.validate(req.body);

      Logger.info("Deactivating employee:", value);

      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }

      const employee = await this.employeeService.deactivateEmployee(value);

      sendSuccess(res, "Empleado desactivado correctamente.", { employee });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
