import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responses";
import { Logger } from "../utils/Logger";
import { CommentService } from "../services/comment.service";
import { createCommentSchema, updateCommentSchema } from "./validators/comment.validator";


const { sendSuccess, sendError } = ResponseHandler;

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  public async getByProductId(req: Request, res: Response): Promise<void> {
    try {
        const { id_producto } = req.params;
        Logger.info(`Obteniendo comentario para el ID: ${id_producto}`);
  
        const comments = await this.commentService.getByProductId(parseInt(id_producto));
        sendSuccess(res, "Comentarios obtenidos correctamente.", { comments });
      } catch (error: any) {
        sendError(res, "Error al obtener los comentarios.", 500);
      }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { error, value } = createCommentSchema.validate(req.body);
            if (error) {
            sendError(res, `Validation error: ${error.message}`, 400);
            return;
            }

            Logger.info("Creating comment:", value);
            const comment = await this.commentService.create(value);
            sendSuccess(res, "Comentario agregado correctamente.", { comment });
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
        }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { error, value } = updateCommentSchema.validate(req.body);
            if (error) {
                sendError(res, `Validation error: ${error.message}`, 400);
                return;
            }

            const { id_comentario } = req.params;
            Logger.info(`actualizar comentario ID: ${id_comentario}`);
            const updatedComment = await this.commentService.update(parseInt(id_comentario), value);
            sendSuccess(res, "Comentario actualizado correctamente.", { updatedComment });
            } catch (error: any) {
                sendError(res, error.message, 400);
            }
        }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_comentario } = req.params;
            Logger.info(`Eliminar comentario ID: ${id_comentario}`);

            await this.commentService.delete(parseInt(id_comentario));
            sendSuccess(res, "Comentario eliminado correctamente.");
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }
}