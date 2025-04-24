import { BookService } from '../../../src/services/book.service';
import { dbManager } from '../../../src/config/database';
import { Logger } from "../../../src/utils/Logger";

jest.mock('../../../src/config/database', () => ({
  dbManager: {
    getConnection: jest.fn()
  }
}));

jest.mock('../../../src/utils/Logger', () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn()
  }
}));

describe('BookService', () => {
  let bookService: BookService;
  const mockPool = {
    connect: jest.fn()
  };
  const mockClient = {
    query: jest.fn(),
    release: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dbManager.getConnection as jest.Mock).mockReturnValue(mockPool);
    mockPool.connect.mockResolvedValue(mockClient);
    bookService = new BookService();
  });

  describe('searchBooks', () => {
    it('debe buscar libros sin filtros', async () => {
      const mockBooks = [
        { id_producto: 1, nombre: 'Libro 1' },
        { id_producto: 2, nombre: 'Libro 2' }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockBooks });
      
      const result = await bookService.searchBooks({});
      
      expect(result).toEqual(mockBooks);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Producto WHERE es_libro = TRUE'),
        []
      );
    });

    it('debe buscar libros con filtro de título', async () => {
      const mockBooks = [
        { id_producto: 1, nombre: 'React para principiantes' }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockBooks });
      
      const result = await bookService.searchBooks({ titulo: 'React' });
      
      expect(result).toEqual(mockBooks);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(nombre) LIKE LOWER($1)'),
        expect.arrayContaining(['%React%'])
      );
    });

    it('debe buscar libros con filtro de autor', async () => {
      const mockBooks = [
        { id_producto: 1, nombre: 'Cien años de soledad', autor: 'Gabriel García Márquez' }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockBooks });
      
      const result = await bookService.searchBooks({ autor: 'García Márquez' });
      
      expect(result).toEqual(mockBooks);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(autor) LIKE LOWER($'),
        expect.arrayContaining(['%García Márquez%'])
      );
    });

    it('debe buscar libros con filtro de categoría/género', async () => {
      const mockBooks = [
        { id_producto: 1, nombre: 'El Señor de los Anillos', categoria: 'Fantasía' }
      ];
      
      mockClient.query.mockResolvedValueOnce({ rows: mockBooks });
      
      const result = await bookService.searchBooks({ genero: 'Fantasía' });
      
      expect(result).toEqual(mockBooks);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(categoria) LIKE LOWER($'),
        expect.arrayContaining(['%Fantasía%'])
      );
    });

    it('debe manejar errores en la búsqueda', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Error de conexión'));
      
      await expect(bookService.searchBooks({})).rejects.toThrow('Error de conexión');
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('addBook', () => {
    it('debe agregar un libro correctamente', async () => {
      const mockBook = {
        id_producto: 1,
        nombre: 'Nuevo Libro',
        autor: 'Autor Test',
        codigo_producto: 'LIB-001',
        fecha_lanzamiento: '2025-01-01',
        descripcion: 'Un libro de prueba',
        categoria: 'Ficción',
        stock: 10,
        precio_compra: 15.0,
        precio_venta: 25.0
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockBook] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const result = await bookService.addBook(mockBook);
      
      expect(result).toEqual(mockBook);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO Producto'),
        expect.arrayContaining([mockBook.nombre])
      );
    });
    
    it('debe manejar errores en la inserción de libros', async () => {
      const mockBook = {
        nombre: 'Libro con Error',
        autor: 'Autor Test'
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      const error = new Error('Error de inserción');
      mockClient.query.mockRejectedValueOnce(error);
      
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(bookService.addBook(mockBook)).rejects.toThrow('Error de inserción');
      
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    it('debe actualizar un libro correctamente', async () => {
      const bookId = 1;
      const updateData = {
        nombre: 'Libro Actualizado',
        precio_venta: 30.0
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ id_producto: bookId }] 
      });
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{...updateData, id_producto: bookId}] 
      });
      
      mockClient.query.mockResolvedValueOnce({});
      
      const result = await bookService.updateBook(bookId, updateData);
      
      expect(result).toEqual({...updateData, id_producto: bookId});
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE Producto'),
        expect.arrayContaining([updateData.nombre])
      );
    });
    
    it('debe lanzar error si el libro no existe', async () => {
      const bookId = 999;
      const updateData = {
        nombre: 'Libro Inexistente'
      };
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ rows: [] });
      
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(bookService.updateBook(bookId, updateData)).rejects.toThrow('El producto no existe o no es un libro.');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('deleteBook', () => {
    it('debe eliminar un libro correctamente', async () => {
      const bookId = 1;
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ id_producto: bookId }] 
      });
      
      mockClient.query.mockResolvedValueOnce({ rowCount: 1 });
      
      mockClient.query.mockResolvedValueOnce({ rowCount: 1 });
      
      mockClient.query.mockResolvedValueOnce({});
      
      await bookService.deleteBook(bookId);
      
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM Producto WHERE id_producto = $1'),
        [bookId]
      );
    });
    
    it('debe lanzar error si el libro no existe', async () => {
      const bookId = 999;
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ rows: [] });
      
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(bookService.deleteBook(bookId)).rejects.toThrow('El producto no existe o no es un libro.');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
    
    it('debe manejar errores durante la eliminación', async () => {
      const bookId = 1;
      
      mockClient.query.mockResolvedValueOnce({});
      
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ id_producto: bookId }] 
      });
      
      const error = new Error('Error al eliminar');
      mockClient.query.mockRejectedValueOnce(error);
      
      mockClient.query.mockResolvedValueOnce({});
      
      await expect(bookService.deleteBook(bookId)).rejects.toThrow('Error al eliminar');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(Logger.error).toHaveBeenCalled();
    });
  });
});