import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responses";
import { Logger } from "../utils/Logger";
import { BookService } from "../services/book.service";

const { sendSuccess, sendError } = ResponseHandler;

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  public async searchBooks(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, autor, genero, precio_min, precio_max } = req.body;

      const filters = {
        titulo: titulo ? String(titulo) : undefined,
        autor: autor ? String(autor) : undefined,
        genero: genero ? String(genero) : undefined,
        precio_min: precio_min ? parseFloat(precio_min) : undefined,
        precio_max: precio_max ? parseFloat(precio_max) : undefined,
      };

      Logger.info("Buscar libros por filtros:", filters);

      const books = await this.bookService.searchBooks(filters);

      sendSuccess(res, "Libros encontrados correctamente.", { books });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  public async addBook(req: Request, res: Response): Promise<void> {
    try{
        const bookData = req.body;
        Logger.info("Añadiendo libro:", bookData);

        const book = await this.bookService.addBook(bookData);
        sendSuccess(res, "Libro añadido correctamente.", { book });
    }catch(error: any){
        sendError(res, error.message, 400);
    }
  }

  public async updateBook(req: Request, res: Response): Promise<void> {
    try{
        const { id_producto  } = req.params;
        const bookData = req.body;
        Logger.info("Actualizando libro:", bookData);
        const updatedBook = await this.bookService.updateBook(Number(id_producto), bookData);

        sendSuccess(res, "Libro actualizado correctamente.", { updatedBook });
    }catch(error: any){
        sendError(res, error.message, 400);
    }
  }

  public async deleteBook(req: Request, res: Response): Promise<void> {
    try{
        const { id_producto } = req.params;
        Logger.info("Eliminando libro:", id_producto);
        await this.bookService.deleteBook(Number(id_producto));

        sendSuccess(res, "Libro eliminado correctamente.");
    }catch(error: any){
        sendError(res, error.message, 400);
    }
  }
}