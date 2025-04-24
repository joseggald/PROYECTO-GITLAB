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
exports.BookController = void 0;
const responses_1 = require("../utils/responses");
const Logger_1 = require("../utils/Logger");
const book_service_1 = require("../services/book.service");
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class BookController {
    constructor() {
        this.bookService = new book_service_1.BookService();
    }
    searchBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, autor, genero, precio_min, precio_max } = req.body;
                const filters = {
                    titulo: titulo ? String(titulo) : undefined,
                    autor: autor ? String(autor) : undefined,
                    genero: genero ? String(genero) : undefined,
                    precio_min: precio_min ? parseFloat(precio_min) : undefined,
                    precio_max: precio_max ? parseFloat(precio_max) : undefined,
                };
                Logger_1.Logger.info("Buscar libros por filtros:", filters);
                const books = yield this.bookService.searchBooks(filters);
                sendSuccess(res, "Libros encontrados correctamente.", { books });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    addBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookData = req.body;
                Logger_1.Logger.info("Añadiendo libro:", bookData);
                const book = yield this.bookService.addBook(bookData);
                sendSuccess(res, "Libro añadido correctamente.", { book });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_producto } = req.params;
                const bookData = req.body;
                Logger_1.Logger.info("Actualizando libro:", bookData);
                const updatedBook = yield this.bookService.updateBook(Number(id_producto), bookData);
                sendSuccess(res, "Libro actualizado correctamente.", { updatedBook });
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_producto } = req.params;
                Logger_1.Logger.info("Eliminando libro:", id_producto);
                yield this.bookService.deleteBook(Number(id_producto));
                sendSuccess(res, "Libro eliminado correctamente.");
            }
            catch (error) {
                sendError(res, error.message, 400);
            }
        });
    }
}
exports.BookController = BookController;
