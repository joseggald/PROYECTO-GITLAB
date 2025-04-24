import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ResponseHandler } from '../utils/responses';
import { loginSchema, createUserSchema } from './validators/user.validator';
import { MailerController } from './mailer.controller'
import { generateAuthToken } from '../utils/jwt';
import { Logger } from '../utils/Logger';

const { sendSuccess, sendError } = ResponseHandler;

const mailer = new MailerController();

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createUserSchema.validate(req.body);
      
      Logger.info('Creating user:', value.correo_electronico);
      
      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }
      
      const user = await this.userService.createUser(value);

      mailer.sendEmail(value.correo_electronico, value.contrasena);

      sendSuccess(res, "Usuario creado correctamente.",{ user });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = loginSchema.validate(req.body);
      
      if (error) {
        sendError(res, `Validation error: ${error.message}`, 400);
        return;
      }

      const { correo_electronico, contrasena } = value;
      const user = await this.userService.validateUser(correo_electronico, contrasena);
      
      if (!user) {
        sendError(res, 'Usuario no existe o credenciales inválidas', 400);
        return;
      }

      const token = generateAuthToken(user);
      sendSuccess(res, "¡Login exitoso!", { user, token });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async getAllCliente(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.userService.getAllClients();
      sendSuccess(res, "Clientes obtenidos correctamente.", { clients });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}